import os
import sys
import hashlib
import urllib.request
import cv2
import numpy as np

OUTPUT_DIR = "public/images"
os.makedirs(OUTPUT_DIR, exist_ok=True)
RAW_DIR = "public/images/raw"
os.makedirs(RAW_DIR, exist_ok=True)

# Wikimedia Commons 1280px サムネイル対応画像
IMAGES = {
    "scene1_view": "Tokushima City View from the Top of Bizan 20200405.jpg",
    "scene2_cruise": "Shinmachi River 20210214.jpg",
    "scene3_awaodori": "Awa-odori 2008 Tokushima.jpg",
    "scene4_bizan": "Mount Bizan from Shimmachi River 20200607.jpg",
    "scene5_ramen": "Tokushima Ramen Men-Oh ac.jpg",
    "scene5_sudachi": "Sudachi.jpg",
    "scene6_castle": "Washi-no-mon.jpg",
    "scene7_central_park": "Tokushima Central park.JPG",
}

def download_thumbnail(orig_name, width=1280):
    clean = orig_name.replace(' ', '_')
    m = hashlib.md5(clean.encode('utf-8')).hexdigest()
    url = f"https://upload.wikimedia.org/wikipedia/commons/thumb/{m[0]}/{m[:2]}/{clean}/{width}px-{clean}"
    raw_path = os.path.join(RAW_DIR, clean)
    
    if os.path.exists(raw_path) and os.path.getsize(raw_path) > 1000:
        print(f"Already downloaded: {clean}")
        return raw_path

    print(f"Downloading {clean} ({width}px) ...")
    req = urllib.request.Request(url, headers={'User-Agent': 'TokushimaPRBot/1.0 (contact@tokushima-pr.org)'})
    with urllib.request.urlopen(req) as resp:
        with open(raw_path, 'wb') as f:
            f.write(resp.read())
    return raw_path

def anime_style_transform(img_bgr, target_w=960, target_h=540):
    """
    実写写真をずんだもんの世界観に合わせたアニメ背景美術調イラストへ変換
    """
    h, w = img_bgr.shape[:2]
    target_aspect = target_w / target_h
    current_aspect = w / h

    if current_aspect > target_aspect:
        new_w = int(h * target_aspect)
        start_x = (w - new_w) // 2
        cropped = img_bgr[:, start_x:start_x + new_w]
    else:
        new_h = int(w / target_aspect)
        start_y = (h - new_h) // 2
        cropped = img_bgr[start_y:start_y + new_h, :]

    resized = cv2.resize(cropped, (target_w, target_h), interpolation=cv2.INTER_AREA)

    # 1. バイラテラルフィルタ（セル画のような滑らかな面塗り）
    color = resized.copy()
    for _ in range(4):
        color = cv2.bilateralFilter(color, d=9, sigmaColor=70, sigmaSpace=70)

    # 2. エッジ検出（アニメのペン画風の繊細な輪郭線）
    gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
    gray_blur = cv2.medianBlur(gray, 7)
    edges = cv2.adaptiveThreshold(
        gray_blur, 255,
        cv2.ADAPTIVE_THRESH_MEAN_C,
        cv2.THRESH_BINARY,
        blockSize=9,
        C=3
    )
    edges = cv2.medianBlur(edges, 3)

    # 3. 色彩強調（鮮やかで明るいアニメ背景美術トーン）
    hsv = cv2.cvtColor(color, cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[:, :, 1] = np.clip(hsv[:, :, 1] * 1.35, 0, 255)       # 彩度アップ
    hsv[:, :, 2] = np.clip(hsv[:, :, 2] * 1.15 + 12, 0, 255)  # 明度アップ
    enhanced_bgr = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)

    # 4. エッジ輪郭線との合成
    edge_mask = edges.astype(np.float32) / 255.0
    edge_mask = np.clip(edge_mask + 0.18, 0, 1.0)
    edge_mask_3ch = np.dstack([edge_mask] * 3)
    anime_art = (enhanced_bgr.astype(np.float32) * edge_mask_3ch).astype(np.uint8)

    # 5. ソフトブルーム（柔らかな拡散光と空気感）
    bloom = cv2.GaussianBlur(anime_art, (0, 0), sigmaX=8, sigmaY=8)
    anime_art_float = anime_art.astype(np.float32) / 255.0
    bloom_float = bloom.astype(np.float32) / 255.0
    screen_blended = 1.0 - (1.0 - anime_art_float) * (1.0 - bloom_float * 0.30)
    final_art = np.clip(screen_blended * 255.0, 0, 255).astype(np.uint8)

    return final_art

def create_food_collage(ramen_bgr, sudachi_bgr, target_w=960, target_h=540):
    """
    徳島ラーメンとすだちのコラージュイラスト
    """
    ramen_w = int(target_w * 0.62)
    sudachi_w = target_w - ramen_w

    ramen_art = anime_style_transform(ramen_bgr, target_w=ramen_w, target_h=target_h)
    sudachi_art = anime_style_transform(sudachi_bgr, target_w=sudachi_w, target_h=target_h)

    collage = np.zeros((target_h, target_w, 3), dtype=np.uint8)
    collage[:, :ramen_w] = ramen_art
    collage[:, ramen_w:] = sudachi_art

    # 境界のスタイリッシュな白い仕切り線
    cv2.line(collage, (ramen_w, 0), (ramen_w, target_h), (255, 255, 255), 4)
    return collage

def main():
    downloaded = {}
    for key, filename in IMAGES.items():
        try:
            path = download_thumbnail(filename, width=1280)
            downloaded[key] = path
        except Exception as e:
            print(f"Error for {key} ({filename}): {e}")

    # 各シーン用のアニメ調アート出力
    outputs = {
        "art_scene1_view.png": "scene1_view",
        "art_scene2_cruise.png": "scene2_cruise",
        "art_scene3_awaodori.png": "scene3_awaodori",
        "art_scene4_bizan.png": "scene4_bizan",
        "art_scene6_castle.png": "scene6_castle",
        "art_scene7_park.png": "scene7_central_park",
    }

    for out_name, key in outputs.items():
        if key in downloaded:
            img = cv2.imread(downloaded[key])
            if img is not None:
                art = anime_style_transform(img)
                out_path = os.path.join(OUTPUT_DIR, out_name)
                cv2.imwrite(out_path, art)
                print(f"Created: {out_path}")

    # シーン5（グルメコラージュ）
    if "scene5_ramen" in downloaded and "scene5_sudachi" in downloaded:
        ramen = cv2.imread(downloaded["scene5_ramen"])
        sudachi = cv2.imread(downloaded["scene5_sudachi"])
        if ramen is not None and sudachi is not None:
            collage = create_food_collage(ramen, sudachi)
            out_path = os.path.join(OUTPUT_DIR, "art_scene5_gourmet.png")
            cv2.imwrite(out_path, collage)
            print(f"Created: {out_path}")

    print("All anime art generated successfully!")

if __name__ == "__main__":
    main()
