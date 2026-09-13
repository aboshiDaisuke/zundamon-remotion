import math
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(BASE_DIR, "public", "images", "pure_illust")
os.makedirs(OUT_DIR, exist_ok=True)

def get_font(size, bold=True):
    for fp in [
        "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc",
        "/System/Library/Fonts/Hiragino Sans GB.ttc",
        "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"
    ]:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, size)
            except:
                pass
    return ImageFont.load_default()

# ----------------------------------------------------
# Scene 4: 百貨店閉店イラスト (Closed Department Store)
# ----------------------------------------------------
def draw_scene4():
    w, h = 1280, 720
    im = Image.new("RGBA", (w, h), (210, 225, 245, 255))
    draw = ImageDraw.Draw(im)

    # Sky gradient
    for y in range(h):
        r = int(180 + (240 - 180) * (y / h))
        g = int(210 + (245 - 210) * (y / h))
        b = int(245 + (255 - 245) * (y / h))
        draw.line([(0, y), (w, y)], fill=(r, g, b))

    # Distant mountains & town
    draw.polygon([(0, 480), (300, 420), (600, 450), (900, 410), (1280, 470), (1280, 720), (0, 720)], fill=(160, 185, 210))

    # Road & Plaza
    draw.rectangle([0, 520, w, 720], fill=(130, 140, 155))
    for x in range(0, w, 160):
        draw.line([x, 620, x+80, 620], fill=(240, 240, 240), width=6)

    # Department Store Building (Center-Left)
    bx1, by1, bx2, by2 = 280, 150, 1000, 550
    draw.rectangle([bx1, by1, bx2, by2], fill=(235, 238, 242), outline=(90, 105, 125), width=5)
    # Windows grid
    for wx in range(bx1 + 60, bx2 - 40, 110):
        for wy in range(by1 + 60, by1 + 220, 60):
            draw.rectangle([wx, wy, wx + 70, wy + 40], fill=(120, 150, 180), outline=(70, 85, 105), width=2)
            # Window reflection
            draw.line([wx + 5, wy + 35, wx + 35, wy + 5], fill=(200, 220, 240), width=2)

    # Big Closed Shutter on Ground Floor
    sx1, sy1, sx2, sy2 = bx1 + 80, by1 + 260, bx2 - 80, by2
    draw.rectangle([sx1, sy1, sx2, sy2], fill=(185, 195, 205), outline=(70, 80, 95), width=4)
    for sy in range(sy1 + 18, sy2, 18):
        draw.line([sx1, sy, sx2, sy], fill=(145, 155, 168), width=2)

    # Signboard on Rooftop (Blank / Removed logo mark)
    draw.rectangle([bx1 + 180, by1 - 70, bx2 - 180, by1], fill=(220, 225, 235), outline=(90, 105, 125), width=4)
    draw.text((bx1 + 230, by1 - 60), "百貨店 跡地", font=get_font(42, True), fill=(120, 130, 145))

    # Dramatic "CLOSED 閉店" diagonal caution tape
    tape = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(tape)
    tdraw.polygon([(sx1-40, sy1+140), (sx2+40, sy1+40), (sx2+40, sy1+120), (sx1-40, sy1+220)], fill=(220, 45, 60, 240))
    f_tape = get_font(48, True)
    tdraw.text((sx1 + 160, sy1 + 110), "★ 完 全 閉 店 ★", font=f_tape, fill=(255, 255, 255))
    im = Image.alpha_composite(im, tape)

    # Speech balloon badge
    draw = ImageDraw.Draw(im)
    draw.rounded_rectangle([780, 60, 1200, 140], radius=16, fill=(255, 245, 220), outline=(230, 160, 40), width=3)
    draw.text((810, 82), "県内デパート消滅…！", font=get_font(34, True), fill=(180, 50, 20))

    im.convert("RGB").save(os.path.join(OUT_DIR, "illust_scene4_closed.jpg"), quality=95)
    print("Saved pure illust 4")

draw_scene4()

