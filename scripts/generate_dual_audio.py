#!/usr/bin/env python3
"""Compile content/episode.json; reuse unchanged voices, measure PCM lip sync."""
import argparse
import array
import hashlib
import io
import json
import math
import os
from pathlib import Path
import re
import sys
import urllib.parse
import urllib.request
import wave

BASE = Path(__file__).resolve().parent.parent
SOURCE = BASE / 'content/episode.json'
DATA = BASE / 'src/dual_scene_data.json'
CACHE = BASE / 'src/dual_audio_cache.json'
VOICEVOX_URL = 'http://127.0.0.1:50021'
SPEAKERS = {'zundamon': (3, 'ずんだもん'), 'metan': (2, '四国めたん')}
POSES = {'zundamon': ['listen', 'explain', 'proud', 'shocked', 'hungry', 'dance', 'apology', 'smile', 'greeting'],
         'metan': ['talk', 'proud', 'point', 'surprise', 'troubled', 'whisper', 'closed']}


def signature(line, defaults):
    value = {'voiceText': line.get('voiceText') or line['text'], 'speaker': SPEAKERS[line['speaker']][0],
             'speed': line.get('speed', defaults['speed']), 'intonation': line.get('intonation', defaults['intonation'])}
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False).encode()).hexdigest()


def public_file(relative):
    candidate = (BASE / 'public' / relative).resolve()
    if not candidate.is_relative_to((BASE / 'public').resolve()):
        raise ValueError(f'素材パスは public/ 内を指定してください: {relative}')
    return candidate


def validate(episode):
    defaults = episode['audio']
    if defaults['fps'] != 30:
        raise ValueError('現在のテンプレートは30fpsです。audio.fps は30にしてください。')
    for k in ('eyebrow', 'title', 'label', 'outro'):
        if not isinstance(episode['program'][k], str) or not episode['program'][k].strip():
            raise ValueError(f'program.{k} を入力してください。')
    if not 0 <= defaults['bgmVolume'] <= 0.3:
        raise ValueError('bgmVolume は0〜0.3にしてください。')
    if not episode['topics']:
        raise ValueError('topics に最低1つの話題を追加してください。')
    public_file(defaults['bgm']).stat()
    public_file('fonts/keifont.ttf').stat()
    ids = set()
    for n, topic in enumerate(episode['topics'], 1):
        if topic['number'] != n:
            raise ValueError('topic.number は1からの連番にしてください。')
        for key in ('title', 'corner', 'category'):
            if not isinstance(topic[key], str) or not topic[key].strip():
                raise ValueError(f'話題{n}: {key} が空です。')
        if not 1 <= len(topic['points']) <= 3 or any(not p.strip() for p in topic['points']):
            raise ValueError(f'話題{n}: points は1〜3行にしてください。')
        for key in ('image', 'background'):
            public_file(topic[key]).stat()
        if not topic['lines']:
            raise ValueError(f'話題{n}にセリフがありません。')
        for line in topic['lines']:
            identifier = line['id']
            if not re.fullmatch(r'[a-zA-Z0-9_-]+', identifier) or identifier in ids:
                raise ValueError(f'セリフIDは重複しない英数字・_・-で指定してください: {identifier}')
            ids.add(identifier)
            if line['speaker'] not in SPEAKERS:
                raise ValueError(f'{identifier}: speaker は zundamon / metan を指定してください。')
            if not line['text'].strip():
                raise ValueError(f'{identifier}: セリフが空です。')
            for key, low, high in [('speed', 1.0, 1.4), ('intonation', 0.8, 1.5), ('pause', 0, 2)]:
                val = line.get(key, defaults[key])
                if not isinstance(val, (int, float)) or not low <= val <= high:
                    raise ValueError(f'{identifier}: {key} は {low}〜{high} にしてください。')
            for actor, choices in POSES.items():
                pose = line.get('expressions', {}).get(actor, 'listen' if actor == 'zundamon' else 'proud')
                if pose not in choices:
                    raise ValueError(f'{identifier}: {actor} の表情 {pose} は未対応です。')
                prefix = 'zunda' if actor == 'zundamon' else 'metan'
                for mouth in ('open', 'close', 'blink_open', 'blink_close'):
                    public_file(f'characters/{prefix}_{pose}_{mouth}.png').stat()


