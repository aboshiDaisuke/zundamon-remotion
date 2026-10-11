/** Replace the website's local sample with the completed full render. No publishing. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const data = require('../src/dual_scene_data.json');
const rendered = path.join(root, 'out/zundamon_metan.mp4');
const destination = path.join(root, 'website/assets/zundamon_metan.mp4');
if (!fs.existsSync(rendered)) throw new Error('先に npm run render を実行してください。');
if (fs.statSync(rendered).mtimeMs < fs.statSync(path.join(root, 'src/dual_scene_data.json')).mtimeMs) {
  throw new Error('台本更新後の動画が未出力です。npm run sample を実行してください。');
}
const hash = crypto.createHash('sha256').update(fs.readFileSync(rendered)).digest('hex').slice(0, 12);
const escape = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const seen = new Set();
const chapters = data.scenes.filter(scene => {
  if (seen.has(scene.topic_num)) return false;
  seen.add(scene.topic_num); return true;
}).map(scene => ({ time: scene.startFrame / data.fps, title: scene.topic }));
chapters.push({ time: data.totalFrames / data.fps, title: 'エンディング' });
const format = time => `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}`;
const htmlPath = path.join(root, 'website/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace(/assets\/zundamon_metan\.mp4\?v=[^"\s]+/g, `assets/zundamon_metan.mp4?v=${hash}`)
  .replace(/poster="[^"]+"/, `poster="assets/video-poster.jpg?v=${hash}"`)
  .replace(/(<div class="chapter-buttons">)[\s\S]*?(\n          <\/div>)/,
    `$1\n${chapters.map((c, i) => `            <button class="ch-btn${i === 0 ? ' active' : ''}" data-time="${c.time}">${format(c.time)} ${escape(c.title)}</button>`).join('\n')}$2`);
const jsPath = path.join(root, 'website/app.js');
const js = fs.readFileSync(jsPath, 'utf8').replace(/const CHAPTERS = \[[\s\S]*?\];/,
  `const CHAPTERS = ${JSON.stringify(chapters, null, 2)};`);
fs.copyFileSync(rendered, destination + '.tmp');
fs.renameSync(destination + '.tmp', destination);
fs.copyFileSync(path.join(root, 'docs/layout-preview.jpg'), path.join(root, 'website/assets/video-poster.jpg'));
fs.writeFileSync(htmlPath, html);
fs.writeFileSync(jsPath, js);
console.log(`紹介ページの動画・ポスター・${chapters.length}チャプターを更新しました (${hash})。`);