# ----------------------------------------------------
# Scene 5: 阿波踊り狂乱イラスト (Awa Odori Vibrant Night)
# ----------------------------------------------------
def draw_scene5():
    w, h = 1280, 720
    im = Image.new("RGBA", (w, h), (18, 15, 36, 255))
    draw = ImageDraw.Draw(im)

    # Night sky with warm festival glow
    for y in range(h):
        ratio = y / h
        r = int(18 + (65 - 18) * ratio)
        g = int(15 + (25 - 15) * ratio)
        b = int(36 + (50 - 36) * ratio)
        draw.line([(0, y), (w, y)], fill=(r, g, b))

    # Giant glowing moon
    draw.ellipse([880, 60, 1080, 260], fill=(255, 245, 190), outline=(255, 220, 100), width=4)
    # Soft moon glow
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([840, 20, 1120, 300], fill=(255, 230, 120, 60))
    im = Image.alpha_composite(im, glow)
    draw = ImageDraw.Draw(im)

    # Festival Red Lanterns hanging across top
    for i, lx in enumerate(range(120, 1200, 170)):
        ly = 80 + int(math.sin(i * 0.8) * 25)
        draw.line([lx, 0, lx, ly], fill=(200, 200, 200), width=3)
        # Red lantern
        draw.ellipse([lx - 45, ly, lx + 45, ly + 110], fill=(240, 45, 45), outline=(255, 210, 80), width=4)
        draw.text((lx - 20, ly + 25), "祭", font=get_font(42, True), fill=(255, 240, 180))
        draw.rectangle([lx - 20, ly - 8, lx + 20, ly], fill=(40, 40, 40))
        draw.rectangle([lx - 20, ly + 110, lx + 20, ly + 118], fill=(40, 40, 40))

    # Wooden festival stage floor
    draw.polygon([(0, 480), (w, 480), (w, 720), (0, 720)], fill=(110, 55, 30))
    for px in range(0, w, 100):
        draw.line([px, 480, px - 120, 720], fill=(85, 40, 20), width=3)

    # Silhouette dancers with traditional straw hats (Amigasa) and raised arms
    def draw_dancer(cx, cy, scale, color):
        # Amigasa (woven hat)
        hw = int(70 * scale)
        hh = int(35 * scale)
        draw.polygon([(cx - hw, cy), (cx, cy - hh), (cx + hw, cy), (cx, cy + int(hh*0.4))], fill=(250, 220, 120), outline=(160, 120, 50), width=2)
        # Kimono Body
        bw = int(45 * scale)
        bh = int(120 * scale)
        draw.polygon([(cx - int(bw*0.8), cy + int(hh*0.4)), (cx + int(bw*0.8), cy + int(hh*0.4)), (cx + bw, cy + bh), (cx - bw, cy + bh)], fill=color)
        # Raised Arms
        draw.line([cx - int(bw*0.6), cy + int(bh*0.3), cx - int(bw*1.5), cy - int(bh*0.2)], fill=(255, 215, 180), width=int(10*scale))
        draw.line([cx + int(bw*0.6), cy + int(bh*0.3), cx + int(bw*1.5), cy - int(bh*0.2)], fill=(255, 215, 180), width=int(10*scale))

    draw_dancer(320, 360, 1.4, (240, 80, 120))
    draw_dancer(540, 330, 1.6, (255, 110, 80))
    draw_dancer(760, 340, 1.5, (180, 70, 210))
    draw_dancer(980, 370, 1.3, (240, 80, 120))

    # Banner Title
    draw.rounded_rectangle([260, 560, 1020, 660], radius=20, fill=(230, 40, 60), outline=(255, 230, 120), width=4)
    draw.text((310, 580), "狂乱の4日間！100万人の熱気", font=get_font(42, True), fill=(255, 255, 255))

    im.convert("RGB").save(os.path.join(OUT_DIR, "illust_scene5_awaodori.jpg"), quality=95)
    print("Saved pure illust 5")

draw_scene5()

