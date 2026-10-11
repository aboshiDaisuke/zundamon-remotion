const { spawnSync } = require('node:child_process');
const path = require('node:path');
const args = process.argv.slice(2);
if (!args.length) { console.error('Pythonスクリプトを指定してください。'); process.exit(1); }
const candidates = process.platform === 'win32' ? ['python', 'py', 'python3'] : ['python3', 'python'];
for (const executable of candidates) {
  const probe = spawnSync(executable, ['-c', 'import sys; sys.exit(0 if sys.version_info >= (3, 9) else 1)']);
  if (probe.error || probe.status !== 0) continue;
  const result = spawnSync(executable, args, { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
  // A script failure must not run the same mutating operation a second time.
  process.exit(result.status ?? 1);
}
console.error('Python 3.9以上が見つかりません。Pythonを導入してから再実行してください。');
process.exit(1);
