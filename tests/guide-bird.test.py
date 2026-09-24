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

    def test_home_bird_stays_inside_narrow_site_canvas_on_wide_window(self):
        result = self.render_site(route="", width=960)
        self.assertTrue(result["canvasContained"], result)
        self.assertEqual(result["textOverlapCount"], 0, result)

    def test_process_birds_do_not_cover_open_step_card(self):
        result = self.render_site(route="detail/duo", width=960, target="#process")
        self.assertEqual(result["scene"], "13")
        self.assertTrue(result["canvasContained"], result)
        self.assertFalse(result["protectedOverlap"], result)
        self.assertEqual(result["textOverlapCount"], 0, result)
        self.assertEqual(result["coveredControls"], [], result)

    def test_before_after_bird_grows_but_stays_inside_canvas_and_off_player(self):
        home = self.render_site(route="", width=960)
        result = self.render_site(route="detail/solo", width=960, target="#wistiaBeforeAfter")
        self.assertEqual(result["scene"], "11")
        self.assertGreater(result["guideSize"], home["guideSize"])
        self.assertTrue(result["canvasContained"], result)
        self.assertFalse(result["protectedOverlap"], result)
        self.assertEqual(result["textOverlapCount"], 0, result)
        self.assertEqual(result["coveredControls"], [], result)

    def test_narrow_process_and_before_after_avoid_text(self):
        for route, target in [("detail/duo", "#process"), ("detail/solo", "#wistiaBeforeAfter")]:
            with self.subTest(route=route, target=target):
                result = self.render_site(route=route, width=390, target=target)
                self.assertTrue(result["canvasContained"], result)
                self.assertFalse(result["protectedOverlap"], result)
                self.assertEqual(result["textOverlapCount"], 0, result)

    def test_process_birds_hide_when_only_open_card_is_visible(self):
        result = self.render_site(route="detail/duo", width=390, target="#process .wps-accordion details[open]")
        self.assertEqual(result["scene"], "13")
        self.assertTrue(result["isNoSpace"], result)


if __name__ == "__main__":
    unittest.main()