# ----------------------------------------------------
# Scene 6: 関西の植民地？（テレビ電波と明石海峡大橋）
# ----------------------------------------------------
def draw_scene6():
    w, h = 1280, 720
    im = Image.new("RGBA", (w, h), (215, 235, 255, 255))
    draw = ImageDraw.Draw(im)

    # Blue sea and sunny sky
    draw.rectangle([0, 0, w, 400], fill=(195, 225, 255))
    draw.rectangle([0, 400, w, 720], fill=(50, 120, 190))
    # Sea waves
    for y in range(430, 720, 35):
        for x in range(-50, w, 120):
            draw.arc([x, y, x + 100, y + 25], start=0, end=180, fill=(100, 170, 230), width=3)

    # Akashi Kaikyo Bridge / Naruto Bridge Giant Suspension Towers
    draw.line([340, 150, 340, 450], fill=(220, 230, 240), width=16)
    draw.line([940, 150, 940, 450], fill=(220, 230, 240), width=16)
    # Suspension Cables
    draw.line([100, 400, 340, 170], fill=(180, 195, 215), width=6)
    draw.arc([340, 170, 940, 420], start=0, end=180, fill=(180, 195, 215), width=6)
    draw.line([940, 170, 1180, 400], fill=(180, 195, 215), width=6)
    # Bridge Deck
    draw.rectangle([80, 390, 1200, 420], fill=(140, 155, 175), outline=(90, 105, 125), width=3)

    # Giant Retro TV in foreground (Left side)
    tx, ty, tw, th = 180, 260, 460, 340
    draw.rounded_rectangle([tx, ty, tx+tw, ty+th], radius=25, fill=(60, 65, 75), outline=(30, 35, 45), width=5)
    # Antenna
    draw.line([tx + 230, ty, tx + 140, ty - 90], fill=(180, 190, 200), width=6)
    draw.line([tx + 230, ty, tx + 320, ty - 90], fill=(180, 190, 200), width=6)
    # TV Screen
    draw.rounded_rectangle([tx + 30, ty + 30, tx + tw - 120, ty + th - 30], radius=15, fill=(245, 248, 255), outline=(100, 110, 125), width=4)
    # TV Content: Kansai Comedy show
    draw.text((tx + 60, ty + 60), "📺 大阪の番組", font=get_font(32, True), fill=(20, 40, 100))
    draw.text((tx + 65, ty + 120), "MBS・ABC・KTV", font=get_font(28, True), fill=(210, 40, 40))
    draw.text((tx + 70, ty + 180), "「実質関西ですわ！」", font=get_font(26, True), fill=(40, 120, 60))

    # Speech Bubble on the right
    draw.rounded_rectangle([720, 140, 1180, 300], radius=20, fill=(255, 255, 255), outline=(24, 119, 242), width=4)
    draw.text((750, 170), "明石海峡大橋を渡れば", font=get_font(32, True), fill=(40, 50, 70))
    draw.text((750, 225), "すぐ神戸・大阪なのだ！", font=get_font(34, True), fill=(24, 119, 242))

    im.convert("RGB").save(os.path.join(OUT_DIR, "illust_scene6_kansai.jpg"), quality=95)
    print("Saved pure illust 6")

draw_scene6()

# ----------------------------------------------------
# Scene 7: 徳島ラーメン＆白ご飯 (Ramen with Raw Egg & Rice)
# ----------------------------------------------------
def draw_scene7():
    w, h = 1280, 720
    im = Image.new("RGBA", (w, h), (42, 24, 18, 255))
    draw = ImageDraw.Draw(im)

    # Warm wood table background
    for y in range(h):
        r = int(60 + (40 - 60) * (y / h))
        g = int(35 + (20 - 35) * (y / h))
        b = int(25 + (15 - 25) * (y / h))
        draw.line([(0, y), (w, y)], fill=(r, g, b))
    # Table grain lines
    for ly in range(0, h, 60):
        draw.line([0, ly, w, ly], fill=(30, 15, 10), width=2)

    # Ramen Bowl (Center Left)
    rcx, rcy, r_rad = 420, 390, 230
    # Red lacquered bowl exterior
    draw.ellipse([rcx - r_rad, rcy - r_rad, rcx + r_rad, rcy + r_rad], fill=(185, 35, 25), outline=(235, 195, 120), width=8)
    # Inner dark soup
    sr_rad = int(r_rad * 0.85)
    draw.ellipse([rcx - sr_rad, rcy - sr_rad, rcx + sr_rad, rcy + sr_rad], fill=(75, 32, 12), outline=(130, 60, 25), width=4)
    # Ramen Noodles swirls
    for ang in range(0, 360, 45):
        rad = math.radians(ang)
        nx = rcx + int(math.cos(rad) * 90)
        ny = rcy + int(math.sin(rad) * 90)
        draw.arc([nx-40, ny-30, nx+40, ny+30], start=0, end=270, fill=(245, 220, 140), width=5)

    # Simmered Pork Belly (甘辛豚バラ肉)
    draw.rounded_rectangle([rcx - 120, rcy - 50, rcx + 40, rcy + 70], radius=15, fill=(115, 45, 15), outline=(180, 85, 35), width=3)
    draw.rounded_rectangle([rcx - 80, rcy - 100, rcx + 80, rcy], radius=15, fill=(130, 55, 20), outline=(195, 95, 40), width=3)

    # Raw Egg Yolk (生卵 黄身) in the center
    draw.ellipse([rcx - 45, rcy - 40, rcx + 45, rcy + 50], fill=(255, 175, 15), outline=(255, 240, 180), width=4)
    # Egg shine
    draw.ellipse([rcx - 20, rcy - 25, rcx + 5, rcy], fill=(255, 245, 220))

    # Green Scallions
    for gx, gy in [(rcx-60, rcy+80), (rcx-40, rcy+100), (rcx+20, rcy+85), (rcx-80, rcy+60), (rcx+60, rcy+70)]:
        draw.ellipse([gx-12, gy-12, gx+12, gy+12], fill=(60, 160, 60), outline=(30, 100, 30), width=2)

    # Big Bowl of White Rice (Right side)
    bcx, bcy, br_rad = 880, 420, 160
    # Ceramic bowl
    draw.ellipse([bcx - br_rad, bcy - br_rad, bcx + br_rad, bcy + br_rad], fill=(240, 242, 248), outline=(60, 90, 150), width=6)
    # Rice mound
    draw.ellipse([bcx - int(br_rad*0.8), bcy - int(br_rad*0.9), bcx + int(br_rad*0.8), bcy + int(br_rad*0.5)], fill=(255, 255, 255), outline=(215, 220, 230), width=2)
    draw.text((bcx - 110, bcy - 40), "山盛り白ご飯", font=get_font(34, True), fill=(50, 60, 80))

    # Steam rising
    for sx in [rcx - 60, rcx + 40, bcx]:
        draw.arc([sx - 30, 140, sx + 30, 240], start=45, end=225, fill=(255, 255, 255, 120), width=4)

    # Warning Pill at the top
    draw.rounded_rectangle([280, 50, 1000, 140], radius=16, fill=(230, 40, 40), outline=(255, 220, 100), width=4)
    draw.text((320, 70), "⚠️ 白飯がないと塩分で倒れるのだ！", font=get_font(36, True), fill=(255, 255, 255))

    im.convert("RGB").save(os.path.join(OUT_DIR, "illust_scene7_ramen.jpg"), quality=95)
    print("Saved pure illust 7")

