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

## Critical Layout Constraints (Strict Separation)
- Top Area (y: 8~60px): Header bar with independent gold-framed top-right telop (`#ffd54f`, 20px).
- Center Area (y: 70~680px, width: 860px): Balanced centered layout with category badge (16px), headline (38px), illustration (height: 385px), and 3 bullet points (24px with ❶❷❸ badges).
- Left/Right Margins (x: 40px / x: 1450px): Zundamon on left, Metan on right with lip-sync and speech badges.
- Bottom Area (y: 930~1040px): Subtitle bar with speaker tags (32~34px), at least 150px safety gap below center card.

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

