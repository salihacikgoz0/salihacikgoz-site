"""vakalar için birim testleri (ağa çıkmaz). Çalıştırma: python3 sync/test_vakalar.py"""
import json
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import jale_sync as js  # noqa: E402
import vakalar as vk  # noqa: E402

CARD = (
    '<article class="case">\n'
    '        <p class="case-sector">X</p>\n'
    '        <h3>{h3}</h3>\n'
    '        <div class="case-bar" aria-hidden="true"><span class="case-spend" style="--w: 9.9%"></span></div>\n'
    '        <dl class="case-stats">\n'
    '          <div><dt>ROAS</dt><dd>1x</dd></div>\n'
    '          <div><dt>Satış</dt><dd>1</dd></div>\n'
    '          <div><dt>Reklam/satış</dt><dd>~₺1</dd></div>\n'
    '        </dl>\n'
    '      </article>\n'
)
PAGE = CARD.format(h3="a") + CARD.format(h3="b")

CASES = [
    {"key": "aaa", "baseline": {"spend": 1_670_000, "revenue": 38_243_000, "purchases": 60_121}},
    {"key": None, "baseline": {"spend": 435_000, "revenue": 8_352_000, "purchases": 8_878}},
]
MONTHS = {
    "aaa": {"2026-10": {"spend": 330_000, "revenue": 7_757_000, "purchases": 9_879}},
    "zzz": {"2026-10": {"spend": 1, "revenue": 1, "purchases": 1}},
}


class CaseTotalsTest(unittest.TestCase):
    def test_adds_only_own_customer_buckets_on_top_of_baseline(self):
        totals = vk.case_totals(CASES, MONTHS)
        self.assertEqual(totals[0], {"spend": 2_000_000, "revenue": 46_000_000, "purchases": 70_000})

    def test_card_without_key_stays_at_baseline(self):
        totals = vk.case_totals(CASES, MONTHS)
        self.assertEqual(totals[1], CASES[1]["baseline"])

    def test_does_not_mutate_input(self):
        before = json.dumps(CASES)
        vk.case_totals(CASES, MONTHS)
        self.assertEqual(json.dumps(CASES), before)


class MoneyTest(unittest.TestCase):
    def test_below_million_uses_thousands(self):
        self.assertEqual(vk.money(454_000, 2, "tr"), "₺454 bin")
        self.assertEqual(vk.money(454_000, 2, "en"), "₺454K")

    def test_million_with_decimals(self):
        self.assertEqual(vk.money(1_670_000, 2, "tr"), "₺1,67M")
        self.assertEqual(vk.money(38_243_000, 1, "en"), "₺38.2M")

    def test_value_rounding_to_1000_thousand_switches_to_million(self):
        self.assertEqual(vk.money(999_700, 2, "tr"), "₺1,00M")


class RenderCasesTest(unittest.TestCase):
    def test_turkish_card(self):
        totals = vk.case_totals(CASES, MONTHS)
        html = vk.render_cases(PAGE, totals, "tr")
        self.assertIn("<h3>₺2,00M harcama → ₺46,0M ciro</h3>", html)
        self.assertIn("--w: 4.3%", html)
        self.assertIn("<dd>23,0x</dd>", html)
        self.assertIn("<dd>70.000</dd>", html)
        self.assertIn("<dd>~₺29</dd>", html)
        self.assertIn("<h3>₺435 bin harcama → ₺8,4M ciro</h3>", html)
        self.assertIn("<dd>19,2x</dd>", html)

    def test_english_card(self):
        totals = vk.case_totals(CASES, MONTHS)
        html = vk.render_cases(PAGE, totals, "en")
        self.assertIn("<h3>₺2.00M spend → ₺46.0M revenue</h3>", html)
        self.assertIn("<dd>70,000</dd>", html)
        self.assertIn("<h3>₺435K spend → ₺8.4M revenue</h3>", html)

    def test_card_count_mismatch_fails_loudly(self):
        with self.assertRaises(RuntimeError):
            vk.render_cases(CARD.format(h3="a"), vk.case_totals(CASES, MONTHS), "tr")

    def test_saved_state_matches_current_pages(self):
        state = json.loads(js.STATE_FILE.read_text(encoding="utf-8"))
        totals = vk.case_totals(state["cases"], state["months"])
        for lang, path in js.PAGES.items():
            html = path.read_text(encoding="utf-8")
            self.assertEqual(vk.render_cases(html, totals, lang), html, lang)


if __name__ == "__main__":
    unittest.main()
