# GitHub Copilot / Codex Instructions: Remotion Zundamon Video Studio

## Project Overview
This repository builds high-production explainer/dialogue videos featuring Zundamon (ずんだもん) and Shikoku Metan (四国めたん) using Remotion (React 18 + TypeScript) and VOICEVOX.
It is fully cross-platform (macOS and Windows).

## Quick Setup & PSD Automation
1. **VOICEVOX**: Free desktop app on port `50021`. Start the app to enable local text-to-speech API.
2. **Remotion**: Run `npm install` and `npm run render`.
3. **PSD Drag-and-Drop OK**: Raw standing art `.psd` files (e.g. `ずんだもん立ち絵素材.psd`, `四国めたん立ち絵素材.psd` by Sakamoto Ahiru) can be dropped directly into the project root. No manual image slicing needed. Eye, mouth, brow, and body layers are parsed automatically.
4. **Auto Lip-Sync & Animations**: Lip-sync is automatically keyed to the synthesized audio volume and timing. Natural eye-blinking and speaker bouncy jumps work out-of-the-box.

## Cross-Platform Standard Commands
- Voice Synthesis & Metadata Auto-Sync: `npm run audio:dual`
- Still Image Self-Verification: `npm run still`
- Full Video Render: `npm run render`
- Clean Intermediate Outputs: `npm run clean`
- Local Preview: `npm start`

## Core Layout Architecture (Safe Zones, Zero Overlap)
The single source of truth for coordinates is `src/layout.ts`; never hard-code positions in components.
1. Safe zones (1920x1080): all text stays inside title safe (x 96-1824 / y 54-1026); characters stay inside action safe (x 67-1853).
2. Header (y 54-118): program title telop on the left (two lines, 15px / 30px KeiFont, deep green left bar); independent gold-framed (`#ffd54f`) deep green corner telop on the right (30px KeiFont). Never compress subtitles inside the center card.
3. Center card (y 150-760, width 860px): one white card with category badge (16px), title (38px KeiFont), illustration (860x385, full bleed), 3 key points (24px KeiFont with ❶❷❸ badges and a deep green bar). Do not replay the entrance animation while the same `topic_num` continues.
4. Characters (Zundamon x 70-520 / Metan x 1400-1850, feet end at y 900): one small hop when a line starts, no constant bobbing, no name plates above heads (the subtitle speaker tag names the speaker).
5. Subtitle bar (y 910-1020, width 1380px): 33px KeiFont with a speaker tag, at least 150px below the center card.
6. Background: blurred Minchirie art with a light veil only; no bokeh, waves or dot patterns.

## Card Illustrations
- Save as `public/images/cards/topicNN_<subject>.jpg` at 1720x770 (2.23:1).
- One consistent style for every topic: bright TV-anime background art. No text, logos or numbers, and no characters (they already stand on both sides).
- When replacing, update `image` in both `scripts/generate_dual_audio.py` (`SCENES`) and `src/dual_scene_data.json`. See the "カードイラストの作り方" section of `.agents/skills/remotion-video-workflow/SKILL.md`.

## Ending
- Always end with `src/components/DualOutro.tsx` (~6.7s: characters + confetti -> "ご視聴ありがとうございました！" -> credits -> iris-out -> "おしまい"). `src/Root.tsx` sets the duration to `totalFrames + OUTRO_FRAMES`.

## KeiFont Synchronization Rule
Always ensure `useEnsureKeiFont()` from `src/load-font.ts` is called so Chromium delays rendering until `keifont` is 100% loaded. Never allow Hiragino / Meiryo fallback.

## Script & Dialogue Expansion Rule
When adding or expanding topics, always write a multi-turn comedic dialogue (3-5 turns) between Zundamon and Metan rather than a single monologue line.

## Required Assets & Credits
- Speech: VOICEVOX:ずんだもん / VOICEVOX:四国めたん
- Character Art: 坂本アヒル様
- Font: けいフォント (フォントな / MODI工場様)
- Backgrounds: みんちりえ様
- BGM: しゃろう様「2:23 AM」

## Character Customization & Safe Material Sourcing
- Drop materials (PSD, images, audio) into the project and prompt the AI with what you want to create!
- Freely switch characters and voices by specifying other VOICEVOX speaker IDs or dropping new character `.psd` files.
- When prompted to find free assets (backgrounds/BGM), guide users to reputable commercial-free sources (Minchirie, DOVA-SYNDROME, Irasutoya).
- Strictly avoid excessive web scraping to protect upstream servers and comply with service terms.
- **In-Editor AI Image Generation**: If running in an image-generation capable environment, directly generate explainer images or background art inside the workspace and place them automatically into Remotion.