draw_scene7()

# ----------------------------------------------------
# Scene 8: 高級銘菓 小男鹿（上品な和菓子）
# ----------------------------------------------------
def draw_scene8():
    w, h = 1280, 720
    im = Image.new("RGBA", (w, h), (248, 244, 238, 255))
    draw = ImageDraw.Draw(im)

    # Elegant Japanese Tatami / Wood background
    draw.rectangle([0, 0, w, 320], fill=(240, 235, 225))
    draw.rectangle([0, 320, w, 720], fill=(215, 205, 190))
    for tx in range(0, w, 40):
        draw.line([tx, 320, tx, 720], fill=(195, 185, 170), width=1)

    # Black Lacquer Tray (Center)
    tx1, ty1, tx2, ty2 = 240, 200, 1040, 580
    draw.rounded_rectangle([tx1, ty1, tx2, ty2], radius=30, fill=(35, 30, 32), outline=(180, 40, 45), width=6)

    # Saoshika Sweet (Steamed Cake Block)
    # Cut slices on the tray
    sx1, sy1, sx2, sy2 = 340, 270, 720, 500
    # Bean paste & Yam mottled texture
    draw.rounded_rectangle([sx1, sy1, sx2, sy2], radius=15, fill=(185, 145, 115), outline=(120, 85, 60), width=4)
    # Mottled azuki bean spots (鹿の子模様)
    for bx, by in [(400, 320), (480, 350), (560, 310), (640, 360), (430, 420), (510, 450), (590, 430), (660, 460)]:
        draw.ellipse([bx-18, by-14, bx+18, by+14], fill=(75, 35, 30))

    # Deer brand mark on cake
    draw.text((460, 370), "小男鹿", font=get_font(46, True), fill=(255, 245, 235))

    # Bamboo Pick (黒文字・楊枝)
    draw.line([380, 520, 580, 470], fill=(160, 180, 90), width=8)

    # Green Tea Cup (Right side)
    tcx, tcy = 870, 380
    draw.ellipse([tcx - 80, tcy - 80, tcx + 80, tcy + 80], fill=(245, 245, 245), outline=(100, 130, 90), width=5)
    draw.ellipse([tcx - 65, tcy - 65, tcx + 65, tcy + 65], fill=(110, 165, 80))

    # Header Card
    draw.rounded_rectangle([280, 50, 1000, 140], radius=16, fill=(120, 65, 40), outline=(220, 185, 130), width=4)
    draw.text((330, 70), "🦌 徳島の極上銘菓「小男鹿（さおしか）」", font=get_font(34, True), fill=(255, 250, 240))

    im.convert("RGB").save(os.path.join(OUT_DIR, "illust_scene8_saoshika.jpg"), quality=95)
    print("Saved pure illust 8")

draw_scene8()

