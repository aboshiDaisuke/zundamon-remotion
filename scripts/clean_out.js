/**
 * Cross-Platform Out Directory Cleaner
 * Keeps only the latest final mp4 video and deletes intermediate previews.
 * Works identically on macOS, Windows, and Linux.
 */

const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "out");
const KEEP_FILES = new Set(["zundamon_metan.mp4"]);

if (!fs.existsSync(OUT_DIR)) {
  console.log("out/ directory does not exist. Nothing to clean.");
  process.exit(0);
}

const files = fs.readdirSync(OUT_DIR);
let deletedCount = 0;

for (const file of files) {
  if (!KEEP_FILES.has(file)) {
    const fullPath = path.join(OUT_DIR, file);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isFile()) {
        fs.unlinkSync(fullPath);
        deletedCount++;
      }
    } catch (e) {
      console.warn(`Could not delete: ${file}`, e.message);
    }
  }
}

console.log(`Cleaned out/ directory. Removed ${deletedCount} intermediate file(s). Kept: ${Array.from(KEEP_FILES).join(", ")}`);
