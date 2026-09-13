# ずんだもん × バイブコーディング動画制作キット

> **動画編集は不要。人間はつぶやくだけなのだ！**  
> Remotion（React/TypeScript）とVOICEVOXを組み合わせた、新時代のバイブコーディング解説動画制作スターターキット。

🌐 **公開Webサイト（GitHub Pages）**:  
[https://aboshidaisuke.github.io/zundamon-remotion/](https://aboshidaisuke.github.io/zundamon-remotion/)

---

## ⚡ バイブコーディングの超簡単な始め方

1. **プロンプトをAI（Claude / Cursor / ChatGPT / Copilot）にコピペする**  
   リポジトリ内の `CLAUDE.md` や `.cursorrules`、またはWebサイト上のプロンプトをAIに渡します。
2. **思いついたネタを雑につぶやく**  
   「徳島のイオンモールの駐車場に神戸ナンバーが大量にいて、淡路島の玉ねぎ畑のくせにオシャレぶっててコンプレックス持ってるやつ作って」
3. **プレビューを見て感覚でダメ出し**  
   「文字被ってるよ」「フォントをけいフォントにして」「短いからもっと増やして」➔ これだけでAIが全自動で動画を仕上げます！

---

## 🚀 実行コマンド（macOS / Windows 共通）

```bash
# 依存関係のインストール
npm install

# 音声合成 ＆ 尺（フレーム数）の自動同期
npm run audio:dual

# 静止画プレビュー（レンダリング前の文字被り・表情チェック）
npm run still

# フルHD動画の本編レンダリング
npm run render

# 成果物フォルダの掃除（最新動画1本に整理）
npm run clean

# 解説Webサイトのローカル起動
npm run serve:web
```

---

## 📁 主要ファイル構成

- `CLAUDE.md`: Claude Code 用マスター指示ルール
- `.cursorrules`: Cursor / Windsurf 用常時適用ルール
- `.github/copilot-instructions.md`: VSCode / GitHub Copilot 用指示書
- `AGENTS.md` / `GEMINI.md`: Antigravity / Gemini 用ワークスペースルール
- `website/`: 公式バイブコーディング解説Webサイト（GitHub Pages で公開）
- `scripts/`: クロスプラットフォーム実行スクリプト（Python / Node.js）
- `src/`: Remotion 動画合成コード（React 18 + TypeScript）

---

## 📜 クレジット表記規約

本プロジェクトで制作された動画を公開する際は、以下のクレジットを明記してください。

- **音声合成**: `VOICEVOX:ずんだもん` / `VOICEVOX:四国めたん` （ヒロシバ様）
- **立ち絵素材**: `坂本アヒル様`
- **フォント**: `けいフォント` （フォントな / MODI工場様）
- **背景イラスト**: `みんちりえ` （https://minchirie.info/）
- **BGM**: `しゃろう「2:23 AM」`