def read_pcm(path, fps):
    with wave.open(str(path), 'rb') as wav:
        if wav.getsampwidth() != 2 or wav.getcomptype() != 'NONE':
            raise ValueError(f'16bit PCM WAVが必要です: {path.name}')
        rate, channels, count = wav.getframerate(), wav.getnchannels(), wav.getnframes()
        samples = array.array('h', wav.readframes(count))
        if sys.byteorder != 'little':
            samples.byteswap()
    energies = []
    for frame in range(math.ceil(count / rate * fps)):
        segment = samples[int(frame * rate / fps) * channels:int((frame + 1) * rate / fps) * channels]
        energies.append(math.sqrt(sum(v * v for v in segment) / max(1, len(segment))) / 32768)
    # Relative gate follows the recording's actual loudness; silence stays closed.
    threshold = max(0.012, max(energies, default=0) * 0.14)
    return count / rate, [round(min(1, e / threshold), 3) for e in energies]


def synthesize(line, defaults, destination):
    speaker = SPEAKERS[line['speaker']][0]
    args = urllib.parse.urlencode({'text': line.get('voiceText') or line['text'], 'speaker': speaker})
    req = urllib.request.Request(f'{VOICEVOX_URL}/audio_query?{args}', method='POST')
    with urllib.request.urlopen(req, timeout=30) as response:
        query = json.load(response)
    query.update(speedScale=line.get('speed', defaults['speed']),
                 intonationScale=line.get('intonation', defaults['intonation']),
                 volumeScale=1.0, outputSamplingRate=48000, outputStereo=True)
    req = urllib.request.Request(f'{VOICEVOX_URL}/synthesis?speaker={speaker}',
                                 data=json.dumps(query).encode(),
                                 headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req, timeout=120) as response:
        raw = response.read()
    with wave.open(io.BytesIO(raw), 'rb') as wav:
        if wav.getnframes() == 0:
            raise ValueError('VOICEVOXから空の音声が返されました。')
    destination.parent.mkdir(parents=True, exist_ok=True)
    temp = destination.with_suffix('.tmp.wav')
    temp.write_bytes(raw)
    read_pcm(temp, defaults['fps'])
    temp.replace(destination)


def atomic_json(path, value):
    temp = path.with_suffix('.tmp.json')
    temp.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    temp.replace(path)


def compile_episode(cached_only=False, check=False):
    episode = json.loads(SOURCE.read_text(encoding='utf-8'))
    validate(episode)
    if check:
        print(f'台本・素材チェック OK: {len(episode["topics"])}話題')
        return
    defaults = episode['audio']
    cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}
    scenes, total = [], 0
    for topic in episode['topics']:
        for line in topic['lines']:
            key = signature(line, defaults)
            entry = cache.get(key)
            valid = entry and public_file(entry['file']).is_file()
            if valid:
                valid = hashlib.sha256(public_file(entry['file']).read_bytes()).hexdigest() == entry['sha256']
            if not valid:
                if cached_only:
                    raise ValueError(f'{line["id"]}: 音声が未生成または台詞が変更されています。VOICEVOXを起動して npm run audio:dual を実行してください。')
                relative = f'audio/generated/{line["id"]}-{key[:12]}.wav'
                print(f'音声合成: {line["id"]}', flush=True)
                synthesize(line, defaults, public_file(relative))
                entry = {'file': relative, 'sha256': hashlib.sha256(public_file(relative).read_bytes()).hexdigest()}
                cache[key] = entry
            duration, envelope = read_pcm(public_file(entry['file']), defaults['fps'])
            frames = math.ceil((duration + line.get('pause', defaults['pause'])) * defaults['fps'])
            scene = {'id': line['id'], 'topic_num': topic['number'], 'topic': topic['title'],
                     'sub': topic['corner'], 'category': topic['category'], 'points': topic['points'],
                     'image': topic['image'], 'bg_image': topic['background'], 'text': line['text'],
                     'character_speaker': line['speaker'], 'speaker_name': SPEAKERS[line['speaker']][1],
                     'expressions': {'zundamon': 'listen', 'metan': 'proud', **line.get('expressions', {})},
                     'audioFile': entry['file'], 'duration': duration, 'durationInFrames': frames,
                     'startFrame': total, 'mouthLevels': envelope}
            scenes.append(scene)
            total += frames
    # Publish only after ALL lines are valid; old data and its audio remain usable on failure.
    atomic_json(CACHE, cache)
    atomic_json(DATA, {'fps': defaults['fps'], 'totalFrames': total,
                      'totalDuration': total / defaults['fps'], 'program': episode['program'],
                      'audio': defaults, 'scenes': scenes})
    print(f'台本・音声同期 OK: {len(scenes)}セリフ / {total / defaults["fps"]:.1f}秒 + エンディング')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cached', action='store_true', help='既存音声だけで字幕・画像・表情を更新')
    parser.add_argument('--check', action='store_true', help='台本と素材を検査（変更なし）')
    options = parser.parse_args()
    try:
        compile_episode(options.cached, options.check)
    except (ValueError, KeyError, OSError, wave.Error) as exc:
        print(f'制作チェック: {exc}', file=sys.stderr)
        sys.exit(1)
