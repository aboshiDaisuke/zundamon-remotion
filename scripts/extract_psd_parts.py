#!/usr/bin/env python3
"""
extract_psd_parts.py
Extract all layer parts from Zundamon and Shikoku Metan PSD files into transparent PNGs,
and composite customized expressions for both characters.
"""

import os
import glob
from psd_tools import PSDImage

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARTS_DIR = os.path.join(BASE_DIR, "public", "parts")
CHAR_DIR = os.path.join(BASE_DIR, "public", "characters")

os.makedirs(os.path.join(PARTS_DIR, "zundamon"), exist_ok=True)
os.makedirs(os.path.join(PARTS_DIR, "metan"), exist_ok=True)
os.makedirs(CHAR_DIR, exist_ok=True)

def find_layer(group, name):
    for l in group:
        if l.name == name:
            return l
        if l.is_group():
            res = find_layer(l, name)
            if res:
                return res
    return None

def set_exclusive(group, target_name):
    for l in group:
        l.visible = (l.name == target_name)

# ==========================================
# 1. 四国めたん PSD の分解・保存
# ==========================================
metan_psd_files = glob.glob(os.path.join(BASE_DIR, "*めたん*.psd"))
if metan_psd_files:
    metan_path = metan_psd_files[0]
    print(f"Loading Metan PSD: {metan_path}")
    psd_m = PSDImage.open(metan_path)

    # 分解保存（各個別レイヤーのtopil()または切り抜き）
    def save_layer_recursively(layer, prefix, dest_dir):
        if layer.is_group():
            sub_dir = os.path.join(dest_dir, layer.name.replace("!", "").replace("*", "").strip())
            os.makedirs(sub_dir, exist_ok=True)
            for child in layer:
                save_layer_recursively(child, prefix, sub_dir)
        else:
            try:
                im = layer.topil()
                if im:
                    safe_name = layer.name.replace("!", "").replace("*", "").replace("/", "_").strip()
                    file_name = f"{safe_name}.png"
                    im.save(os.path.join(dest_dir, file_name))
            except Exception as e:
                pass

    print("Extracting Metan individual layer parts...")
    for top_l in psd_m:
        save_layer_recursively(top_l, "metan", os.path.join(PARTS_DIR, "metan"))

    # シーンに応じためたんの完成立ち絵差分生成
    r_arm = find_layer(psd_m, "!右腕")
    l_arm = find_layer(psd_m, "!左腕")
    color = find_layer(psd_m, "!顔色")
    mouth = find_layer(psd_m, "!口")
    eye = find_layer(psd_m, "!目")
    eyebrow = find_layer(psd_m, "!眉")
    symbols = find_layer(psd_m, "記号など")

    metan_variants = {
        "metan_proud": {
            "r_arm": "*手をかざす", "l_arm": "*口元に指", "color": "*普通2",
            "eyebrow": "*太眉ごきげん", "eye": "*目セット", "mouth": "*ほほえみ", "symbols": None
        },
        "metan_point": {
            "r_arm": "*指差す", "l_arm": "*マイク", "color": "*普通2",
            "eyebrow": "*太眉ごきげん", "eye": "*目セット", "mouth": "*わあー", "symbols": None
        },
        "metan_talk": {
            "r_arm": "*手をかざす", "l_arm": "*マイク", "color": "*普通2",
            "eyebrow": "*ごきげん", "eye": "*目セット", "mouth": "*わあー", "symbols": None
        },
        "metan_listen": {
            "r_arm": "*手をかざす", "l_arm": "*マイク", "color": "*普通2",
            "eyebrow": "*ごきげん", "eye": "*目セット", "mouth": "*ほほえみ", "symbols": None
        },
        "metan_smile": {
            "r_arm": "*手をかざす", "l_arm": "*マイク", "color": "*普通2",
            "eyebrow": "*太眉ごきげん", "eye": "*目閉じ2", "mouth": "*ほほえみ", "symbols": None
        },
        "metan_laugh": {
            "r_arm": "*手をかざす", "l_arm": "*マイク", "color": "*普通2",
            "eyebrow": "*ごきげん", "eye": "*><", "mouth": "*▽", "symbols": None
        },
        "metan_tsukkomi": {
            "r_arm": "*手をかざす", "l_arm": "*普通", "color": "*普通2",
            "eyebrow": "*ややおこ", "eye": "*目セット", "mouth": "*む", "symbols": None
        },
        "metan_surprise": {
            "r_arm": "*普通", "l_arm": "*抱える", "color": "*普通2",
            "eyebrow": "*こまり", "eye": "*○○", "mouth": "*お", "symbols": None
        },
        "metan_troubled": {
            "r_arm": "*手をかざす", "l_arm": "*普通", "color": "*普通2",
            "eyebrow": "*太眉こまり", "eye": "*目セット", "mouth": "*んー", "symbols": "汗"
        },
        "metan_whisper": {
            "r_arm": "*手をかざす", "l_arm": "*ひそひそ", "color": "*普通2",
            "eyebrow": "*ごきげん", "eye": "*目セット", "mouth": "*にやり", "symbols": None
        },
        "metan_closed_proud": {
            "r_arm": "*手をかざす", "l_arm": "*口元に指", "color": "*普通2",
            "eyebrow": "*太眉ごきげん", "eye": "*目閉じ", "mouth": "*にやり", "symbols": None
        },
        "metan_blush": {
            "r_arm": "*手をかざす", "l_arm": "*抱える", "color": "*赤面",
            "eyebrow": "*太眉こまり", "eye": "*目セット", "mouth": "*△", "symbols": None
        }
    }

    for name, cfg in metan_variants.items():
        set_exclusive(r_arm, cfg["r_arm"])
        set_exclusive(l_arm, cfg["l_arm"])
        set_exclusive(color, cfg["color"])
        set_exclusive(eyebrow, cfg["eyebrow"])
        set_exclusive(eye, cfg["eye"])
        set_exclusive(mouth, cfg["mouth"])
        if symbols:
            for s in symbols:
                s.visible = (s.name == cfg["symbols"])
        out_f = os.path.join(CHAR_DIR, f"{name}.png")
        psd_m.composite(force=True).save(out_f)
        print(f"Generated Metan: {name}.png")

