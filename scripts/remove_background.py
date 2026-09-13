import os
import sys
from PIL import Image
import numpy as np
from collections import deque

def transparent_outside_white(img_path, out_path, tolerance=30):
    img = Image.open(img_path).convert("RGBA")
    arr = np.array(img)
    h, w, _ = arr.shape

    visited = np.zeros((h, w), dtype=bool)
    is_bg = np.zeros((h, w), dtype=bool)

    rgb = arr[:, :, :3].astype(np.int32)
    diff_from_white = np.max(255 - rgb, axis=2)
    color_std = np.std(rgb, axis=2)
    white_mask = (diff_from_white <= tolerance) & (color_std <= 15)

    queue = deque()
    for x in range(w):
        if white_mask[0, x] and not visited[0, x]:
            queue.append((0, x))
            visited[0, x] = True
        if white_mask[h - 1, x] and not visited[h - 1, x]:
            queue.append((h - 1, x))
            visited[h - 1, x] = True
    for y in range(h):
        if white_mask[y, 0] and not visited[y, 0]:
            queue.append((y, 0))
            visited[y, 0] = True
        if white_mask[y, w - 1] and not visited[y, w - 1]:
            queue.append((y, w - 1))
            visited[y, w - 1] = True

    while queue:
        cy, cx = queue.popleft()
        is_bg[cy, cx] = True
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                visited[ny, nx] = True
                if white_mask[ny, nx]:
                    queue.append((ny, nx))

    arr[is_bg, 3] = 0

    out_img = Image.fromarray(arr)
    out_img.save(out_path, "PNG")
    print(f"Saved: {out_path}")

if __name__ == "__main__":
    os.makedirs("/Users/daisuke/Desktop/ずんだもんテスト/public/characters", exist_ok=True)
    targets = [
        ("/Users/daisuke/.gemini/antigravity-ide/brain/a8b9392d-8ca3-4298-8452-c08499d0b052/zunda_greeting_1789248130863.jpg", "/Users/daisuke/Desktop/ずんだもんテスト/public/characters/zunda_greeting.png"),
        ("/Users/daisuke/.gemini/antigravity-ide/brain/a8b9392d-8ca3-4298-8452-c08499d0b052/zunda_explain_1789248152912.jpg", "/Users/daisuke/Desktop/ずんだもんテスト/public/characters/zunda_explain.png"),
        ("/Users/daisuke/.gemini/antigravity-ide/brain/a8b9392d-8ca3-4298-8452-c08499d0b052/zunda_proud_1789248169329.jpg", "/Users/daisuke/Desktop/ずんだもんテスト/public/characters/zunda_proud.png"),
    ]
    for src, dst in targets:
        transparent_outside_white(src, dst, tolerance=30)
