#!/usr/bin/env python3
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_IMG = os.path.join(BASE_DIR, "public", "images", "card_scene3_aeon.jpg")
OUT_IMG = os.path.join(BASE_DIR, "public", "images", "card_scene3_kobe.jpg")

im = Image.open(SRC_IMG).convert("RGBA")
w, h = im.size # 1280, 720

def get_font(size, bold=True):
    for fp in [
        "/System/Library/Fonts/ヒラギノ角ゴシック W8.ttc",
        "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc",
        "/System/Library/Fonts/Hiragino Sans GB.ttc",
        "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    ]:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, size)
            except:
                pass
    return ImageFont.load_default()

font_plate_title = get_font(30)
font_plate_num = get_font(50)
font_badge = get_font(22)
font_small = get_font(20)
font_bubble = get_font(24)

overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
draw = ImageDraw.Draw(overlay)

# License plate box on the right parking lot area
pw, ph = 420, 220
px, py = w - 460, h - 265

# Shadow
draw.rounded_rectangle([px+8, py+8, px+pw+8, py+ph+8], radius=16, fill=(0, 0, 0, 160))
# License plate body
draw.rounded_rectangle([px, py, px+pw, py+ph], radius=16, fill=(255, 255, 255, 250), outline=(30, 90, 40, 255), width=5)

# Bolts
draw.ellipse([px+40, py+16, px+66, py+42], fill=(210, 210, 210, 255), outline=(120, 120, 120, 255), width=2)
draw.ellipse([px+pw-66, py+16, px+pw-40, py+42], fill=(210, 210, 210, 255), outline=(120, 120, 120, 255), width=2)

# Plate Text: "神戸 580"
draw.text((px + 125, py + 12), "神 戸  580", fill=(20, 70, 30, 255), font=font_plate_title)
# Plate Number: "あ 77-88"
draw.text((px + 60, py + 54), "あ  77-88", fill=(20, 70, 30, 255), font=font_plate_num)

# Explanatory Comic Badge attached to plate
bx, by = px - 40, py - 46
badge_w = 440
draw.rounded_rectangle([bx+4, by+4, bx+badge_w+4, by+40+4], radius=10, fill=(0, 0, 0, 140))
draw.rounded_rectangle([bx, by, bx+badge_w, by+40], radius=10, fill=(230, 81, 0, 250), outline=(255, 255, 255, 255), width=3)
draw.text((bx + 14, by + 8), "【衝撃】正体：淡路島（玉ねぎ畑）の住人", fill=(255, 255, 255, 255), font=font_badge)

# Bottom note on plate:
draw.rectangle([px, py+ph-48, px+pw, py+ph], fill=(232, 245, 233, 255))
draw.text((px + 16, py + ph - 38), "「玉ねぎ畑なのに神戸ナンバーずるい！」", fill=(183, 28, 28, 255), font=font_small)

# Complex Bubble
cb_x, cb_y = 400, h - 145
draw.rounded_rectangle([cb_x+4, cb_y+4, cb_x+330+4, cb_y+75+4], radius=16, fill=(0, 0, 0, 130))
draw.rounded_rectangle([cb_x, cb_y, cb_x+330, cb_y+75], radius=16, fill=(255, 255, 255, 250), outline=(46, 125, 50, 255), width=3)
draw.text((cb_x + 18, cb_y + 10), "徳島ナンバーの\n激しいコンプレックス…！", fill=(46, 125, 50, 255), font=font_bubble)

# Merge
final = Image.alpha_composite(im, overlay).convert("RGB")
final.save(OUT_IMG, quality=95)
print(f"Generated {OUT_IMG}")
