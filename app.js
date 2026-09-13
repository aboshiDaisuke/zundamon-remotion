// ==========================================================================
// Vibe Coding Kit - Interactive Controller & Copy to Clipboard
// ==========================================================================

const CHAPTERS = [
  { time: 0, title: "オープニング" },
  { time: 6.4, title: "#2: 電車ゼロ・汽車" },
  { time: 15.2, title: "#3: イオン＆神戸ナンバー" },
  { time: 53.3, title: "#4: 百貨店消滅" },
  { time: 62.0, title: "#5: 阿波踊り" },
  { time: 71.3, title: "#6: 関西圏疑惑" },
  { time: 77.0, title: "#7: 徳島ラーメン" },
  { time: 85.0, title: "#8: 銘菓「小男鹿」" },
  { time: 91.6, title: "#9: ごめんなさいの味" },
  { time: 101.0, title: "#10: エンディング" }
];

document.addEventListener("DOMContentLoaded", () => {
  setupChapterControls();
  setupSmoothScroll();
});

// 1. One-Click Copy Prompt to Clipboard
window.copyPromptText = function() {
  const codeElem = document.getElementById("masterPromptCode");
  const copyBtn = document.getElementById("btnCopyPrompt");
  const copyIcon = document.getElementById("copyIcon");
  const copyText = document.getElementById("copyText");

  if (!codeElem) return;

  const textToCopy = codeElem.innerText || codeElem.textContent;

  navigator.clipboard.writeText(textToCopy).then(() => {
    // Visual feedback
    if (copyIcon) copyIcon.textContent = "✔";
    if (copyText) copyText.textContent = "コピー完了！";
    if (copyBtn) copyBtn.style.background = "#047857";

    setTimeout(() => {
      if (copyIcon) copyIcon.textContent = "📋";
      if (copyText) copyText.textContent = "プロンプトをコピー";
      if (copyBtn) copyBtn.style.background = "";
    }, 2500);
  }).catch(err => {
    console.error("Copy failed: ", err);
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("プロンプトをクリップボードにコピーしました！");
  });
};

// 2. Setup Video Chapter Jump and Real-time Active Sync
function setupChapterControls() {
  const video = document.getElementById("sampleVideo");
  const chapterButtons = document.querySelectorAll(".ch-btn");
  const currentChapterText = document.getElementById("currentChapterText");

  if (!video || !chapterButtons.length) return;

  // Click Handler for Chapter Buttons
  chapterButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const targetTime = parseFloat(btn.getAttribute("data-time") || "0");
      video.currentTime = targetTime;
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => console.log("Play error:", error));
      }

      updateActiveChapterUI(index);
    });
  });

  // Timeupdate Listener
  video.addEventListener("timeupdate", () => {
    const curTime = video.currentTime;
    let activeIdx = 0;

    for (let i = CHAPTERS.length - 1; i >= 0; i--) {
      if (curTime >= CHAPTERS[i].time - 0.4) {
        activeIdx = i;
        break;
      }
    }

    updateActiveChapterUI(activeIdx);
  });

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  }

  function updateActiveChapterUI(index) {
    chapterButtons.forEach((b, idx) => {
      if (idx === index) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });

    if (currentChapterText && CHAPTERS[index]) {
      const ch = CHAPTERS[index];
      currentChapterText.textContent = `再生位置: ${formatTime(video.currentTime)} (${ch.title})`;
    }
  }
}

// 3. Smooth scroll
function setupSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        window.closeMobileNav();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// 4. Collapsible Mobile Navigation
window.toggleMobileNav = function() {
  const nav = document.getElementById("mainNav");
  const toggleBtn = document.getElementById("menuToggle");
  if (!nav || !toggleBtn) return;
  const isOpen = nav.classList.toggle("open");
  toggleBtn.classList.toggle("active", isOpen);
  toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
};

window.closeMobileNav = function() {
  const nav = document.getElementById("mainNav");
  const toggleBtn = document.getElementById("menuToggle");
  if (nav && nav.classList.contains("open")) {
    nav.classList.remove("open");
    if (toggleBtn) {
      toggleBtn.classList.remove("active");
      toggleBtn.setAttribute("aria-expanded", "false");
    }
  }
};

// Close mobile nav when clicking outside header
document.addEventListener("click", (e) => {
  const header = document.querySelector(".header");
  if (header && !header.contains(e.target)) {
    window.closeMobileNav();
  }
});
