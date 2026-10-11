/** Font must be loaded before measuring. No silent truncation or shrinking. */
export const measureText = (text: string, size: number) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  context.font = `${size}px KeiFontFamily`;
  return context.measureText(text).width;
};

export const requireTextFits = (text: string, size: number, width: number, label: string) => {
  if (measureText(text, size) > width) {
    throw new Error(`${label}が表示枠を超えています。content/episode.json の文章を短くしてください: ${text}`);
  }
};

// Explicit newlines take priority. Closing punctuation stays with the previous glyph.
export const wrapSubtitle = (text: string, measure: (s: string) => number, width: number): string[] => {
  const result: string[] = [];
  const closing = /^[、。，．！？!?））」』】…ーっゃゅょぁぃぅぇぉ]$/u;
  const opening = /^[（「『【]$/u;
  for (const paragraph of text.split('\n').filter(Boolean)) {
    let line = '';
    for (const char of Array.from(paragraph)) {
      if (line && measure(line + char) > width) {
        let carry = '';
        if (closing.test(char) || opening.test(line.slice(-1))) {
          carry = line.slice(-1);
          line = line.slice(0, -1);
        }
        if (line) result.push(line);
        line = carry + char;
      } else line += char;
    }
    if (line) result.push(line);
  }
  return result;
};
