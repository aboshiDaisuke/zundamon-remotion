const CHAPTERS = [
  {
    "time": 0,
    "title": "四国の東の玄関口・徳島市"
  },
  {
    "time": 6.766666666666667,
    "title": "「電車」ではなく「汽車」"
  },
  {
    "time": 15.8,
    "title": "神戸ナンバーの意外な正体"
  },
  {
    "time": 55.766666666666666,
    "title": "百貨店がなくなった街"
  },
  {
    "time": 64.8,
    "title": "阿波おどり、その熱気と日常"
  },
  {
    "time": 74.46666666666667,
    "title": "徳島は「実質関西」？"
  },
  {
    "time": 80.6,
    "title": "ご飯が進む徳島ラーメン"
  },
  {
    "time": 89,
    "title": "特別な贈り物「小男鹿」"
  },
  {
    "time": 95.96666666666667,
    "title": "誠意を込めた「小男鹿」"
  },
  {
    "time": 105.8,
    "title": "語りたくなる、徳島の魅力"
  },
  {
    "time": 117.76666666666667,
    "title": "エンディング"
  }
];

const $ = selector => document.querySelector(selector);
const toast = $('#copyStatus');
let toastTimer;
function notify(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 4500);
}

function updatePrompt() {
  const topic = $('#topicInput').value.trim() || '好きなテーマ';
  const duration = $('#durationInput').value;
  $('#masterPromptCode').value = `「${topic}」をテーマに、約${duration}分の解説動画をつくってください。
出演はずんだもんと四国めたん。初めて知る人にもわかる言葉で、明るくテンポのよい掛け合いにしてください。

このキットのREADME.mdとAGENTS.mdを読み、content/episode.jsonを編集してください。1話題につき3〜5往復を目安に、長さに合わせて話題数を調整してください。見出しは短く、要点は3行以内にまとめてください。

必要な音声をVOICEVOXで生成し、全シーンの静止画と音声・字幕を確認してください。素材や読み方に問題があれば修正し、エンディングを含む全編をout/zundamon_metan.mp4に書き出してください。`;
}
$('#topicInput').addEventListener('input', updatePrompt);
$('#durationInput').addEventListener('change', updatePrompt);
updatePrompt();

for (const button of document.querySelectorAll('[data-copy]')) {
  button.addEventListener('click', async () => {
    const source = document.getElementById(button.dataset.copy);
    const text = source.value ?? source.textContent.trim();
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch { /* Fall back to the browser's copy command. */ }
    if (!copied) {
      const temporary = document.createElement('textarea');
      temporary.value = text;
      temporary.setAttribute('aria-label', 'コピー用の文章');
      temporary.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.append(temporary);
      temporary.select();
      try { copied = document.execCommand('copy'); } catch { copied = false; }
      temporary.remove();
      button.focus();
    }
    const destination = button.dataset.copy === 'setupCommands' ? 'ターミナル' : 'AIのチャット';
    notify(copied ? `コピーしました。${destination}に貼り付けてください。` : 'コピーできませんでした。文章を選択して手動でコピーしてください。');
  });
}

const checks = [...document.querySelectorAll('.ready-check')];
checks.forEach(check => check.addEventListener('change', () => {
  const count = checks.filter(item => item.checked).length;
  $('#readyStatus').textContent = `準備のチェック：${count} / 3${count === 3 ? '　次は、AIにテーマを伝えましょう。' : ''}`;
}));

const menu = $('#mainNav');
const menuButton = $('#menuToggle');
function closeMenu() {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'メニューを開く');
}
menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.classList.contains('open')) { closeMenu(); menuButton.focus(); }
});
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

const video = $('#sampleVideo');
const buttons = [...document.querySelectorAll('.ch-btn')];
function updateChapter() {
  let current = 0;
  CHAPTERS.forEach((chapter, index) => { if (video.currentTime >= chapter.time) current = index; });
  buttons.forEach((button, index) => {
    button.classList.toggle('active', index === current);
    if (index === current) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });
  const minutes = Math.floor(video.currentTime / 60);
  const seconds = String(Math.floor(video.currentTime % 60)).padStart(2, '0');
  $('#currentChapterText').textContent = `再生位置: ${minutes}:${seconds}（${CHAPTERS[current].title}）`;
}
buttons.forEach(button => button.addEventListener('click', () => {
  const start = () => {
    video.currentTime = Number(button.dataset.time);
    video.play().catch(() => notify('動画の再生ボタンを押すと、この話題から再生できます。'));
    updateChapter();
  };
  if (video.readyState >= 1) start();
  else { video.addEventListener('loadedmetadata', start, { once: true }); video.load(); }
}));
video.addEventListener('timeupdate', updateChapter);
video.addEventListener('error', () => notify('動画を読み込めませんでした。接続を確認してページを再読み込みしてください。'));
updateChapter();
