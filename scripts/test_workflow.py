import array
import copy
import hashlib
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import wave
import generate_dual_audio as workflow


class WorkflowTests(unittest.TestCase):
    def setUp(self):
        self.episode = json.loads(workflow.SOURCE.read_text())

    def test_display_edits_reuse_voice_but_voice_edits_invalidate(self):
        line = self.episode['topics'][0]['lines'][0]
        key = workflow.signature(line, self.episode['audio'])
        self.assertEqual(key, workflow.signature({**line, 'text': '字幕だけ変更'}, self.episode['audio']))
        self.assertNotEqual(key, workflow.signature({**line, 'voiceText': '音声を変更'}, self.episode['audio']))
        self.assertNotEqual(key, workflow.signature({**line, 'speaker': 'zundamon'}, self.episode['audio']))

    def test_missing_voice_does_not_replace_existing_timeline(self):
        with tempfile.TemporaryDirectory() as folder:
            data = Path(folder) / 'timeline.json'
            cache = Path(folder) / 'cache.json'
            data.write_text('previous good timeline')
            with patch.object(workflow, 'DATA', data), patch.object(workflow, 'CACHE', cache):
                with self.assertRaisesRegex(ValueError, '音声が未生成'):
                    workflow.compile_episode(cached_only=True)
            self.assertEqual(data.read_text(), 'previous good timeline')
            self.assertFalse(cache.exists())

    def test_duplicate_ids_and_unknown_speakers_are_rejected(self):
        broken = copy.deepcopy(self.episode)
        broken['topics'][1]['lines'][0]['id'] = broken['topics'][0]['lines'][0]['id']
        with self.assertRaisesRegex(ValueError, '重複'):
            workflow.validate(broken)
        broken = copy.deepcopy(self.episode)
        broken['topics'][0]['lines'][0]['speaker'] = 'both'
        with self.assertRaisesRegex(ValueError, 'speaker'):
            workflow.validate(broken)

    def test_lip_sync_closes_during_silence(self):
        with tempfile.TemporaryDirectory() as folder:
            audio = Path(folder) / 'voice.wav'
            with wave.open(str(audio), 'wb') as wav:
                wav.setparams((1, 2, 48000, 0, 'NONE', 'not compressed'))
                wav.writeframes(array.array('h', [0] * 4800 + [6000, -6000] * 2400 + [0] * 4800).tobytes())
            duration, levels = workflow.read_pcm(audio, 30)
            self.assertAlmostEqual(duration, 0.3)
            self.assertEqual(levels[:3], [0, 0, 0])
            self.assertEqual(levels[3:6], [1, 1, 1])
            self.assertEqual(levels[6:], [0, 0, 0])

    def test_generated_timeline_preserves_all_lines_and_continuity(self):
        data = json.loads(workflow.DATA.read_text())
        source_ids = [line['id'] for topic in self.episode['topics'] for line in topic['lines']]
        self.assertEqual(source_ids, [scene['id'] for scene in data['scenes']])
        end = 0
        for scene in data['scenes']:
            self.assertEqual(scene['startFrame'], end)
            self.assertGreaterEqual(scene['durationInFrames'], len(scene['mouthLevels']))
            end += scene['durationInFrames']
        self.assertEqual(end, data['totalFrames'])

    def test_asset_path_cannot_escape_public(self):
        with self.assertRaises(ValueError):
            workflow.public_file('../package.json')


if __name__ == '__main__':
    unittest.main()
