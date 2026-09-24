"""Exercise the real browser guide layer in a small local fixture."""
import json
import re
import subprocess
import tempfile
import unittest
from pathlib import Path
from urllib.parse import urlencode

ROOT = Path(__file__).resolve().parent
BROWSER = Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe")


class GuideBirdBrowserTest(unittest.TestCase):
    def render(self, key="solo", reduced=False):
        self.assertTrue(BROWSER.exists())
        with tempfile.TemporaryDirectory(prefix="wistia-guide-") as profile:
            flags = [
                str(BROWSER), "--headless=new", "--disable-gpu", "--no-sandbox",
                "--allow-file-access-from-files", f"--user-data-dir={profile}",
                "--virtual-time-budget=900", "--dump-dom",
            ]
            if reduced:
                flags.append("--force-prefers-reduced-motion")
            flags.append((ROOT / "guide-bird.fixture.html").as_uri() + f"?key={key}")
            run = subprocess.run(flags, capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=25)
            self.assertEqual(run.returncode, 0, run.stderr[-1200:])
            match = re.search(r'<pre id="result">([^<]+)</pre>', run.stdout)
            self.assertIsNotNone(match, run.stdout[-1200:])
            return json.loads(match.group(1).replace("&quot;", '"'))

    def test_solo_uses_one_cream_bird_without_blocking_clicks(self):
        result = self.render("solo")
        self.assertTrue(result["controller"])
        self.assertEqual(result["visibleBirds"], 1)
        self.assertIn("bird-cream", result["leadSource"])
        self.assertTrue(result["clickThrough"])

    def test_duo_uses_two_birds(self):
        self.assertEqual(self.render("duo")["visibleBirds"], 2)

    def test_reduced_motion_disables_animation(self):
        result = self.render("solo", reduced=True)
        self.assertTrue(result["reduced"])
        self.assertTrue(result["noAnimation"])

    def render_site(self, **params):
        with tempfile.TemporaryDirectory(prefix="wistia-guide-site-") as profile:
            url = (ROOT / "guide-integration.fixture.html").as_uri() + "?" + urlencode(params)
            run = subprocess.run([
                str(BROWSER), "--headless=new", "--disable-gpu", "--no-sandbox",
                "--allow-file-access-from-files", f"--user-data-dir={profile}",
                "--virtual-time-budget=6500", "--dump-dom", url,
            ], capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=30)
            self.assertEqual(run.returncode, 0, run.stderr[-1200:])
            match = re.search(r'<pre id="result">([^<]+)</pre>', run.stdout)
            self.assertIsNotNone(match, run.stdout[-1200:])
            return json.loads(match.group(1).replace("&quot;", '"'))

    def test_real_home_has_one_visible_guide_and_no_fab_overlap(self):
        result = self.render_site(route="", width=320)
        self.assertEqual(result["page"], "home")
        self.assertEqual(result["scene"], "01")
        self.assertEqual(result["birds"], 1)
        self.assertFalse(result["fabOverlap"])

    def test_real_duo_has_pair_and_no_horizontal_overflow(self):
        result = self.render_site(route="detail/duo", width=390)
        self.assertEqual(result["birds"], 2)
        self.assertTrue(result["noOverflow"])
        self.assertFalse(result["fabOverlap"])

    def test_before_after_scroll_activates_singing_scene(self):
        result = self.render_site(route="detail/solo", target="#wistiaBeforeAfter")
        self.assertEqual(result["scene"], "11")

    def test_before_after_toggle_returns_to_singing_loop(self):
        result = self.render_site(route="detail/solo", target="#wistiaBeforeAfter", click=".bap-tab[data-mode=after]")
        self.assertEqual(result["scene"], "11")
        if result["audioActive"]:
            self.assertIn("bird-cream-singing.png", result["leadSource"])
        else:
            self.assertIn("bird-cream-sing.webp", result["leadSource"])

    def test_existing_price_cta_still_navigates(self):
        result = self.render_site(route="detail/solo", click=".solo-inline-contact")
        self.assertEqual(result["hash"], "#/event/solo")
        self.assertEqual(result["page"], "event")

    def test_mobile_card_tap_places_bird_inside_card(self):
        result = self.render_site(route="", width=390, tap=".finder-choice")
        self.assertEqual(result["scene"], "03")
        self.assertTrue(result["cardContained"])

    def test_mobile_price_bird_stays_visible_above_total(self):
        result = self.render_site(route="event/solo", width=320, change="[data-option]")
        self.assertEqual(result["scene"], "16c")
        self.assertFalse(result["totalOverlap"])
        self.assertFalse(result["fabOverlap"])


if __name__ == "__main__":
    unittest.main()
