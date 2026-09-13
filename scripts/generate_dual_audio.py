#!/usr/bin/env python3
"""
generate_dual_audio.py
Synthesize fast-paced VOICEVOX audio for Dual Explainer (~80s total)
Shikoku Metan & Zundamon with brisk pacing (speedScale ~1.18),
crisp 2-line clean formatted subtitles, and Sharou's '2:23 AM' BGM.
"""

import json
import os
import subprocess
import urllib.parse
import urllib.request

VOICEVOX_URL = "http://127.0.0.1:50021"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO_DIR = os.path.join(BASE_DIR, "public", "audio")
DATA_FILE = os.path.join(BASE_DIR, "src", "dual_scene_data.json")

os.makedirs(AUDIO_DIR, exist_ok=True)

# 10 Scenes (Speed scale ~1.16-1.18 for brisk, engaging YouTube pacing)
SCENES = [
    {
        "id": "dual_scene1",
        "topic_num": 1,
        "speaker_name": "四国めたん",
        "speaker": 2,
        "character_speaker": "metan",
        "text": "ごきげんよう！四国の東の玄関口、\n徳島市の魅力を、たっぷり紹介して差し上げますわ！",
        "voice_text": "ごきげんよう！四国の、東の玄関口、トクシマ市の魅力を、たっぷり紹介して差し上げますわ！",
        "topic": "四国の東の玄関口・徳島市",
        "sub": "四国めたん＆ずんだもんの徳島ナビゲート",
        "category": "オープニング",
        "points": [
            "四国東部に位置する徳島県の県庁所在地（人口約25万人）",
            "本州と鳴門海峡で直結する「四国の東の玄関口」",
            "誇らしげに紹介するめたんと、冷めたずんだもん"
        ],
        "image": "images/card_scene1_bizan.jpg",
        "bg_image": "backgrounds/minchirie_living.jpg",
        "emotion": "🌸",
        "intonationScale": 1.15,
        "speedScale": 1.16
    },
    {
        "id": "dual_scene2",
        "topic_num": 2,
        "speaker_name": "ずんだもん",
        "speaker": 3,
        "character_speaker": "zundamon",
        "text": "素晴らしいって…徳島県って日本で唯一、\n「電車が1本も走ってない」県なのだ…全部ディーゼル汽車なのだ",
        "voice_text": "素晴らしいって…トクシマ県って、日本で唯一、電車が一本も走ってない県なのだ…全部、ディーゼル汽車なのだ",
        "topic": "自虐① 日本唯一の「電車ゼロ県」",
        "sub": "すべてディーゼルエンジンで走る「汽車」の街",
        "category": "交通の真実",
        "points": [
            "全国47都道府県で唯一、JRの電化路線が一切存在しない県",
            "地元民は「電車」と言わず誇りを持って「汽車」と呼ぶ",
            "架線がないので空が異様に広いという謎のメリット"
        ],
        "image": "images/card_scene2_diesel.jpg",
        "bg_image": "backgrounds/minchirie_station.jpg",
        "emotion": "💧",
        "intonationScale": 1.15,
        "speedScale": 1.18
    },
    {
        "id": "dual_scene3_1",
        "topic_num": 3,
        "speaker_name": "ずんだもん",
        "speaker": 3,
        "character_speaker": "zundamon",
        "text": "休日は全県民がイオンモールに大集合だけど、\n駐車場にやたらと『神戸ナンバー』が多くてビビるのだ…！",
        "voice_text": "休日は、全県民がイオンモールに大集合だけど、駐車場にやたらと、神戸ナンバーが多くて、ビビるのだ…！",
        "topic": "自虐② イオン大渋滞と謎の神戸ナンバー",
        "sub": "休日のショッピングモールで起きる「ナンバー格差」",
        "category": "街の真実",
        "points": [
            "休日は全県民がイオンモールに吸い込まれて駐車場は大渋滞",
            "駐車場で大量に見かける「神戸ナンバー」の正体は淡路島民",
            "玉ねぎ畑の住人が名乗る「神戸」への激しいコンプレックス"
        ],
        "image": "images/card_scene3_kobe.jpg",
        "bg_image": "backgrounds/minchirie_city.jpg",
        "emotion": "🚗",
        "intonationScale": 1.20,
        "speedScale": 1.18
    },
    {
        "id": "dual_scene3_2",
        "topic_num": 3,
        "speaker_name": "四国めたん",
        "speaker": 2,
        "character_speaker": "metan",
        "text": "あら、都会のセレブがお買い物に来てくださっているのかしら？\nそれなら誇らしいことですわ！",
        "voice_text": "あら、都会のセレブが、お買い物に来てくださっているのかしら？それなら、誇らしいことですわ！",
        "topic": "自虐② イオン大渋滞と謎の神戸ナンバー",
        "sub": "休日のショッピングモールで起きる「ナンバー格差」",
        "category": "街の真実",
        "points": [
            "休日は全県民がイオンモールに吸い込まれて駐車場は大渋滞",
            "駐車場で大量に見かける「神戸ナンバー」の正体は淡路島民",
            "玉ねぎ畑の住人が名乗る「神戸」への激しいコンプレックス"
        ],
        "image": "images/card_scene3_kobe.jpg",
        "bg_image": "backgrounds/minchirie_city.jpg",
        "emotion": "🌸",
        "intonationScale": 1.15,
        "speedScale": 1.16
    },
    {
        "id": "dual_scene3_3",
        "topic_num": 3,
        "speaker_name": "ずんだもん",
        "speaker": 3,
        "character_speaker": "zundamon",
        "text": "違うのだ！あの神戸ナンバーの正体は、\n海を渡ってきた淡路島の住人なのだ！兵庫県だから神戸ナンバーなのだ！",
        "voice_text": "違うのだ！あの神戸ナンバーの正体は、海を渡ってきた、淡路島の住人なのだ！兵庫県だから、神戸ナンバーなのだ！",
        "topic": "自虐② イオン大渋滞と謎の神戸ナンバー",
        "sub": "休日のショッピングモールで起きる「ナンバー格差」",
        "category": "街の真実",
        "points": [
            "休日は全県民がイオンモールに吸い込まれて駐車場は大渋滞",
            "駐車場で大量に見かける「神戸ナンバー」の正体は淡路島民",
            "玉ねぎ畑の住人が名乗る「神戸」への激しいコンプレックス"
        ],
        "image": "images/card_scene3_kobe.jpg",
        "bg_image": "backgrounds/minchirie_city.jpg",
        "emotion": "💧",
        "intonationScale": 1.20,
        "speedScale": 1.18
    },
    {
        "id": "dual_scene3_4",
        "topic_num": 3,
        "speaker_name": "四国めたん",
        "speaker": 2,
        "character_speaker": "metan",
        "text": "まあ！あちらは一面の玉ねぎ畑ですのに、\nおしゃれな神戸ナンバーをつけてるなんて…ずるいですわね！",
        "voice_text": "まあ！あちらは、一面の玉ねぎ畑ですのに、おしゃれな神戸ナンバーをつけてるなんて…ずるいですわね！",
        "topic": "自虐② イオン大渋滞と謎の神戸ナンバー",
        "sub": "休日のショッピングモールで起きる「ナンバー格差」",
        "category": "街の真実",
        "points": [
            "休日は全県民がイオンモールに吸い込まれて駐車場は大渋滞",
            "駐車場で大量に見かける「神戸ナンバー」の正体は淡路島民",
            "玉ねぎ畑の住人が名乗る「神戸」への激しいコンプレックス"
        ],
        "image": "images/card_scene3_kobe.jpg",
        "bg_image": "backgrounds/minchirie_city.jpg",
        "emotion": "😅",
        "intonationScale": 1.18,
        "speedScale": 1.16
    },
    {
        "id": "dual_scene3_5",
        "topic_num": 3,
        "speaker_name": "ずんだもん",
        "speaker": 3,
        "character_speaker": "zundamon",
        "text": "そうなのだ！玉ねぎ畑のくせにおしゃれな神戸ナンバーをつけてて、\n徳島ナンバーの僕たちとしては、激しいコンプレックスなのだ…！",
        "voice_text": "そうなのだ！玉ねぎ畑のくせに、おしゃれな神戸ナンバーをつけてて、トクシマナンバーの僕たちとしては、激しいコンプレックスなのだ…！",
        "topic": "自虐② イオン大渋滞と謎の神戸ナンバー",
        "sub": "休日のショッピングモールで起きる「ナンバー格差」",
        "category": "街の真実",
        "points": [
            "休日は全県民がイオンモールに吸い込まれて駐車場は大渋滞",
            "駐車場で大量に見かける「神戸ナンバー」の正体は淡路島民",
            "玉ねぎ畑の住人が名乗る「神戸」への激しいコンプレックス"
        ],
        "image": "images/card_scene3_kobe.jpg",
        "bg_image": "backgrounds/minchirie_city.jpg",
        "emotion": "🚗",
        "intonationScale": 1.22,
        "speedScale": 1.18
    },
    {
        "id": "dual_scene4",
        "topic_num": 4,
        "speaker_name": "四国めたん",
        "speaker": 2,
        "character_speaker": "metan",
        "text": "失礼ね！…まあ、唯一のデパートだったそごうが閉店して、\n県内から百貨店が完全に消滅したのは事実ですけれど…",
        "voice_text": "失礼ね！…まあ、唯一のデパートだったソゴーが閉店して、県内から、百貨店が完全に消滅したのは、事実ですけれど…",
        "topic": "自虐③ 百貨店完全消滅県",
        "sub": "そごう徳島店の閉店で起きた贈答品パニック",
        "category": "商業の現実",
        "points": [
            "2020年にそごう徳島店が惜しまれつつ閉店",
            "山形・福島・島根に続く「デパートのない県」へ突入",
            "お中元やお歳暮をどこで買うか県民が真剣に悩む事態に"
        ],
        "image": "images/pure_illust/illust_scene4_closed.jpg",
        "bg_image": "backgrounds/minchirie_city.jpg",
        "emotion": "😅",
        "intonationScale": 1.15,
        "speedScale": 1.16
    },
    {
        "id": "dual_scene5",
        "topic_num": 5,
        "speaker_name": "ずんだもん",
        "speaker": 3,
        "character_speaker": "zundamon",
        "text": "阿波踊りの4日間だけ狂ったように100万人集まるけど、\n残りの361日は驚くほど静まり返ってるのだ…",
        "voice_text": "アワオドリの四日間だけ、狂ったように百万人集まるけど、残りの、三百六十一日は、驚くほど静まり返ってるのだ…",
        "topic": "自虐④ 年4日の狂乱と残り361日",
        "sub": "8月のお盆に全精力を注ぎ込む街",
        "category": "伝統の落差",
        "points": [
            "お盆の4日間は人口の数倍の観光客（約100万人超）が押し寄せる",
            "祭り終了の翌朝から嘘のように静寂を取り戻す市街地",
            "「同じ阿呆なら踊らにゃ損々」のエネルギー落差が凄まじい"
        ],
        "image": "images/anime/art_scene5_awaodori.jpg",
        "bg_image": "backgrounds/minchirie_arcade.jpg",
        "emotion": "🏮",
        "intonationScale": 1.15,
        "speedScale": 1.18
    },
    {
        "id": "dual_scene6",
        "topic_num": 6,
        "speaker_name": "四国めたん",
        "speaker": 2,
        "character_speaker": "metan",
        "text": "テレビも大阪の番組が普通に映るから、\n実質、関西の一部みたいなものですわよ！",
        "voice_text": "テレビも、大阪の番組が普通に映るから、実質、関西の一部みたいなものですわよ！",
        "topic": "自虐⑤ 実質関西圏？の真相",
        "sub": "近畿広域圏のテレビ電波と関西愛",
        "category": "県民性",
        "points": [
            "紀伊水道を挟んで大阪のテレビ電波（MBS・ABC・KTV・ytv）が届く",
            "四国なのにローカルニュースより関西の話題に詳しい",
            "買い物も高松や松山より神戸・難波に行きがち"
        ],
        "image": "images/pure_illust/illust_scene6_kansai.jpg",
        "bg_image": "backgrounds/minchirie_room.jpg",
        "emotion": "📺",
        "intonationScale": 1.15,
        "speedScale": 1.16
    },
    {
        "id": "dual_scene7",
        "topic_num": 7,
        "speaker_name": "ずんだもん",
        "speaker": 3,
        "character_speaker": "zundamon",
        "text": "徳島ラーメンも味が濃すぎて、\n生卵と大盛り白ご飯をつけないと塩分過多で倒れる危険なスープなのだ！",
        "voice_text": "トクシマラーメンも味が濃すぎて、生卵と大盛りシロゴハンをつけないと、塩分過多で倒れる、危険なスープなのだ！",
        "topic": "自虐⑥ 濃すぎるソウルフード",
        "sub": "「おかず系ラーメン」の元祖",
        "category": "グルメの真実",
        "points": [
            "濃厚な甘辛豚骨醤油スープに甘辛豚バラ肉のパンチ力",
            "もはやラーメン単体ではなく「白ご飯のおかず」として君臨",
            "生卵を落とさないと喉が渇いてたまらない濃厚さ"
        ],
        "image": "images/anime/art_scene7_ramen.jpg",
        "bg_image": "backgrounds/minchirie_cafe.jpg",
        "emotion": "🍜",
        "intonationScale": 1.18,
        "speedScale": 1.18
    },
    {
        "id": "dual_scene8",
        "topic_num": 8,
        "speaker_name": "四国めたん",
        "speaker": 2,
        "character_speaker": "metan",
        "text": "そして徳島の極上銘菓「小男鹿」！\n高級すぎて、自分用には絶対に買いませんけれど",
        "voice_text": "そして、トクシマの極上銘菓、サオシカ！高級すぎて、自分用には、絶対に買いませんけれど",
        "topic": "自虐⑦ 自宅用には高すぎる「小男鹿」",
        "sub": "山芋と和三盆の上品すぎる極上和菓子",
        "category": "伝統銘菓",
        "points": [
            "観光客は素通りしがちだが徳島県人には別格のステータス",
            "棹（さお）一本が高級すぎて普段のおやつには手が出ない",
            "貰ったときだけ一家総出で大喜びして食べる銘菓"
        ],
        "image": "images/anime/art_scene8_saoshika.jpg",
        "bg_image": "backgrounds/minchirie_room.jpg",
        "emotion": "🤫",
        "intonationScale": 1.15,
        "speedScale": 1.16
    },
    {
        "id": "dual_scene9",
        "topic_num": 9,
        "speaker_name": "ずんだもん",
        "speaker": 3,
        "character_speaker": "zundamon",
        "text": "小男鹿は重大なやらかしをした時のガチの謝罪でしか登場しない、\n『ごめんなさいの味』なのだ！徳島県民にはこれを渡すのだ！",
        "voice_text": "サオシカは、重大なやらかしをした時の、ガチの謝罪でしか登場しない、ゴメンナサイの味なのだ！トクシマ県民には、これを渡すのだ！",
        "topic": "自虐⑧ 誠意の象徴「ごめんなさいの味」",
        "sub": "持参すれば本気の謝罪が通じるソウル菓子",
        "category": "謝罪の切り札",
        "points": [
            "ミスやトラブルの謝罪時に持参すると絶大な誠意が伝わる",
            "「小男鹿を持ってきたなら許すしかない…」となる魔法の味",
            "徳島県人を宥める最強のコミュニケーションツール"
        ],
        "image": "images/pure_illust/illust_scene9_apology.jpg",
        "bg_image": "backgrounds/minchirie_room.jpg",
        "emotion": "🙇",
        "intonationScale": 1.18,
        "speedScale": 1.18
    },
    {
        "id": "dual_scene10",
        "topic_num": 10,
        "speaker_name": "四国めたん＆ずんだもん",
        "speaker": 2,
        "character_speaker": "both",
        "text": "色々申し上げましたけれど、一度味わえば病みつきになるのが徳島市！\nみんなも汽車に乗って、濃いラーメンとごめんなさいの味を体験しに来てほしいのだ！",
        "voice_text": "色々申し上げましたけれど、一度味わえば病みつきになるのが、トクシマ市の奥深さですわ！",
        "zunda_voice_text": "みんなも汽車に乗って、濃いラーメンと、ゴメンナサイの味を、体験しに来てほしいのだ！",
        "topic": "愛ある自虐と本当の魅力",
        "sub": "ディープで温かい徳島市へぜひお越しください！",
        "category": "フィナーレ",
        "points": [
            "自虐できるのも地元を愛しているからこそ！",
            "汽車に揺られ、濃厚ラーメンをすすり、小男鹿を味わう旅",
            "人情味あふれる徳島市で皆様をお待ちしています！"
        ],
        "image": "images/pure_illust/illust_scene10_welcome.jpg",
        "bg_image": "backgrounds/minchirie_living.jpg",
        "emotion": "✨",
        "intonationScale": 1.15,
        "speedScale": 1.17
    }
]

