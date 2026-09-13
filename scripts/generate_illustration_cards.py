#!/usr/bin/env python3
"""
generate_illustration_cards.py
Generates clean, premium anime/comic-style explanation cards (16:9, 1280x720)
for all 10 scenes, matching the style of the AI-generated illustrations.
"""

import os
import shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(BASE_DIR, "public", "images")
os.makedirs(IMG_DIR, exist_ok=True)

# Copy the 3 already generated Gemini anime illustrations
shutil.copyfile(
    "/Users/daisuke/.gemini/antigravity-ide/brain/a8b9392d-8ca3-4298-8452-c08499d0b052/illust_scene1_city_1789278525582.jpg",
    os.path.join(IMG_DIR, "card_scene1_bizan.jpg")
)
shutil.copyfile(
    "/Users/daisuke/.gemini/antigravity-ide/brain/a8b9392d-8ca3-4298-8452-c08499d0b052/illust_scene2_diesel_1789278542903.jpg",
    os.path.join(IMG_DIR, "card_scene2_diesel.jpg")
)
shutil.copyfile(
    "/Users/daisuke/.gemini/antigravity-ide/brain/a8b9392d-8ca3-4298-8452-c08499d0b052/illust_scene3_aeon_1789278559293.jpg",
    os.path.join(IMG_DIR, "card_scene3_aeon.jpg")
)
print("Copied scenes 1, 2, 3 anime art.")

def get_font(size, bold=True):
    for fp in [
        "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc",
        "/System/Library/Fonts/Hiragino Sans GB.ttc",
        "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
        "/Library/Fonts/Arial Unicode.ttf"
    ]:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, size)
            except:
                pass
    return ImageFont.load_default()

def create_card_base(bg_color_top, bg_color_bottom):
    w, h = 1280, 720
    base = Image.new("RGB", (w, h), bg_color_top)
    draw = ImageDraw.Draw(base)
    # Smooth gradient
    for y in range(h):
        ratio = y / h
        r = int(bg_color_top[0] * (1 - ratio) + bg_color_bottom[0] * ratio)
        g = int(bg_color_top[1] * (1 - ratio) + bg_color_bottom[1] * ratio)
        b = int(bg_color_top[2] * (1 - ratio) + bg_color_bottom[2] * ratio)
        draw.line([(0, y), (w, y)], fill=(r, g, b))
    return base

# --- Scene 4: 百貨店全滅（そごう徳島閉店・デパートゼロ県） ---
def gen_scene4_department():
    base = create_card_base((240, 245, 250), (210, 220, 235))
    draw = ImageDraw.Draw(base)
    f_title = get_font(52, True)
    f_sub = get_font(32, False)
    f_badge = get_font(28, True)
    
    # Building silhouette illustration
    # Blue sky & clouds
    draw.rectangle([100, 100, 1180, 620], fill=(255, 255, 255), outline=(180, 195, 215), width=4)
    
    # Store front
    draw.rectangle([160, 220, 600, 580], fill=(230, 235, 245), outline=(120, 140, 170), width=3)
    # Shutter pattern
    for sy in range(320, 580, 20):
        draw.line([180, sy, 580, sy], fill=(160, 175, 195), width=2)
    
    # "CLOSED / 閉店" tape banner across shutter
    draw.polygon([(150, 420), (610, 360), (610, 420), (150, 480)], fill=(220, 53, 69))
    f_closed = get_font(38, True)
    draw.text((260, 400), "CLOSED 閉店", font=f_closed, fill=(255, 255, 255))
    
    # Signboard on building
    draw.rectangle([240, 160, 520, 220], fill=(30, 70, 140), outline=(255, 255, 255), width=3)
    draw.text((270, 172), "元・デパート", font=get_font(32, True), fill=(255, 255, 255))
    
    # Right side infographic
    draw.rectangle([660, 160, 1120, 580], fill=(248, 250, 253), outline=(210, 225, 240), width=2)
    # Big warning badge
    draw.rounded_rectangle([700, 200, 1080, 270], radius=15, fill=(255, 193, 7))
    draw.text((730, 215), "⚠️ 全国4例目のデパート消滅県", font=f_badge, fill=(33, 37, 41))
    
    draw.text((700, 310), "◆ 2020年 そごう徳島店が閉店", font=f_sub, fill=(50, 60, 80))
    draw.text((700, 370), "◆ 高級ブランド・贈答品難民が発生", font=f_sub, fill=(50, 60, 80))
    draw.text((700, 430), "◆ 県民は高速バスで神戸・難波へ脱出", font=f_sub, fill=(50, 60, 80))
    draw.text((700, 490), "◆ お中元・お歳暮はスーパーか通販", font=f_sub, fill=(180, 40, 40))
    
    base.save(os.path.join(IMG_DIR, "card_scene4_department.jpg"), quality=95)
    print("Saved card_scene4_department.jpg")

