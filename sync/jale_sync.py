"""Jale API'sinden CPAS reklam verilerini çekip "Rakamlarla Sonuçlar" rakamlarını günceller.

Kural: veri sadece EKLENİR, hiçbir zaman silinmez.
- Başlangıç değeri (baseline): 17 Ekim 2026'ya kadarki Meta ekran görüntüsü toplamları, sabit.
- Jale'den kesim tarihinden sonraki günler, müşteri × ay kovaları halinde saklanır.
- Bir müşteri API'den kaybolursa ya da o ay için boş dönerse eski değer korunur.
- Aktif hesap sayısı hiç düşmez (en yüksek değer tutulur).

Repo herkese açık: veri dosyasına ve loglara marka adı yazılmaz, müşteri kimlikleri karmalanır.

Kullanım: JALE_API_KEY=... JALE_BASE_URL=... python3 sync/jale_sync.py
"""
import datetime as dt
import hashlib
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STATE_FILE = ROOT / "sync" / "reklam-verileri.json"
PAGES = {"tr": ROOT / "index.html", "en": ROOT / "en" / "index.html"}

ISTANBUL = dt.timezone(dt.timedelta(hours=3))
REFRESH_DAYS = 7  # Meta atıf penceresi: son 7 günü kapsayan aylar yeniden çekilir
REQUEST_GAP_S = 0.6
MAX_RETRIES = 8
PAGE_LIMIT = 100


# ---------- API ----------

def api_get(path, **params):
    base = os.environ["JALE_BASE_URL"].rstrip("/")
    url = f"{base}/{path}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(
        url, headers={"X-API-Key": os.environ["JALE_API_KEY"], "User-Agent": "site-sync"}
    )
    for attempt in range(MAX_RETRIES):
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                body = json.load(resp)
            time.sleep(REQUEST_GAP_S)
            if not body.get("success"):
                raise RuntimeError(f"{path}: API hata döndü: {body.get('error')}")
            return body
        except urllib.error.HTTPError as err:
            if err.code != 429 or attempt == MAX_RETRIES - 1:
                raise RuntimeError(f"{path}: HTTP {err.code}") from None
            time.sleep(int(err.headers.get("Retry-After") or 5) + 1)
    raise RuntimeError(f"{path}: deneme hakkı bitti")


def fetch_paged(path, **params):
    rows, page = [], 1
    while True:
        body = api_get(path, **params, page=page, limit=PAGE_LIMIT)
        rows.extend(body.get("data") or [])
        if not (body.get("meta") or {}).get("hasMore"):
            return rows
        page += 1


def customer_month_totals(customer_id, start, end):
    rows = fetch_paged("products", customerId=customer_id,
                       **{"from": start.isoformat(), "to": end.isoformat()})
    if not rows:
        return None
    return {
        "spend": round(sum(r.get("spend") or 0 for r in rows), 2),
        "revenue": round(sum(r.get("revenue") or 0 for r in rows), 2),
        "purchases": int(sum(r.get("purchases") or 0 for r in rows)),
    }


# ---------- Ay pencereleri ----------

def is_month_end(day):
    return (day + dt.timedelta(days=1)).day == 1


def month_windows(first_day, last_day):
    """first_day..last_day aralığını takvim aylarına böler: [("2026-10", başlangıç, bitiş), ...]"""
    windows, cursor = [], first_day
    while cursor <= last_day:
        next_month = (cursor.replace(day=1) + dt.timedelta(days=32)).replace(day=1)
        end = min(next_month - dt.timedelta(days=1), last_day)
        windows.append((cursor.strftime("%Y-%m"), cursor, end))
        cursor = next_month
    return windows


def months_to_fetch(state, windows, yesterday):
    final = set(state["finalMonths"])
    refresh_from = yesterday - dt.timedelta(days=REFRESH_DAYS)
    return [w for w in windows if w[0] not in final or w[2] >= refresh_from]


# ---------- Birleştirme (sadece ekleme) ----------

def anon_id(customer_id):
    return hashlib.sha256(customer_id.encode()).hexdigest()[:12]


def merge_month(months, key, month, totals):
    """Yeni değer varsa onu yazar (Meta düzeltmeleri), yoksa eskisini korur. Yeni sözlük döndürür."""
    if totals is None:
        return months
    customer = {**months.get(key, {}), month: totals}
    return {**months, key: customer}


