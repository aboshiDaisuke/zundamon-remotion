import os
import json
import urllib.parse
import urllib.request
import subprocess

SCRIPT_DATA = [
    {
        "id": "scene1",
        "text": "こんにちは！徳島市PRナビゲーターのずんだもんが、阿波おどりと豊かな自然、美食の街、徳島県徳島市について紹介するのだ！",
        "voice_text": "こんにちは！徳島市の、PRナビゲーター、ずんだもんが、阿波おどりと、豊かな自然、美食の街、徳島県徳島市について、紹介するのだ！",
        "topic": "徳島県徳島市へようこそ！",
        "sub": "阿波おどりと清流、歴史と美食が息づく街",
        "category": "市政紹介",
        "points": [
            "四国東部に位置する徳島県の県庁所在地（人口約25万人）",
            "日本三大暴れ川「吉野川」の河口デルタに広がる水都",
            "世界に誇る伝統文化「阿波おどり」発祥の地"
        ],
        "character": "zunda_greeting.png",
        "emotion": "🌸",
        "speaker": 3,
        "intonationScale": 1.10,
        "speedScale": 1.05,
        "pitchScale": 0.0
    },
    {
        "id": "scene2",
        "text": "徳島市は吉野川の豊かな水に囲まれた「水都」で、街の中心を巡る「ひょうたん島クルーズ」も大人気なのだ！",
        "voice_text": "徳島市は、吉野川の豊かな水に囲まれた、すいとの街で、街の中心を巡る、ひょうたんじまクルーズも、大人気なのだ！",
        "topic": "清流が育む「水都・徳島」",
        "sub": "吉野川と新町川、ひょうたん島周遊クルーズ",
        "category": "水都・自然",
        "points": [
            "市内を縦横に流れる新町川や助任川がつくる「ひょうたん島」",
            "川風を感じながら街を一周する人気の遊覧船クルーズ",
            "水辺のウッドデッキが美しい「新町川水際公園」"
        ],
        "character": "zunda_explain.png",
        "emotion": "⛵",
        "speaker": 3,
        "intonationScale": 1.10,
        "speedScale": 1.05,
        "pitchScale": 0.0
    },
    {
        "id": "scene3",
        "text": "休日は全県民がイオンに大集合だけど、\n駐車場で見かける神戸ナンバーは淡路島の住人なのだ！\n玉ねぎ畑のくせにおしゃれな神戸ナンバーをつけてて、超コンプレックスなのだ…！",
        "voice_text": "休日は、全県民がイオンモールに大集合だけど、駐車場で見かける神戸ナンバーは、淡路島の住人なのだ！玉ねぎ畑のくせに、おしゃれな神戸ナンバーをつけてるのが、トクシマナンバーとしては、超コンプレックスなのだ…！",
        "topic": "自虐② イオン大渋滞と謎の神戸ナンバー",
        "sub": "休日のショッピングモールで起きる「ナンバー格差」",
        "category": "街の真実",
        "points": [
            "休日は全県民がイオンモールに吸い込まれて駐車場は大渋滞",
            "駐車場で大量に見かける「神戸ナンバー」の正体は淡路島民",
            "玉ねぎ畑の住人が名乗る「神戸」への激しいコンプレックス"
        ],
        "character": "zunda_explain.png",
        "emotion": "🚗",
        "speaker": 3,
        "intonationScale": 1.20,
        "speedScale": 1.15,
        "pitchScale": 0.0
    },
    {
        "id": "scene4",
        "text": "街のどこからでも望める「眉山」は、ロープウェイで登れば、徳島市街や紀伊水道まで一望できる絶景スポットなのだ！",
        "voice_text": "街のシンボル、眉山は、ロープウェイで登れば、徳島市街や、紀伊水道まで一望できる、絶景スポットなのだ！",
        "topic": "街のシンボル「眉山」",
        "sub": "ロープウェイで山頂へ！市内外を一望する大パノラマ",
        "category": "景観・観光",
        "points": [
            "万葉集にも詠まれた、なだらかな眉の形をした美しい山",
            "阿波おどり会館から山頂までロープウェイで約6分",
            "夜には四国屈指のきらめく夜景スポットとしても大人気"
        ],
        "character": "zunda_default.webp",
        "emotion": "⛰️",
        "speaker": 3,
        "intonationScale": 1.10,
        "speedScale": 1.05,
        "pitchScale": 0.0
    },
    {
        "id": "scene5",
        "text": "濃厚な豚骨醤油スープに生卵が絶品の徳島ラーメンや、爽やかな「すだち」など、美味しいグルメも盛りだくさんなのだ！",
        "voice_text": "濃厚な豚骨醤油スープに、生卵が絶品の、徳島ラーメンや、爽快な、すだちなど、美味しいグルメも、盛りだくさんなのだ！",
        "topic": "自慢のご当地グルメ",
        "sub": "徳島ラーメン・阿波尾鶏・香り豊かなすだち",
        "category": "特産グルメ",
        "points": [
            "甘辛く煮た豚バラ肉と生卵が絡む名物「徳島ラーメン」",
            "全国シェアほぼ100％を誇る徳島特産の香り柑橘「すだち」",
            "地鶏シェア全国トップクラスの旨味たっぷり「阿波尾鶏」"
        ],
        "character": "zunda_greeting.png",
        "emotion": "🍜",
        "speaker": 3,
        "intonationScale": 1.10,
        "speedScale": 1.05,
        "pitchScale": 0.0
    },
    {
        "id": "scene6",
        "text": "そして徳島の隠れたお土産「小男鹿（さおしか）」もおすすめなのだ！観光客はあまり目に留めないけれど、徳島県人にはちょっと特別で豪華なお菓子なのだ！",
        "voice_text": "そして、徳島の隠れたお土産、さおしかも、おすすめなのだ！観光客は、あまり目に留めないけれど、とくしまけんじんには、ちょっと特別で、豪華なお菓子なのだ！",
        "topic": "隠れた極上銘菓「小男鹿」",
        "sub": "観光客は知らない？徳島県人が愛する特別な高級和菓子",
        "category": "伝統銘菓",
        "points": [
            "山芋と阿波和三盆糖が織りなす伝統の極上蒸し菓子",
            "上品な甘みと小豆、鹿の子斑紋が美しい老舗・冨士屋の銘菓",
            "日常のおやつではなく「特別な日」にいただく贅沢な味わい"
        ],
        "character": "zunda_explain.png",
        "emotion": "🦌",
        "speaker": 3,
        "intonationScale": 1.10,
        "speedScale": 1.05,
        "pitchScale": 0.0
    },
    {
        "id": "scene7",
        "text": "お祝いや謝罪の菓子折りにも使われるイメージなのだ！あなたも徳島県人を見かけたら、ぜひこの「ごめんなさいの味」を渡してあげてほしいのだ！",
        "voice_text": "お祝いや、謝罪のかしおりにも使われるイメージなのだ！あなたも、とくしまけんじんを見かけたら、ぜひこの、ごめんなさいのあじを、渡してあげてほしいのだ！",
        "topic": "信頼の「ごめんなさいの味」",
        "sub": "お祝いから本気の謝罪まで！徳島県人御用達の菓子折り",
        "category": "県民文化",
        "points": [
            "お祝いはもちろん、絶対に外せない「謝罪の菓子折り」の定番",
            "持参すれば必ず誠意が伝わる、徳島県民からの絶大な信頼感",
            "徳島県人に渡せば笑顔になること間違いなしのソウル銘菓！"
        ],
        "character": "zunda_proud.png",
        "emotion": "🙇",
        "speaker": 3,
        "intonationScale": 1.08,
        "speedScale": 1.05,
        "pitchScale": 0.0
    },
    {
        "id": "scene8",
        "text": "徳島城跡の緑豊かな公園や阿波十郎兵衛屋敷など、阿波藩主・蜂須賀家の歴史と伝統が今も大切に受け継がれているのだ！",
        "voice_text": "とくしまじょうあとの、緑豊かな公園や、阿波十郎兵衛屋敷など、阿波の歴史と伝統が、今も大切に受け継がれているのだ！",
        "topic": "蜂須賀家25万石の歴史遺産",
        "sub": "徳島城跡公園・旧徳島城表御殿庭園・国指定名勝",
        "category": "歴史遺産",
        "points": [
            "阿波藩主・蜂須賀家の居城跡が広がる緑豊かな徳島中央公園",
            "国の名勝に指定された風情ある「旧徳島城表御殿庭園」",
            "国指定重要無形民俗文化財の「阿波人形浄瑠璃」も上演"
        ],
        "character": "zunda_explain.png",
        "emotion": "🏯",
        "speaker": 3,
        "intonationScale": 1.10,
        "speedScale": 1.05,
        "pitchScale": 0.0
    },
    {
        "id": "scene9",
        "text": "魅力あふれる徳島市へ、ぜひ遊びに来てほしいのだ！イベントや観光の詳細は、徳島市公式ホームページをご覧くださいなのだ！",
        "voice_text": "魅力あふれる徳島市へ、ぜひ遊びに来てほしいのだ！イベントや観光の詳細は、徳島市公式ホームページを、ご覧くださいなのだ！",
        "topic": "徳島市へのお越しをお待ちしています",
        "sub": "観光・イベント情報は「徳島市公式ホームページ」へ！",
        "category": "ご案内・広報",
        "points": [
            "徳島市役所 経済部観光課／にぎわい交流課",
            "徳島市公式ウェブサイト：https://www.city.tokushima.tokushima.jp",
            "四季折々のイベント・ふるさと納税情報も随時発信中！"
        ],
        "character": "zunda_greeting.png",
        "emotion": "✨",
        "speaker": 3,
        "intonationScale": 1.10,
        "speedScale": 1.05,
        "pitchScale": 0.0
    }
]

