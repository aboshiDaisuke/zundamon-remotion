# どのAI・どのOS・どのエディタでも使える動画制作 共通指示プロンプト集

本ドキュメントは、**Claude / ChatGPT / Codex / Antigravity / Cursor / VSCode** など、使用するAIアシスタントやエディタ、OS（macOS / Windows）を問わず、同じ品質でずんだもん動画を制作・更新するためのポータブルな指示書（プロンプト集）です。

---

## 0. ゼロからの超簡単導入 ＆ 立ち絵の自動化

### ① VOICEVOXの導入（所要1分）
1. [VOICEVOX公式サイト](https://voicevox.hiroshiba.jp/)から無料アプリをダウンロード・起動（Mac / Windows両対応）。
2. ポート `50021` でAPIが自動待機するため、アプリを開いておくだけでAIが自動連携・音声合成を行います。

### ② Remotionの導入（所要2分）
1. Node.js（v18以上）が入ったPCで `npm install` を実行。
2. 動画の書き出しは `npm run render` を実行するだけ！

### ③ 立ち絵PSDの放り込み ＆ リップシンク自動化
- 坂本アヒル様の「ずんだもん立ち絵素材.psd」「四国めたん立ち絵素材.psd」を**プロジェクトルートにそのまま置くだけでOK**！
- 面倒なパーツ切り抜き作業は一切不要。スクリプトが目・口・眉・身体レイヤーを自動抽出します。
- 音声波形に合わせた**自動口パク（リップシンク）**、自然な**目パチ（まばたき）**、セリフ開始時の**ピョコッとバウンド**、感情に合わせた**表情切り替え**がすべて完全自動で連動します。

---

## 1. AIへの前提プロンプト（コピペ用）

新しいチャットや別エディタでAIに動画制作を依頼する際は、以下のプロンプトをそのまま貼り付けてください。

```markdown
あなたは「Remotion」と「VOICEVOX」を用いたキャラクター解説動画の専門エンジニアです。
このリポジトリのルールに従い、ずんだもんと四国めたんの動画を制作・更新してください。

### 【前提と自動化機能】
- VOICEVOX（ポート50021）およびRemotion（React 18）を使用。
- 立ち絵素材はPSDファイルをルート直下に置くだけでOK。自動でパーツ抽出され、音声連動リップシンク（口パク）・目パチ・バウンド演出が動作する。

### 【厳守ルール】
1. OS非依存コマンド:
   - 音声合成: `npm run audio:dual`
   - 静止画確認: `npm run still`
   - 本編レンダリング: `npm run render`
   - 不要ファイル整理: `npm run clean`
2. 画面レイアウト（被りゼロ）:
   - 最上部: 独立した金枠コーナーテロップ（20px けいフォント）
   - 中央部: 大見出し（38px けいフォント）＋画像（高さ385px）＋解説文（24px けいフォント、丸型ナンバリング❶❷❸）
   - 左右: ずんだもん（左）と四国めたん（右）
   - 最下部: 字幕バー（33px けいフォント、中央カードから150px以上余白）
3. けいフォント完全適用:
   - ヘッドレスChromiumでの遅延を防ぐため、`useEnsureKeiFont()` でロード待機を必須とする。
4. 台本設計:
   - 提供されたネタは1台詞で終わらせず、ずんだもんと四国めたんの3〜5往復のテンポ良い掛け合いコントとして深掘りする。
5. 成果物整理:
   - 書き出し後は `out/` 内を最新動画1本にクリーンアップする。
```

---

## 2. 各エディタ・AI別の自動適用設定一覧

本リポジトリには、各種AIツールが自動的にルールを読み込む設定ファイルがすべて整備されています。

| エディタ / AIツール | 自動読み込みファイル | 説明 |
|---|---|---|
| **Claude Code (Anthropic)** | [CLAUDE.md](file:///Users/daisuke/Desktop/ずんだもんテスト/CLAUDE.md) | プロジェクト開始時にClaudeが自動読み込み |
| **Cursor / Windsurf** | [.cursorrules](file:///Users/daisuke/Desktop/ずんだもんテスト/.cursorrules) | チャットおよびインライン編集時に常時適用 |
| **GitHub Copilot / Codex (VSCode)** | [.github/copilot-instructions.md](file:///Users/daisuke/Desktop/ずんだもんテスト/.github/copilot-instructions.md) | Copilot Chatおよびコード補完時に自動参照 |
| **Antigravity / Gemini** | [AGENTS.md](file:///Users/daisuke/Desktop/ずんだもんテスト/AGENTS.md) / [GEMINI.md](file:///Users/daisuke/Desktop/ずんだもんテスト/GEMINI.md) | ワークスペース全域で常時適用 |
| **Antigravity スキル** | [.agents/skills/remotion-video-workflow](file:///Users/daisuke/Desktop/ずんだもんテスト/.agents/skills/remotion-video-workflow/SKILL.md) | オンデマンドで呼び出せるランブック |

---

## 3. macOS / Windows 互換性ガイド

### パス区切り文字
- TypeScript / Remotion コード内、および JSON ファイル内では、常にスラッシュ `/`（POSIX形式）を使用してください。WindowsのNode.js環境でも正常に認識されます。

### Python コマンドの差分吸収
- macOSでは `python3`、Windowsでは `python` とコマンド名が異なる場合がありますが、本リポジトリでは `scripts/run_python.js` を内蔵しているため、`npm run audio:dual` を実行するだけで両OSで自動判別されて実行されます。

### 成果物の削除コマンド
- Windowsには `find -delete` がありませんが、`npm run clean`（`scripts/clean_out.js`）を実行することで、OSに関わらず `out/zundamon_metan.mp4` 以外を安全に削除できます。

---

## 4. 必須素材・クレジット規約

動画を公開する際は、以下のクレジット表記を行ってください。

- `VOICEVOX:ずんだもん` / `VOICEVOX:四国めたん`
- `立ち絵素材: 坂本アヒル様`
- `フォント: けいフォント`
- `背景: みんちりえ`
- `BGM: しゃろう「2:23 AM」`
