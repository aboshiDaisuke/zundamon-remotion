/** Render every dialogue plus outro once; reuse one bundle and browser. */
const { bundle } = require('@remotion/bundler');
const { openBrowser, selectComposition, renderStill } = require('@remotion/renderer');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const data = require('../src/dual_scene_data.json');
const escape = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
async function main() {
  const output = path.join(root, 'out/review');
  fs.mkdirSync(output, { recursive: true });
  const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
  const browser = await openBrowser('chrome');
  try {
    const composition = await selectComposition({ serveUrl, id: 'DualExplainer', puppeteerInstance: browser });
    const shots = data.scenes.map(s => ({ frame: s.startFrame + Math.min(45, s.durationInFrames - 1),
      label: `${s.topic_num}. ${s.topic} / ${s.speaker_name}`, file: `${s.id}.png` }));
    shots.push({ frame: data.totalFrames + 90, label: 'エンディング・クレジット', file: 'outro.png' },
      { frame: data.totalFrames + 185, label: 'おしまい', file: 'end.png' });
    for (const shot of shots) {
      await renderStill({ serveUrl, composition, frame: shot.frame, output: path.join(output, shot.file),
        imageFormat: 'png', puppeteerInstance: browser });
      console.log(`画面確認: ${shot.label}`);
    }
    fs.writeFileSync(path.join(output, 'index.html'), `<!doctype html><html lang="ja"><meta charset="utf-8">
<title>動画のレイアウト確認</title><style>body{margin:32px;background:#f2f5ef;color:#234934;font:16px system-ui}h1{font-size:24px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(480px,1fr));gap:24px}figure{margin:0}img{width:100%;border-radius:12px}figcaption{padding:10px}a{color:inherit}</style>
<h1>${escape(data.program.title)} — 全シーンの静止画確認</h1><p>静止画プレビューです。全編動画: <a href="../zundamon_metan.mp4">zundamon_metan.mp4</a>。字幕の全文・話者交代はStudioで確認してください。</p><main>
${shots.map(s => `<figure><a href="${s.file}"><img src="${s.file}" alt="${escape(s.label)}"></a><figcaption>${escape(s.label)} · frame ${s.frame}</figcaption></figure>`).join('\n')}</main></html>`);
    console.log('確認用一覧: out/review/index.html');
  } finally { await browser.close({ silent: true }); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
