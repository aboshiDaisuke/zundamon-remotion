import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import os

def render_anime_art(img_path, out_path):
    img = cv2.imread(img_path)
    if img is None:
        print("Failed to read", img_path)
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

    # 1. Stylized smoothing (Bilateral / Edge-preserving)
    smooth = cv2.edgePreservingFilter(img, flags=1, sigma_s=60, sigma_r=0.45)
    for _ in range(2):
        smooth = cv2.bilateralFilter(smooth, d=9, sigmaColor=80, sigmaSpace=80)
    
    # 2. Pencil / Ink outline extraction
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    inv_gray = 255 - gray
    blurred_inv = cv2.GaussianBlur(inv_gray, (21, 21), 0)
    sketch = cv2.divide(gray, 255 - blurred_inv, scale=256)
    
    # Adaptive threshold for clean comic lines
    edges = cv2.adaptiveThreshold(sketch, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 9, 4)
    edges_bgr = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)

    # 3. K-means Color Quantization (Cel-shading / Anime flat colors)
    data = smooth.reshape((-1, 3)).astype(np.float32)
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 15, 1.0)
    K = 18  # 18 distinct anime color tones
    _, labels, centers = cv2.kmeans(data, K, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    quantized = centers[labels.flatten()].reshape(smooth.shape).astype(np.uint8)

    # 4. Blend Quantized color with Edges (Soft Multiply)
    anime = cv2.multiply(quantized.astype(np.float32)/255.0, edges_bgr.astype(np.float32)/255.0)
    anime = (anime * 255.0).astype(np.uint8)

    # 5. Convert to PIL for Anime Vibrancy, Warmth, and Soft Glow
    pil_im = Image.fromarray(cv2.cvtColor(anime, cv2.COLOR_BGR2RGB))
    
    # Warm tone tint
    tint = Image.new("RGB", pil_im.size, (255, 245, 230))
    pil_im = Image.blend(pil_im, tint, 0.08)

    # Color boost
    enhancer = ImageEnhance.Color(pil_im)
    pil_im = enhancer.enhance(1.35)
    contrast = ImageEnhance.Contrast(pil_im)
    pil_im = contrast.enhance(1.15)
    sharp = ImageEnhance.Sharpness(pil_im)
    pil_im = sharp.enhance(1.1)

    pil_im.save(out_path, quality=95)
    print("Saved artistic anime:", out_path)

os.makedirs("public/images/anime", exist_ok=True)
render_anime_art("public/images/raw/Awa-odori_2008_Tokushima.jpg", "public/images/anime/illust_awaodori.jpg")
render_anime_art("public/images/raw/scene5_tokushima_ramen.jpg", "public/images/anime/illust_ramen.jpg")
render_anime_art("public/images/raw/saoshika.jpg", "public/images/anime/illust_saoshika.jpg")
render_anime_art("public/images/raw/Shinmachi_River_20210214.jpg", "public/images/anime/illust_river.jpg")
render_anime_art("public/images/raw/Tokushima_City_View_from_the_Top_of_Bizan_20200405.jpg", "public/images/anime/illust_bizan.jpg")
