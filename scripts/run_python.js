/**
 * Cross-Platform Python Script Runner
 * Works seamlessly on macOS, Windows, and Linux.
 * Automatically detects whether to use 'python3' or 'python'.
 */

const { spawn } = require("child_process");
const process = require("process");

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/run_python.js <script.py> [args...]");
  process.exit(1);
}

function runWithCommand(cmd) {
  return new Promise((resolve) => {
    const proc = spawn(cmd, args, { stdio: "inherit", shell: true });
    proc.on("error", () => resolve(false));
    proc.on("close", (code) => {
      resolve(code === 0);
    });
  });
}

async function main() {
  // Try 'python3' first (typical on macOS / Linux)
  const isWindows = process.platform === "win32";
  const preferredCmds = isWindows ? ["python", "py", "python3"] : ["python3", "python"];

  for (const cmd of preferredCmds) {
    try {
      const success = await runWithCommand(cmd);
      if (success) {
        process.exit(0);
      }
    } catch (e) {
      // Try next
    }
  }

  console.error("Error: Could not execute Python. Please ensure Python 3 is installed and in your PATH.");
  process.exit(1);
}

main();
