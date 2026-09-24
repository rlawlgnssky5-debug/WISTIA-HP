"""Browser checks for the single mouse-following WISTIA bird."""
import json
import re
import subprocess
import tempfile
import unittest
from pathlib import Path
from urllib.parse import urlencode

ROOT = Path(__file__).resolve().parent
BROWSER = Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe")


class FollowerTest(unittest.TestCase):
    def render(self, **params):
        with tempfile.TemporaryDirectory(prefix="wistia-follower-") as profile:
            url = (ROOT / "guide-follower.fixture.html").as_uri() + "?" + urlencode(params)
            run = subprocess.run([
                str(BROWSER), "--headless=new", "--disable-gpu", "--no-sandbox",
                "--allow-file-access-from-files", "--window-size=960,900",
                f"--user-data-dir={profile}", "--virtual-time-budget=5000", "--dump-dom", url,
            ], capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=25)
            self.assertEqual(run.returncode, 0, run.stderr[-1000:])
            match = re.search(r'<pre id="result">([^<]+)</pre>', run.stdout)
            self.assertIsNotNone(match, run.stdout[-1000:])
            return json.loads(match.group(1).replace("&quot;", '"'))

    def test_one_bird_follows_mouse_across_routes(self):
        left = self.render(x=320, y=500)
        right = self.render(x=620, y=600, remount=1)
        self.assertEqual(left["birds"], 1)
        self.assertEqual(right["birds"], 1)
        self.assertTrue(left["visible"])
        self.assertTrue(right["visible"])
        self.assertGreater(right["x"], left["x"] + 100)
        self.assertGreater(right["y"], left["y"] + 40)
        self.assertEqual(right["scene"], "")

    def test_bird_stays_inside_site_and_away_from_button(self):
        result = self.render(x=490, y=325)
        self.assertGreaterEqual(result["x"], result["canvasLeft"])
        self.assertLessEqual(result["x"] + result["width"], result["canvasRight"])
        self.assertFalse(result["buttonOverlap"])
        self.assertEqual(result["clicks"], 1)

    def test_bird_uses_narrow_margin_beside_dense_controls(self):
        result = self.render(x=470, y=325, dense=1)
        self.assertTrue(result["visible"], result)
        self.assertFalse(result["denseOverlap"], result)
        self.assertLessEqual(result["width"], 48)
        self.assertGreaterEqual(result["x"], result["canvasLeft"])
        self.assertLessEqual(result["x"] + result["width"], result["canvasRight"])

    def test_touch_pointer_does_not_show_follower(self):
        self.assertFalse(self.render(x=450, y=500, pointerType="touch")["visible"])

    def test_touch_hides_a_previously_visible_mouse_follower(self):
        self.assertFalse(self.render(x=450, y=500, thenTouch=1)["visible"])

    def test_real_home_and_detail_keep_one_bird_inside_the_site(self):
        for route, width, x in [("", 960, 680), ("detail/duo", 390, 340)]:
            with self.subTest(route=route, width=width):
                result = self.render_site(route=route, width=width, px=x, py=180)
                self.assertEqual(result["birds"], 1)
                self.assertTrue(result["clickThrough"])
                self.assertEqual(result["coveredControls"], [])
                self.assertEqual(result["textOverlapCount"], 0)
                if not result["layerHidden"]:
                    self.assertTrue(result["canvasContained"])

    def test_real_ar_slider_keeps_bird_visible_without_covering_controls(self):
        result = self.render_site(
            route="detail/solo", width=390, target="#arRatioExperience",
            pointerTarget=".wistia-ar__ratio-input",
        )
        self.assertEqual(result["birds"], 1)
        self.assertFalse(result["layerHidden"], result)
        self.assertTrue(result["canvasContained"], result)
        self.assertEqual(result["coveredControls"], [], result)
        self.assertEqual(result["textOverlapCount"], 0, result)

    def render_site(self, **params):
        with tempfile.TemporaryDirectory(prefix="wistia-follower-site-") as profile:
            url = (ROOT / "guide-integration.fixture.html").as_uri() + "?" + urlencode(params)
            run = subprocess.run([
                str(BROWSER), "--headless=new", "--disable-gpu", "--no-sandbox",
                "--allow-file-access-from-files", f"--user-data-dir={profile}",
                "--virtual-time-budget=6500", "--dump-dom", url,
            ], capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=30)
            self.assertEqual(run.returncode, 0, run.stderr[-1000:])
            match = re.search(r'<pre id="result">([^<]+)</pre>', run.stdout)
            self.assertIsNotNone(match, run.stdout[-1000:])
            return json.loads(match.group(1).replace("&quot;", '"'))


if __name__ == "__main__":
    unittest.main()