# ----------------------------------------------------
# Scene 9: ごめんなさいの味（謝罪・土下座コミックイラスト）
# ----------------------------------------------------
def draw_scene9():
    w, h = 1280, 720
    im = Image.new("RGBA", (w, h), (255, 245, 245, 255))
    draw = ImageDraw.Draw(im)

    # Comic Concentration Lines (集中線)
    ccx, ccy = 640, 450
    for ang in range(0, 360, 6):
        rad = math.radians(ang)
        ex = ccx + int(math.cos(rad) * 900)
        ey = ccy + int(math.sin(rad) * 900)
        draw.line([ccx, ccy, ex, ey], fill=(255, 220, 225), width=3)

    # Tatami Floor
    draw.rectangle([0, 460, w, 720], fill=(225, 215, 180), outline=(140, 130, 90), width=3)

    # Dogeza Figure (Prostrating in deep apology)
    # Head touching floor
    draw.ellipse([340, 420, 460, 520], fill=(255, 220, 190), outline=(60, 60, 60), width=4)
    # Hair
    draw.arc([340, 420, 460, 500], start=180, end=360, fill=(40, 40, 40), width=18)
    # Body bent forward
    draw.polygon([(420, 460), (620, 390), (740, 480), (520, 540)], fill=(45, 55, 80), outline=(30, 35, 55), width=4)
    # Sweat drops
    draw.ellipse([310, 380, 335, 420], fill=(100, 180, 255), outline=(50, 120, 200), width=2)

    # Saoshika Gift Box being offered forward with both hands
    gx1, gy1, gx2, gy2 = 700, 410, 1080, 570
    draw.rounded_rectangle([gx1, gy1, gx2, gy2], radius=15, fill=(230, 195, 150), outline=(130, 85, 45), width=5)
    # Traditional Red/White Noshi Paper Wrap (のし紙)
    draw.rectangle([gx1 + 100, gy1, gx1 + 280, gy2], fill=(255, 255, 255), outline=(210, 50, 50), width=3)
    draw.line([gx1 + 100, gy1 + 80, gx1 + 280, gy1 + 80], fill=(220, 40, 40), width=4)
    draw.text((gx1 + 130, gy1 + 30), "深 謝", font=get_font(34, True), fill=(180, 30, 30))
    draw.text((gx1 + 135, gy1 + 95), "小男鹿", font=get_font(28, True), fill=(50, 50, 50))

    # Big Comic Banner
    draw.rounded_rectangle([180, 50, 1100, 150], radius=20, fill=(225, 45, 65), outline=(255, 235, 120), width=5)
    draw.text((220, 75), "🙇 徳島県民に絶対通じる「ごめんなさいの味」！", font=get_font(36, True), fill=(255, 255, 255))

    im.convert("RGB").save(os.path.join(OUT_DIR, "illust_scene9_apology.jpg"), quality=95)
    print("Saved pure illust 9")

draw_scene9()

# ----------------------------------------------------
# Scene 10: フィナーレ・徳島市へようこそ！ (Welcome Finale)
# ----------------------------------------------------
def draw_scene10():
    w, h = 1280, 720
    im = Image.new("RGBA", (w, h), (235, 250, 245, 255))
    draw = ImageDraw.Draw(im)

    # Scenic Blue Sky & River
    draw.rectangle([0, 0, w, 360], fill=(210, 240, 255))
    # Mount Bizan in background
    draw.polygon([(100, 360), (450, 160), (800, 360)], fill=(120, 175, 140))
    # River
    draw.rectangle([0, 360, w, 720], fill=(70, 165, 215))

    # Sightseeing Boat (Hyotanjima Cruise)
    draw.polygon([(480, 480), (800, 480), (740, 550), (540, 550)], fill=(250, 250, 255), outline=(40, 80, 140), width=4)
    draw.rectangle([540, 440, 740, 480], fill=(230, 60, 60))
    draw.text((570, 448), "ひょうたん島号", font=get_font(24, True), fill=(255, 255, 255))

    # Cheerful Welcome Ribbon
    draw.rounded_rectangle([180, 50, 1100, 150], radius=20, fill=(40, 160, 110), outline=(255, 240, 140), width=5)
    draw.text((240, 75), "🌱 汽車に乗って、徳島市に遊びに来てね！ 🌸", font=get_font(36, True), fill=(255, 255, 255))

    im.convert("RGB").save(os.path.join(OUT_DIR, "illust_scene10_welcome.jpg"), quality=95)
    print("Saved pure illust 10")

draw_scene10()

print("All pure illustrations generated successfully!")