gen_scene4_department()

# --- Scene 5: 阿波踊り（狂乱の4日間 vs 残り361日の静寂） ---
def gen_scene5_awaodori():
    base = create_card_base((25, 25, 45), (45, 30, 65))
    draw = ImageDraw.Draw(base)
    
    # Left: 4 Days of Frenzy
    draw.rectangle([80, 80, 610, 640], fill=(40, 30, 60), outline=(240, 100, 120), width=3)
    draw.rounded_rectangle([120, 110, 570, 180], radius=12, fill=(230, 50, 80))
    draw.text((150, 125), "🏮 お盆の4日間：超狂乱！", font=get_font(34, True), fill=(255, 255, 255))
    
    # Festive lanterns
    for lx in [200, 340, 480]:
        draw.ellipse([lx-35, 210, lx+35, 290], fill=(255, 80, 40), outline=(255, 230, 100), width=3)
        draw.text((lx-18, 235), "祭", font=get_font(32, True), fill=(255, 255, 255))
        draw.line([lx, 195, lx, 210], fill=(200, 200, 200), width=2)
    
    draw.text((130, 330), "★ 観光客 100万人以上が殺到！", font=get_font(28, True), fill=(255, 220, 100))
    draw.text((130, 385), "★ ホテル代は普段の3〜5倍に高騰", font=get_font(26, False), fill=(240, 240, 240))
    draw.text((130, 440), "★ 街中でお囃子と「踊る阿呆」の歓声", font=get_font(26, False), fill=(240, 240, 240))
    draw.text((130, 495), "★ 徳島市が1年で一番輝く奇跡の季節", font=get_font(26, False), fill=(255, 180, 180))

    # Right: The remaining 361 days
    draw.rectangle([670, 80, 1200, 640], fill=(25, 35, 45), outline=(100, 140, 180), width=3)
    draw.rounded_rectangle([710, 110, 1160, 180], radius=12, fill=(70, 100, 140))
    draw.text((740, 125), "🌙 残り361日：驚きの静寂", font=get_font(34, True), fill=(255, 255, 255))
    
    # Deserted street illustration
    draw.text((740, 230), "👻 ゴーストタウン並みの人通りの少なさ", font=get_font(28, True), fill=(180, 220, 255))
    draw.text((740, 310), "◆ 8月16日の朝、嘘のように静まる街", font=get_font(26, False), fill=(200, 215, 230))
    draw.text((740, 370), "◆ 駅前通りを歩くのはハトと数人のみ", font=get_font(26, False), fill=(200, 215, 230))
    draw.text((740, 430), "◆ 全てのエネルギーを盆で使い果たす", font=get_font(26, False), fill=(200, 215, 230))
    draw.text((740, 490), "◆ 次の阿波踊りまで361日の冬眠状態", font=get_font(26, False), fill=(150, 190, 255))

    base.save(os.path.join(IMG_DIR, "card_scene5_awaodori.jpg"), quality=95)
    print("Saved card_scene5_awaodori.jpg")

gen_scene5_awaodori()