# ==========================================
# 2. ずんだもん PSD の分解・保存
# ==========================================
zunda_psd_files = glob.glob(os.path.join(BASE_DIR, "*ずんだもん*.psd")) + glob.glob(os.path.join(BASE_DIR, "*ずんだもん*.psd"))
if zunda_psd_files:
    zunda_path = zunda_psd_files[0]
    print(f"\nLoading Zundamon PSD: {zunda_path}")
    psd_z = PSDImage.open(zunda_path)

    print("Extracting Zundamon individual layer parts...")
    for top_l in psd_z:
        save_layer_recursively(top_l, "zundamon", os.path.join(PARTS_DIR, "zundamon"))

    # シーンに応じたずんだもんの完成立ち絵差分生成
    fuku1 = find_layer(psd_z, "*服装1")
    fuku2 = find_layer(psd_z, "*服装2")
    if fuku1: fuku1.visible = True
    if fuku2: fuku2.visible = False

    zr_arm = find_layer(fuku1, "!右腕")
    zl_arm = find_layer(fuku1, "!左腕")
    zcolor = find_layer(psd_z, "!顔色")
    zmouth = find_layer(psd_z, "!口")
    zeye = find_layer(psd_z, "!目")
    zeyebrow = find_layer(psd_z, "!眉")
    zedamame = find_layer(psd_z, "!枝豆")
    zsymbols = find_layer(psd_z, "記号など")

    zundamon_variants = {
        # 1. 挨拶・元気（手を挙げる）
        "zunda_greeting": {
            "r_arm": "*手を挙げる", "l_arm": "*基本", "color": "*ほっぺ",
            "eyebrow": "*普通眉", "eye": "*目セット", "mouth": "*ほあー", "symbols": None
        },
        # 2. 解説・案内（指差し）
        "zunda_explain": {
            "r_arm": "*指差し", "l_arm": "*基本", "color": "*ほっぺ",
            "eyebrow": "*上がり眉", "eye": "*目セット", "mouth": "*ほあ", "symbols": None
        },
        # 3. ドヤ顔（腰当て・にっこり）
        "zunda_proud": {
            "r_arm": "*腰", "l_arm": "*腰", "color": "*ほっぺ2",
            "eyebrow": "*怒り眉", "eye": "*にっこり2", "mouth": "*むふ", "symbols": None
        },
        # 4. 聞き手・待機（穏やか）
        "zunda_listen": {
            "r_arm": "*基本", "l_arm": "*基本", "color": "*ほっぺ",
            "eyebrow": "*普通眉", "eye": "*目セット", "mouth": "*ほあ", "symbols": None
        },
        # 5. お腹空いた・よだれ・困り
        "zunda_hungry": {
            "r_arm": "*口元", "l_arm": "*苦しむ", "color": "*ほっぺ赤め",
            "eyebrow": "*困り眉1", "eye": "*なごみ目", "mouth": "*ゆ", "symbols": "汗1"
        },
        # 6. 大喜び・阿波踊り
        "zunda_dance": {
            "r_arm": "*手を挙げる", "l_arm": "*手を挙げる", "color": "*ほっぺ2",
            "eyebrow": "*上がり眉", "eye": "*><", "mouth": "*ほあー", "symbols": None
        },
        # 7. 謝罪・ごめんなさいの味
        "zunda_apology": {
            "r_arm": "*苦しむ", "l_arm": "*苦しむ", "color": "*青ざめ",
            "eyebrow": "*困り眉2", "eye": "*UU", "mouth": "*んー", "symbols": "汗2"
        },
        # 8. 満面の笑顔
        "zunda_smile": {
            "r_arm": "*手を挙げる", "l_arm": "*基本", "color": "*ほっぺ2",
            "eyebrow": "*普通眉", "eye": "*にっこり", "mouth": "*ほあー", "symbols": None
        }
    }

    for name, cfg in zundamon_variants.items():
        set_exclusive(zr_arm, cfg["r_arm"])
        set_exclusive(zl_arm, cfg["l_arm"])
        set_exclusive(zcolor, cfg["color"])
        set_exclusive(zeyebrow, cfg["eyebrow"])
        set_exclusive(zeye, cfg["eye"])
        set_exclusive(zmouth, cfg["mouth"])
        if zsymbols:
            for s in zsymbols:
                s.visible = (s.name == cfg["symbols"])
        out_f = os.path.join(CHAR_DIR, f"{name}.png")
        psd_z.composite(force=True).save(out_f)
        print(f"Generated Zundamon: {name}.png")

print("\nAll PSD parts and composite images extracted and generated successfully!")
