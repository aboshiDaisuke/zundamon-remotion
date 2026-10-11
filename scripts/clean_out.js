/** Remove only known generated previews; preserve final and unrelated files. */
const fs = require('node:fs');
const path = require('node:path');
const dir = path.resolve(__dirname, '../out');
if (!fs.existsSync(dir)) process.exit(0);
let count = 0;
for (const file of fs.readdirSync(dir)) {
  if (!/^(preview(?:_.*)?|still_.*)\.png$/.test(file) && !/^test_.*\.wav$/.test(file)) continue;
  const target = path.join(dir, file);
  if (fs.lstatSync(target).isFile()) { fs.unlinkSync(target); count++; }
}
console.log(`中間プレビュー ${count}件を整理しました。完成動画と out/review/ は保持します。`);
