"""jale_sync için birim testleri (ağa çıkmaz). Çalıştırma: python3 sync/test_jale_sync.py"""
import datetime as dt
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import jale_sync as js  # noqa: E402

D = dt.date
PAGE = (
    '<span class="rf-value" data-count="91.95" data-prefix="₺" data-suffix="M" data-decimals="0">₺92M</span>'
    '<span class="rf-value" data-count="16.45" data-suffix="x" data-decimals="1">16,4x</span>'
    '<span class="rf-value" data-count="5.59" data-prefix="₺" data-suffix="M" data-decimals="1">₺5,6M</span>'
    '<span class="rf-value" data-count="68" data-decimals="0">68</span>'
)


def base_state(**over):
    state = {
        "baseline": {"until": "2026-10-17", "revenue": 91_950_000, "spend": 5_590_000, "accounts": 68},
        "months": {},
        "finalMonths": [],
        "accountsHigh": 68,
        "syncedThrough": None,
    }
    return {**state, **over}


class MonthWindowsTest(unittest.TestCase):
    def test_splits_range_into_calendar_months_starting_after_cutoff(self):
        windows = js.month_windows(D(2026, 10, 18), D(2026, 12, 3))
        self.assertEqual(windows, [
            ("2026-10", D(2026, 10, 18), D(2026, 10, 31)),
            ("2026-11", D(2026, 11, 1), D(2026, 11, 30)),
            ("2026-12", D(2026, 12, 1), D(2026, 12, 3)),
        ])

    def test_final_months_are_skipped_unless_inside_refresh_window(self):
        windows = js.month_windows(D(2026, 10, 18), D(2026, 12, 20))
        todo = js.months_to_fetch(base_state(finalMonths=["2026-10", "2026-11"]), windows, D(2026, 12, 20))
        self.assertEqual([w[0] for w in todo], ["2026-12"])

    def test_previous_month_refetched_while_within_attribution_window(self):
        windows = js.month_windows(D(2026, 10, 18), D(2026, 12, 3))
        todo = js.months_to_fetch(base_state(finalMonths=["2026-10", "2026-11"]), windows, D(2026, 12, 3))
        self.assertEqual([w[0] for w in todo], ["2026-11", "2026-12"])


class MergeTest(unittest.TestCase):
    def test_missing_data_keeps_old_value(self):
        months = {"a": {"2026-10": {"spend": 10, "revenue": 100, "purchases": 1}}}
        self.assertIs(js.merge_month(months, "a", "2026-10", None), months)

    def test_new_value_overwrites_same_month_without_mutating_input(self):
        months = {"a": {"2026-10": {"spend": 10, "revenue": 100, "purchases": 1}}}
        new = js.merge_month(months, "a", "2026-10", {"spend": 12, "revenue": 130, "purchases": 2})
        self.assertEqual(new["a"]["2026-10"]["revenue"], 130)
        self.assertEqual(months["a"]["2026-10"]["revenue"], 100)

    def test_other_customers_and_months_are_preserved(self):
        months = {"a": {"2026-10": {"spend": 1, "revenue": 2, "purchases": 0}},
                  "b": {"2026-10": {"spend": 3, "revenue": 4, "purchases": 0}}}
        new = js.merge_month(months, "a", "2026-11", {"spend": 5, "revenue": 6, "purchases": 0})
        self.assertEqual(set(new["a"]), {"2026-10", "2026-11"})
        self.assertEqual(new["b"], months["b"])


class TotalsTest(unittest.TestCase):
    def test_adds_buckets_on_top_of_baseline(self):
        state = base_state(months={"a": {"2026-10": {"spend": 10_000, "revenue": 200_000, "purchases": 50}}})
        totals = js.compute_totals(state)
        self.assertEqual(totals["revenue"], 92_150_000)
        self.assertEqual(totals["spend"], 5_600_000)
        self.assertAlmostEqual(totals["roas"], 92_150_000 / 5_600_000)
        self.assertEqual(totals["addedSinceBaseline"]["purchases"], 50)

    def test_active_account_count_only_counts_active_accounts_of_active_customers(self):
        customers = [
            {"status": "ACTIVE", "adAccounts": [{"status": "ACTIVE"}, {"status": "DISABLED"}]},
            {"status": "PAUSED", "adAccounts": [{"status": "ACTIVE"}]},
            {"status": "ACTIVE", "adAccounts": None},
        ]
        self.assertEqual(js.count_active_accounts(customers), 1)


class RenderTest(unittest.TestCase):
    TOTALS = {"revenue": 93_420_000, "roas": 16.31, "spend": 5_728_000, "accounts": 71}

    def test_turkish_formatting(self):
        html = js.render_page(PAGE, self.TOTALS, "tr")
        self.assertIn('data-count="93.42"', html)
        self.assertIn(">₺93M<", html)
        self.assertIn(">16,3x<", html)
        self.assertIn(">₺5,7M<", html)
        self.assertIn('data-count="71" data-decimals="0">71<', html)

    def test_english_formatting(self):
        html = js.render_page(PAGE, self.TOTALS, "en")
        self.assertIn(">16.3x<", html)
        self.assertIn(">₺5.7M<", html)

    def test_unexpected_page_structure_fails_loudly(self):
        with self.assertRaises(RuntimeError):
            js.render_page(PAGE.replace("rf-value", "x", 1), self.TOTALS, "tr")

    def test_baseline_alone_leaves_current_pages_unchanged(self):
        totals = js.compute_totals(base_state())
        for lang, path in js.PAGES.items():
            html = path.read_text(encoding="utf-8")
            self.assertEqual(js.render_page(html, totals, lang), html, lang)


if __name__ == "__main__":
    unittest.main()