def synthesize_voice(text, speaker, out_path, intonation=1.15, speed=1.18):
    query_url = f"{VOICEVOX_URL}/audio_query?text={urllib.parse.quote(text)}&speaker={speaker}"
    req = urllib.request.Request(query_url, method="POST")
    with urllib.request.urlopen(req) as resp:
        query_data = json.loads(resp.read().decode("utf-8"))

    query_data["intonationScale"] = intonation
    query_data["speedScale"] = speed
    query_data["volumeScale"] = 1.6

    synth_url = f"{VOICEVOX_URL}/synthesis?speaker={speaker}"
    synth_req = urllib.request.Request(
        synth_url,
        data=json.dumps(query_data).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    raw_wav = out_path + ".raw.wav"
    with urllib.request.urlopen(synth_req) as resp, open(raw_wav, "wb") as f:
        f.write(resp.read())

    # Normalize to -14 LUFS stereo 48kHz
    cmd = [
        "ffmpeg", "-y", "-i", raw_wav,
        "-af", "loudnorm=I=-14:LRA=11:TP=-1.5,volume=1.2",
        "-ar", "48000", "-ac", "2",
        out_path
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    if os.path.exists(raw_wav):
        os.remove(raw_wav)

def get_audio_duration(wav_path):
    cmd = [
        "ffprobe", "-v", "error", "-show_entries",
        "format=duration", "-of", "default=noprint_wrappers=1:nokey=1",
        wav_path
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=True)
    return float(res.stdout.strip())

print("Synthesizing fast-paced dialogue audios (~1.18x speed)...")
total_frames = 0
fps = 30

for idx, scene in enumerate(SCENES):
    out_wav = os.path.join(AUDIO_DIR, f"{scene['id']}.wav")
    
    if scene["id"] == "dual_scene10":
        m_wav = os.path.join(AUDIO_DIR, "scene10_metan.wav")
        z_wav = os.path.join(AUDIO_DIR, "scene10_zunda.wav")
        synthesize_voice(scene["voice_text"], 2, m_wav, scene["intonationScale"], scene["speedScale"])
        synthesize_voice(scene["zunda_voice_text"], 3, z_wav, scene["intonationScale"], scene["speedScale"])
        concat_list = os.path.join(AUDIO_DIR, "concat.txt")
        with open(concat_list, "w") as f:
            f.write(f"file '{m_wav}'\n")
            f.write(f"file '{z_wav}'\n")
        cmd = ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat_list, "-c", "copy", out_wav]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        os.remove(concat_list)
        os.remove(m_wav)
        os.remove(z_wav)
    else:
        synthesize_voice(
            scene["voice_text"],
            scene["speaker"],
            out_wav,
            scene["intonationScale"],
            scene["speedScale"]
        )

    dur = get_audio_duration(out_wav)
    pause_sec = 0.35
    scene_frames = int((dur + pause_sec) * fps)
    
    scene["audioFile"] = f"audio/{scene['id']}.wav"
    scene["duration"] = dur
    scene["durationInFrames"] = scene_frames
    scene["startFrame"] = total_frames
    
    print(f"[{scene['id']}] {scene['speaker_name']}: {dur:.2f}s ({scene_frames} frames)")
    total_frames += scene_frames

total_duration = total_frames / fps
output_data = {
    "fps": fps,
    "totalFrames": total_frames,
    "totalDuration": total_duration,
    "scenes": SCENES
}

with open(DATA_FILE, "w", encoding="utf-8") as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print(f"\nAll fast-paced audio synthesized successfully!")
print(f"Total Duration: {total_duration:.2f}s ({total_frames} frames) at {fps} fps.")