# --- Scene 6: 関西の植民地？（テレビ電波と明石海峡大橋） ---
def gen_scene6_kansai():
    base = create_card_base((235, 245, 255), (200, 225, 250))
    draw = ImageDraw.Draw(base)
    
    draw.rectangle([80, 80, 1200, 640], fill=(255, 255, 255), outline=(100, 150, 210), width=4)
    # Header
    draw.rounded_rectangle([120, 110, 1160, 180], radius=12, fill=(24, 119, 242))
    draw.text((360, 125), "📺 「実質関西」疑惑の真相！", font=get_font(38, True), fill=(255, 255, 255))
    
    # TV channels comparison
    draw.rectangle([140, 220, 620, 580], fill=(245, 248, 255), outline=(180, 205, 235), width=2)
    draw.text((170, 250), "📡 大阪のTV電波がフル受信！", font=get_font(30, True), fill=(20, 50, 120))
    draw.text((170, 320), "・毎日放送 (MBS)", font=get_font(28, False), fill=(60, 70, 90))
    draw.text((170, 370), "・朝日放送 (ABC)", font=get_font(28, False), fill=(60, 70, 90))
    draw.text((170, 420), "・関西テレビ (KTV)", font=get_font(28, False), fill=(60, 70, 90))
    draw.text((170, 470), "・読売テレビ (ytv)", font=get_font(28, False), fill=(60, 70, 90))
    draw.text((170, 520), "★四国より関西ローカル情報に精通", font=get_font(24, True), fill=(220, 50, 50))

    # Right: Kansai Highway Connection
    draw.rectangle([660, 220, 1140, 580], fill=(255, 250, 245), outline=(240, 200, 170), width=2)
    draw.text((690, 250), "🌉 明石海峡大橋で直結！", font=get_font(30, True), fill=(180, 70, 20))
    draw.text((690, 320), "・神戸三宮まで高速バスで約100分", font=get_font(26, False), fill=(60, 70, 90))
    draw.text((690, 380), "・休日の買い物は三宮か梅田が定番", font=get_font(26, False), fill=(60, 70, 90))
    draw.text((690, 440), "・関西広域連合にも正式参加", font=get_font(26, False), fill=(60, 70, 90))
    draw.text((690, 510), "★心はもはや関西圏のプライド？", font=get_font(26, True), fill=(200, 40, 40))

    base.save(os.path.join(IMG_DIR, "card_scene6_kansai.jpg"), quality=95)
    print("Saved card_scene6_kansai.jpg")

gen_scene6_kansai()

# --- Scene 7: 徳島ラーメン（白ご飯必須・塩分過多警報） ---
def gen_scene7_ramen():
    base = create_card_base((50, 25, 20), (90, 45, 30))
    draw = ImageDraw.Draw(base)
    
    draw.rectangle([80, 80, 1200, 640], fill=(35, 18, 15), outline=(220, 120, 50), width=4)
    # Header
    draw.rounded_rectangle([120, 110, 1160, 180], radius=12, fill=(210, 60, 30))
    draw.text((320, 125), "🍜 徳島ラーメン：おかず系最強の洗礼", font=get_font(36, True), fill=(255, 255, 255))
    
    # Left: Ramen Bowl Graphic representation
    draw.ellipse([180, 230, 580, 550], fill=(160, 40, 25), outline=(240, 210, 140), width=6)
    # Broth
    draw.ellipse([210, 260, 550, 520], fill=(70, 30, 15))
    # Meat & Egg
    draw.rectangle([280, 340, 460, 430], fill=(130, 60, 25), outline=(200, 120, 50), width=2)
    draw.ellipse([340, 360, 420, 440], fill=(255, 180, 20), outline=(255, 255, 255), width=3)
    draw.ellipse([360, 380, 400, 420], fill=(255, 130, 10))
    # Label on bowl
    draw.text((250, 470), "超濃厚 豚骨醤油", font=get_font(28, True), fill=(255, 230, 150))

    # Right: Warning & Rice
    draw.rectangle([630, 220, 1140, 580], fill=(50, 25, 20), outline=(180, 100, 50), width=2)
    draw.rounded_rectangle([660, 245, 1110, 305], radius=10, fill=(230, 40, 40))
    draw.text((710, 258), "⚠️ 白ご飯なしでの注文は厳禁！", font=get_font(28, True), fill=(255, 255, 255))

    draw.text((660, 335), "◆ すき焼き風の甘辛く煮た豚バラ肉", font=get_font(26, False), fill=(255, 240, 220))
    draw.text((660, 395), "◆ 塩分と旨味が極限まで凝縮されたスープ", font=get_font(26, False), fill=(255, 240, 220))
    draw.text((660, 455), "◆ 生卵を絡めてご飯にワンバウンド食い！", font=get_font(26, False), fill=(255, 220, 100))
    draw.text((660, 515), "◆ 単体で飲み干すと喉が渇いて眠れない", font=get_font(26, True), fill=(255, 140, 140))

    base.save(os.path.join(IMG_DIR, "card_scene7_ramen.jpg"), quality=95)
    print("Saved card_scene7_ramen.jpg")

