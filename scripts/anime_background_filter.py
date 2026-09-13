import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import os

def to_anime_art(src_path, out_path, brightness_boost=1.15, saturation_boost=1.5):
    img = cv2.imread(src_path)
    if img is None:
        print("Failed to read", src_path)
        return
    h, w = img.shape[:2]
    # Crop to 16:9
    target_ratio = 16.0 / 9.0
    current_ratio = w / h
    if current_ratio > target_ratio:
        new_w = int(h * target_ratio)
        start_x = (w - new_w) // 2
        img = img[:, start_x:start_x+new_w]
    else:
        new_h = int(w / target_ratio)
        start_y = (h - new_h) // 2
        img = img[start_y:start_y+new_h, :]
    img = cv2.resize(img, (1280, 720), interpolation=cv2.INTER_LANCZOS4)

    # 1. Edge-preserving smoothing for painterly feel
    smooth = cv2.edgePreservingFilter(img, flags=2, sigma_s=50, sigma_r=0.4)
    smooth = cv2.bilateralFilter(smooth, d=7, sigmaColor=60, sigmaSpace=60)

    # 2. Soft pastel line art (not harsh black)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    inv = 255 - gray
    inv_blur = cv2.GaussianBlur(inv, (15, 15), 0)
    sketch = cv2.divide(gray, 255 - inv_blur, scale=256)
    sketch_bgr = cv2.cvtColor(sketch, cv2.COLOR_GRAY2BGR)

    # 3. Soft blend line art with smoothed color (Screen/Multiply balance)
    base = cv2.multiply(smooth.astype(np.float32)/255.0, (sketch_bgr.astype(np.float32)/255.0 * 0.4 + 0.6))
    base = np.clip(base * 255.0, 0, 255).astype(np.uint8)

    # 4. Color adjustments with PIL
    pil_im = Image.fromarray(cv2.cvtColor(base, cv2.COLOR_BGR2RGB))
    
    # Brightness & Contrast
    b_enh = ImageEnhance.Brightness(pil_im)
    pil_im = b_enh.enhance(brightness_boost)
    
    c_enh = ImageEnhance.Contrast(pil_im)
    pil_im = c_enh.enhance(1.15)
    
    s_enh = ImageEnhance.Color(pil_im)
    pil_im = s_enh.enhance(saturation_boost)

    # 5. Soft Bloom Glow (Anime Dreamy Light)
    bloom = pil_im.filter(ImageFilter.GaussianBlur(radius=8))
    bloom_enh = ImageEnhance.Brightness(bloom).enhance(1.2)
    pil_im = Image.blend(pil_im, bloom_enh, 0.25)

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    pil_im.save(out_path, quality=95)
    print("Generated anime art:", out_path)

to_anime_art("public/images/raw/Awa-odori_2008_Tokushima.jpg", "public/images/anime/art_scene5_awaodori.jpg", 1.2, 1.6)
to_anime_art("public/images/raw/scene5_tokushima_ramen.jpg", "public/images/anime/art_scene7_ramen.jpg", 1.25, 1.5)
to_anime_art("public/images/raw/saoshika.jpg", "public/images/anime/art_scene8_saoshika.jpg", 1.15, 1.4)
to_anime_art("public/images/raw/Shinmachi_River_20210214.jpg", "public/images/anime/art_scene10_river.jpg", 1.2, 1.5)
