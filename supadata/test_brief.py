import json
import unittest
from pathlib import Path

import brief

EXAMPLES = Path(__file__).resolve().parent / "examples"


class ChunksToTextTests(unittest.TestCase):
    def test_string_passthrough(self) -> None:
        self.assertEqual(brief.chunks_to_text("Hello   world\n"), "Hello world")

    def test_chunk_list(self) -> None:
        content = [{"text": "All right,"}, {"text": "so here we are"}]
        self.assertEqual(brief.chunks_to_text(content), "All right, so here we are")

    def test_nested_content(self) -> None:
        payload = {"content": [{"text": "long trunks"}]}
        self.assertEqual(brief.chunks_to_text(payload), "long trunks")

    def test_empty(self) -> None:
        self.assertEqual(brief.chunks_to_text(None), "")


class YoutubeIdTests(unittest.TestCase):
    def test_watch_url(self) -> None:
        self.assertEqual(
            brief.youtube_id_from_url("https://www.youtube.com/watch?v=jNQXAC9IVRw"),
            "jNQXAC9IVRw",
        )

    def test_short_url(self) -> None:
        self.assertEqual(
            brief.youtube_id_from_url("https://youtu.be/jNQXAC9IVRw"),
            "jNQXAC9IVRw",
        )

    def test_bare_id(self) -> None:
        self.assertEqual(brief.youtube_id_from_url("jNQXAC9IVRw"), "jNQXAC9IVRw")

    def test_rejects_junk(self) -> None:
        with self.assertRaises(ValueError):
            brief.youtube_id_from_url("https://docs.supadata.ai")


class BriefFixtureTests(unittest.TestCase):
    def test_live_zoo_fixture(self) -> None:
        transcript = json.loads(
            (EXAMPLES / "me-at-the-zoo-transcript.json").read_text(encoding="utf-8")
        )
        video = json.loads(
            (EXAMPLES / "me-at-the-zoo-video.json").read_text(encoding="utf-8")
        )
        rendered = brief.format_brief(transcript, video)
        self.assertIn("# Me at the zoo", rendered)
        self.assertIn("jawed", rendered)
        self.assertIn("really really long trunks", rendered)
        self.assertIn("https://www.youtube.com/watch?v=jNQXAC9IVRw", rendered)
        self.assertIn("Duration: 19s", rendered)


if __name__ == "__main__":
    unittest.main()