def count_active_accounts(customers):
    return sum(
        1
        for c in customers
        if c.get("status") == "ACTIVE"
        for a in c.get("adAccounts") or []
        if a.get("status") == "ACTIVE"
    )


def compute_totals(state):
    base = state["baseline"]
    buckets = [m for cust in state["months"].values() for m in cust.values()]
    revenue = base["revenue"] + sum(b["revenue"] for b in buckets)
    spend = base["spend"] + sum(b["spend"] for b in buckets)
    return {
        "revenue": revenue,
        "spend": spend,
        "roas": revenue / spend if spend else 0,
        "accounts": state["accountsHigh"],
        "addedSinceBaseline": {
            "revenue": round(revenue - base["revenue"]),
            "spend": round(spend - base["spend"]),
            "purchases": sum(b["purchases"] for b in buckets),
        },
    }


# ---------- Sayfaya yazma ----------

def fmt(value, decimals, lang):
    text = f"{value:,.{decimals}f}"
    if lang == "tr":
        text = text.replace(",", "_").replace(".", ",").replace("_", ".")
    return text


# Sayfadaki sırayla: (değer anahtarı, ölçek, gösterilen ondalık, önek, sonek)
FIGURES = [
    ("revenue", 1e6, 0, "₺", "M"),
    ("roas", 1, 1, "", "x"),
    ("spend", 1e6, 1, "₺", "M"),
    ("accounts", 1, 0, "", ""),
]

RF_SPAN = re.compile(r'(<span class="rf-value" data-count=")[^"]*("[^>]*>)[^<]*(</span>)')


def render_page(html, totals, lang):
    spans = list(RF_SPAN.finditer(html))
    if len(spans) != len(FIGURES):
        raise RuntimeError(f"{lang}: {len(FIGURES)} rakam bekleniyordu, {len(spans)} bulundu")
    out, last = [], 0
    for match, (key, scale, decimals, prefix, suffix) in zip(spans, FIGURES):
        value = totals[key] / scale
        raw = f"{value:.2f}".rstrip("0").rstrip(".")
        shown = f"{prefix}{fmt(value, decimals, lang)}{suffix}"
        out.append(html[last:match.start()])
        out.append(f"{match.group(1)}{raw}{match.group(2)}{shown}{match.group(3)}")
        last = match.end()
    out.append(html[last:])
    return "".join(out)


# ---------- Ana akış ----------

def sync(state, today):
    cutoff = dt.date.fromisoformat(state["baseline"]["until"])
    yesterday = today - dt.timedelta(days=1)
    windows = month_windows(cutoff + dt.timedelta(days=1), yesterday)
    todo = months_to_fetch(state, windows, yesterday)

    customers = fetch_paged("customers")
    months = state["months"]
    for month, start, end in todo:
        for c in customers:
            months = merge_month(months, anon_id(c["id"]), month,
                                 customer_month_totals(c["id"], start, end))
        print(f"{month} ({start}..{end}) çekildi", flush=True)

    refresh_from = yesterday - dt.timedelta(days=REFRESH_DAYS)
    newly_final = [m for m, _, end in todo if is_month_end(end) and end < refresh_from]
    return {
        **state,
        "months": months,
        "finalMonths": sorted(set(state["finalMonths"]) | set(newly_final)),
        "accountsHigh": max(state["accountsHigh"], count_active_accounts(customers)),
        "syncedThrough": yesterday.isoformat(),
    }


def main():
    for var in ("JALE_API_KEY", "JALE_BASE_URL"):
        if not os.environ.get(var):
            sys.exit(f"{var} tanımlı değil")

    state = json.loads(STATE_FILE.read_text(encoding="utf-8"))
    today = dt.datetime.now(ISTANBUL).date()
    new_state = sync(state, today)
    totals = compute_totals(new_state)

    STATE_FILE.write_text(json.dumps(new_state, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    for lang, path in PAGES.items():
        path.write_text(render_page(path.read_text(encoding="utf-8"), totals, lang), encoding="utf-8")

    print(json.dumps({k: round(v, 2) if isinstance(v, float) else v for k, v in totals.items()},
                     ensure_ascii=False))


if __name__ == "__main__":
    main()