gen_scene7_ramen()

# --- Scene 8: 高級銘菓 小男鹿（自分用には買わない高嶺の花） ---
def gen_scene8_saoshika():
    base = create_card_base((245, 240, 235), (225, 215, 205))
    draw = ImageDraw.Draw(base)
    
    draw.rectangle([80, 80, 1200, 640], fill=(255, 252, 248), outline=(160, 130, 100), width=4)
    # Header
    draw.rounded_rectangle([120, 110, 1160, 180], radius=12, fill=(120, 70, 40))
    draw.text((360, 125), "🦌 徳島の極上銘菓「小男鹿（さおしか）」", font=get_font(36, True), fill=(255, 250, 235))
    
    # Left: Saoshika Box
    draw.rectangle([140, 220, 580, 580], fill=(245, 235, 220), outline=(150, 110, 75), width=3)
    # Box graphic
    draw.rectangle([190, 260, 530, 520], fill=(215, 180, 140), outline=(100, 65, 35), width=4)
    draw.rectangle([210, 280, 510, 360], fill=(250, 245, 235), outline=(140, 100, 60), width=2)
    draw.text((280, 295), "小 男 鹿", font=get_font(42, True), fill=(90, 45, 20))
    draw.text((250, 410), "山芋・小豆・和三盆糖", font=get_font(24, False), fill=(80, 50, 30))
    draw.text((230, 460), "一本 二千円以上〜！", font=get_font(28, True), fill=(180, 30, 30))

    # Right: Secrets
    draw.rectangle([620, 220, 1140, 580], fill=(255, 250, 245), outline=(200, 170, 140), width=2)
    draw.text((650, 250), "✨ 観光客が知らない真実", font=get_font(30, True), fill=(130, 60, 20))
    draw.text((650, 320), "・徳島県民にとって『別格・至高』の菓子", font=get_font(26, False), fill=(60, 50, 40))
    draw.text((650, 380), "・高価すぎて自分のおやつには絶対買わない", font=get_font(26, True), fill=(180, 30, 30))
    draw.text((650, 440), "・もらった時だけ家族総出で正座して食べる", font=get_font(26, False), fill=(60, 50, 40))
    draw.text((650, 500), "・上品な甘みともっちり食感は四国一の絶品", font=get_font(26, False), fill=(60, 50, 40))

    base.save(os.path.join(IMG_DIR, "card_scene8_saoshika.jpg"), quality=95)
    print("Saved card_scene8_saoshika.jpg")

gen_scene8_saoshika()

