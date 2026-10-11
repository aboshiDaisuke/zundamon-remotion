#!/usr/bin/env python3
"""Keep the website's optional AI-rule ZIP in sync with the repository."""
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'website/assets/downloads/zundamon-ai-rules.zip'
FILES = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', '.cursorrules',
         '.github/copilot-instructions.md', 'docs/AI_PROMPT_GUIDE.md',
         '.agents/skills/remotion-video-workflow/SKILL.md',
         '.claude/skills/remotion-video-workflow/SKILL.md']
README = '''# AI向け設定ファイル（既存環境への追加用）

このZIPは、制作ルールとガイドだけをまとめたものです。
動画のプログラム、音声、画像は含まれないため、このZIPだけでは動画を制作できません。
初めて使う方は、制作キット全体をダウンロードしてください。
https://github.com/aboshiDaisuke/zundamon-remotion/archive/refs/heads/main.zip

既存の制作キットへ設定を追加する場合は、フォルダの構成を保って配置します。
同じ名前のファイルを編集済みの場合は、上書き前に内容を比較してください。
'''

def build():
    for name in FILES:
        if not (ROOT / name).is_file():
            raise FileNotFoundError(name)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    temporary = OUTPUT.with_suffix('.tmp.zip')
    with zipfile.ZipFile(temporary, 'w', zipfile.ZIP_DEFLATED) as archive:
        archive.writestr('README.md', README)
        for name in FILES:
            archive.write(ROOT / name, name)
    temporary.replace(OUTPUT)
    print('設定ZIPを更新しました（制作キット本体は含みません）。')

if __name__ == '__main__':
    build()
