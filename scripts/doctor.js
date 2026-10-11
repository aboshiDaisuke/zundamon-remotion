const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
let failed = false;
const report = (ok, text) => { console.log(`${ok ? 'OK' : '要確認'}  ${text}`); if (!ok) failed = true; };
report(Number(process.versions.node.split('.')[0]) >= 18, `Node.js ${process.versions.node}`);
for (const module of ['remotion', '@remotion/renderer', 'typescript']) {
  try { require.resolve(module); report(true, module); } catch { report(false, `${module}: npm install を実行してください`); }
}
const result = spawnSync(process.execPath, [path.join(__dirname, 'run_python.js'), 'scripts/generate_dual_audio.py', '--check'], { cwd: root, stdio: 'inherit' });
report(result.status === 0, '台本・画像・立ち絵・BGM・フォント');
const req = http.get('http://127.0.0.1:50021/version', { timeout: 2500 }, res => {
  res.resume();
  console.log(res.statusCode === 200 ? 'OK  VOICEVOX起動中' : '案内  VOICEVOXの応答を確認してください');
  process.exitCode = failed ? 1 : 0;
});
req.on('timeout', () => req.destroy());
req.on('error', () => {
  console.log('案内  VOICEVOX未起動。既存音声でのプレビュー・書き出しは可能です。新しいセリフの合成時に起動してください。');
  process.exitCode = failed ? 1 : 0;
});