# --- Scene 9: ごめんなさいの味（ガチ謝罪の最終兵器） ---
def gen_scene9_apology():
    base = create_card_base((250, 240, 240), (230, 210, 215))
    draw = ImageDraw.Draw(base)
    
    draw.rectangle([80, 80, 1200, 640], fill=(255, 255, 255), outline=(200, 80, 100), width=4)
    # Header
    draw.rounded_rectangle([120, 110, 1160, 180], radius=12, fill=(180, 40, 60))
    draw.text((280, 125), "🙇 誠意の最終兵器「ごめんなさいの味」！", font=get_font(36, True), fill=(255, 255, 255))
    
    # Big comic illustration block
    draw.rectangle([140, 220, 600, 580], fill=(255, 245, 248), outline=(220, 130, 150), width=2)
    # Dogeza comic silhouette
    draw.text((200, 280), "／", font=get_font(50, True), fill=(200, 50, 50))
    draw.text((220, 260), "本気の謝罪に", font=get_font(36, True), fill=(180, 30, 30))
    draw.text((180, 320), "小男鹿の菓子折り！", font=get_font(36, True), fill=(180, 30, 30))
    draw.text((380, 280), "＼", font=get_font(50, True), fill=(200, 50, 50))
    draw.rectangle([210, 400, 530, 520], fill=(235, 195, 150), outline=(130, 80, 40), width=4)
    draw.text((240, 440), "【のし紙：深謝】", font=get_font(32, True), fill=(40, 40, 40))

    # Right: The Psychological Effect
    draw.rectangle([640, 220, 1140, 580], fill=(250, 252, 255), outline=(180, 200, 230), width=2)
    draw.text((670, 250), "🤝 徳島県民への絶大な特効薬", font=get_font(30, True), fill=(30, 60, 120))
    draw.text((670, 320), "◆ 『小男鹿を持ってきたのか…』と怒りが融解", font=get_font(26, False), fill=(50, 50, 60))
    draw.text((670, 380), "◆ 菓子折りの重みで真剣な誠意が即座に伝わる", font=get_font(26, False), fill=(50, 50, 60))
    draw.text((670, 440), "◆ 怒っていた相手も思わず笑顔で受け取る", font=get_font(26, False), fill=(50, 50, 60))
    draw.text((670, 505), "★徳島でやらかしたら即座に小男鹿を走って買え！", font=get_font(23, True), fill=(220, 30, 30))

    base.save(os.path.join(IMG_DIR, "card_scene9_apology.jpg"), quality=95)
    print("Saved card_scene9_apology.jpg")

gen_scene9_apology()

# --- Scene 10: まとめ・フィナーレ（徳島市へようこそ！） ---
def gen_scene10_welcome():
    base = create_card_base((235, 250, 245), (200, 235, 225))
    draw = ImageDraw.Draw(base)
    
    draw.rectangle([80, 80, 1200, 640], fill=(255, 255, 255), outline=(50, 160, 120), width=4)
    # Header
    draw.rounded_rectangle([120, 110, 1160, 180], radius=12, fill=(35, 150, 110))
    draw.text((320, 125), "✨ 愛ある自虐の街・徳島市へおいでよ！", font=get_font(36, True), fill=(255, 255, 255))
    
    draw.rectangle([140, 220, 620, 580], fill=(245, 253, 250), outline=(130, 200, 170), width=2)
    draw.text((170, 250), "🌊 水都と自然が織りなす癒やし", font=get_font(30, True), fill=(20, 100, 70))
    draw.text((170, 320), "・新町川ひょうたん島クルーズ船", font=get_font(26, False), fill=(50, 60, 55))
    draw.text((170, 380), "・眉山山頂から広がるパノラマ絶景", font=get_font(26, False), fill=(50, 60, 55))
    draw.text((170, 440), "・爽やかな特産すだちと新鮮な海の幸", font=get_font(26, False), fill=(50, 60, 55))
    draw.text((170, 505), "★のんびり汽車旅に最高のロケーション", font=get_font(25, True), fill=(25, 130, 90))

    draw.rectangle([660, 220, 1140, 580], fill=(255, 250, 245), outline=(230, 180, 140), width=2)
    draw.text((690, 250), "🍜 胃袋と心をつかむ体験！", font=get_font(30, True), fill=(160, 70, 20))
    draw.text((690, 320), "・一度食べたら忘れられない濃厚ラーメン", font=get_font(26, False), fill=(60, 50, 45))
    draw.text((690, 380), "・お祝いにも謝罪にも効く極上の小男鹿", font=get_font(26, False), fill=(60, 50, 45))
    draw.text((690, 440), "・温かい地元民の笑顔とおもてなし", font=get_font(26, False), fill=(60, 50, 45))
    draw.text((690, 505), "★ぜひ徳島市に遊びに来てほしいのだ！", font=get_font(25, True), fill=(210, 40, 40))

    base.save(os.path.join(IMG_DIR, "card_scene10_welcome.jpg"), quality=95)
    print("Saved card_scene10_welcome.jpg")

gen_scene10_welcome()

print("All illustration cards generated successfully!")