AUDIO_DIR = "/Users/daisuke/Desktop/ずんだもんテスト/public/audio"
META_FILE = "/Users/daisuke/Desktop/ずんだもんテスト/src/scene_data.json"

def check_voicevox():
    try:
        req = urllib.request.Request("http://127.0.0.1:50021/version")
        with urllib.request.urlopen(req, timeout=2) as res:
            return res.status == 200
    except Exception:
        return False

def generate_voicevox_audio(item, output_path):
    text = item.get("voice_text", item["text"])
    speaker = item["speaker"]
    intonation = item.get("intonationScale", 1.10)
    speed = item.get("speedScale", 1.05)
    pitch = item.get("pitchScale", 0.0)

    query_url = f"http://127.0.0.1:50021/audio_query?text={urllib.parse.quote(text)}&speaker={speaker}"
    req = urllib.request.Request(query_url, method="POST")
    with urllib.request.urlopen(req) as res:
        query_data = json.loads(res.read().decode("utf-8"))

    query_data["intonationScale"] = intonation
    query_data["speedScale"] = speed
    query_data["pitchScale"] = pitch

    # 「味を（アジオ）」が語尾上がり（accent:3）になるのを防ぎ、自然な頭高型（accent:1）に補正
    for ap in query_data.get("accent_phrases", []):
        moras = "".join([m["text"] for m in ap["moras"]])
        if "アジオ" in moras:
            ap["accent"] = 1

    synth_url = f"http://127.0.0.1:50021/synthesis?speaker={speaker}"
    data_bytes = json.dumps(query_data).encode("utf-8")
    synth_req = urllib.request.Request(synth_url, data=data_bytes, headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(synth_req) as res:
        audio_bytes = res.read()
    
    # 一時RAWファイルに書き込み後、ffmpegで音圧・ラウドネスをプロ品質（-14 LUFS）へ大幅ブースト＆ステレオ化
    temp_raw = output_path + ".raw.wav"
    with open(temp_raw, "wb") as f:
        f.write(audio_bytes)

    norm_cmd = [
        "ffmpeg", "-y", "-i", temp_raw,
        "-af", "loudnorm=I=-14:LRA=7:TP=-1.0,volume=1.5dB",
        "-ar", "48000", "-ac", "2",
        output_path
    ]
    subprocess.run(norm_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    if os.path.exists(temp_raw):
        os.remove(temp_raw)

def get_audio_duration(path):
    res = subprocess.run([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", path
    ], stdout=subprocess.PIPE, text=True, check=True)
    return float(res.stdout.strip())

def main():
    os.makedirs(AUDIO_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(META_FILE), exist_ok=True)
    
    is_vv_available = check_voicevox()
    if not is_vv_available:
        print("Error: VOICEVOX engine is not available at http://127.0.0.1:50021!")
        return

    scenes_output = []
    fps = 30
    total_frames = 0

    for idx, item in enumerate(SCRIPT_DATA):
        wav_name = f"{item['id']}.wav"
        wav_path = os.path.join(AUDIO_DIR, wav_name)
        
        voice_t = item.get("voice_text", item["text"])
        print(f"[{idx+1}/{len(SCRIPT_DATA)}] (Speaker {item['speaker']}, Intonation {item['intonationScale']}) {voice_t}")
        generate_voicevox_audio(item, wav_path)
        
        duration = get_audio_duration(wav_path)
        padded_duration = duration + 0.8
        duration_in_frames = int(round(padded_duration * fps))

        scene_info = {
            **item,
            "audioFile": f"audio/{wav_name}",
            "duration": duration,
            "durationInFrames": duration_in_frames,
            "startFrame": total_frames
        }
        scenes_output.append(scene_info)
        total_frames += duration_in_frames

    final_data = {
        "fps": fps,
        "totalFrames": total_frames,
        "totalDuration": total_frames / fps,
        "scenes": scenes_output,
        "isVoicevox": True
    }

    with open(META_FILE, "w", encoding="utf-8") as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)

    print(f"\nSuccessfully generated all {len(SCRIPT_DATA)} Tokushima scenes!")
    print(f"Total video duration: {total_frames / fps:.2f}s ({total_frames} frames at {fps} fps)")

if __name__ == "__main__":
    main()
