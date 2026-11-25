"""Vaka kartlarını ("Rakamlarla Sonuçlar" altındaki kartlar) Jale verisiyle günceller.

Her kart: Meta ekran görüntüsü toplamları (baseline, 17 Ekim 2026'ya kadar) + o müşterinin
jale_sync'in sakladığı aylık kovaları. Kart sırası sayfadaki sırayla aynıdır.
`key` boş olan kart (ör. çalışması biten marka) baseline'da sabit kalır.
Repo herkese açık: kartlar marka adıyla değil, karmalı müşteri kimliğiyle eşleşir.
"""
import re

METRICS = ("spend", "revenue", "purchases")
SPEND_DECIMALS = 2
REVENUE_DECIMALS = 1
THOUSAND = 1000
MILLION = 1_000_000
LABELS = {"tr": ("harcama", "ciro"), "en": ("spend", "revenue")}

ARTICLE = re.compile(r'<article class="case">.*?</article>', re.S)
H3 = re.compile(r"<h3>[^<]*</h3>")
BAR = re.compile(r"--w: [\d.]+%")
DD = re.compile(r"<dd>[^<]*</dd>")


def case_totals(cases: list[dict], months: dict) -> list[dict]:
    """Her kart için baseline + kendi müşterisinin kovaları. Yeni liste döndürür."""
    def total(case: dict) -> dict:
        buckets = list(months.get(case["key"], {}).values()) if case["key"] else []
        return {m: case["baseline"][m] + sum(b[m] for b in buckets) for m in METRICS}
    return [total(c) for c in cases]


def _num(value: float, decimals: int, lang: str) -> str:
    text = f"{value:,.{decimals}f}"
    if lang == "tr":
        text = text.replace(",", "_").replace(".", ",").replace("_", ".")
    return text


def money(value: float, decimals: int, lang: str) -> str:
    thousands = round(value / THOUSAND)
    if thousands < THOUSAND:
        return f"₺{thousands} bin" if lang == "tr" else f"₺{thousands}K"
    return f"₺{_num(value / MILLION, decimals, lang)}M"


def _render_card(card: str, t: dict, lang: str) -> str:
    spend, revenue, purchases = t["spend"], t["revenue"], t["purchases"]
    spend_word, revenue_word = LABELS[lang]
    h3 = (f"<h3>{money(spend, SPEND_DECIMALS, lang)} {spend_word} → "
          f"{money(revenue, REVENUE_DECIMALS, lang)} {revenue_word}</h3>")
    stats = iter([
        f"<dd>{_num(revenue / spend, 1, lang)}x</dd>",
        f"<dd>{_num(purchases, 0, lang)}</dd>",
        f"<dd>~₺{round(spend / purchases)}</dd>",
    ])
    card = H3.sub(lambda _: h3, card, count=1)
    card = BAR.sub(f"--w: {spend / revenue * 100:.1f}%", card, count=1)
    return DD.sub(lambda _: next(stats), card, count=3)


def render_cases(html: str, totals: list[dict], lang: str) -> str:
    cards = list(ARTICLE.finditer(html))
    if len(cards) != len(totals):
        raise RuntimeError(f"{lang}: {len(totals)} vaka kartı bekleniyordu, {len(cards)} bulundu")
    out, last = [], 0
    for match, t in zip(cards, totals):
        out.append(html[last:match.start()])
        out.append(_render_card(match.group(0), t, lang))
        last = match.end()
    out.append(html[last:])
    return "".join(out)
