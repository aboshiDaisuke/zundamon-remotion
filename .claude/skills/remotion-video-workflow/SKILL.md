---
name: remotion-video-workflow
description: >-
  ずんだもん・四国めたんのRemotion解説動画を作る・直すときに使う。台本の追加、VOICEVOX音声合成、中央カード用イラストの生成・差し替え、セーフゾーン基準のレイアウト調整、エンディング演出、静止画チェック、レンダリング、out/の整理まで。ユーザーが「動画作って」「ネタ追加して」「画像作り直して」「レイアウト直して」「レンダリングして」等と言ったら使う。
---

# Remotion キャラクター解説動画 制作ワークフロー（Claude Code 入口）

手順の本体は他のAIツールと共通の1ファイルにまとめてある。**最初に必ず読み、そのとおりに進めること。**

- 本体: `.agents/skills/remotion-video-workflow/SKILL.md`
- 座標の正: `src/layout.ts`（セーフゾーン: 文字は x 96〜1824 / y 54〜1026、キャラは x 67〜1853）
- ルール: `CLAUDE.md` の「4. 厳格なレイアウト＆デザイン原則」

作業の締めくくり:
1. 代表フレームとエンディングを `npx remotion still` で書き出して目で確認する
2. `npm run render` で全編を書き出す
3. `npm run clean` で `out/` を最新の `zundamon_metan.mp4` だけにする
