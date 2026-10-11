import React from 'react';
import { KEI_FONT } from '../load-font';
import { SUBTITLE } from '../layout';
import { THEME } from '../theme';
import { measureText, wrapSubtitle } from '../text-layout';

interface Props {
  text: string; speakerName: string; characterSpeaker: 'zundamon' | 'metan';
  speakFrame: number; speechFrames: number;
}
export const DualSubtitleBar: React.FC<Props> = ({ text, speakerName, characterSpeaker, speakFrame, speechFrames }) => {
  const zunda = characterSpeaker === 'zundamon';
  const accent = zunda ? THEME.green : THEME.pink;
  const lines = React.useMemo(() => wrapSubtitle(text, s => measureText(s, THEME.subtitleSize), SUBTITLE.textWidth), [text]);
  const pages = Array.from({ length: Math.ceil(lines.length / 2) }, (_, i) => lines.slice(i * 2, i * 2 + 2).join('\n'));
  // Page durations are proportional to text length. Use one short line per turn for tighter timing.
  const total = pages.reduce((sum, page) => sum + page.length, 0);
  const position = Math.min(1, Math.max(0, speakFrame / Math.max(1, speechFrames))) * total;
  let remaining = position;
  let index = 0;
  while (index < pages.length - 1 && remaining >= pages[index].length) remaining -= pages[index++].length;
  return <div style={{ position: 'absolute', top: SUBTITLE.top, left: '50%', transform: 'translateX(-50%)',
    width: SUBTITLE.width, height: SUBTITLE.height, boxSizing: 'border-box', zIndex: 35,
    background: THEME.paper, borderRadius: THEME.radius, boxShadow: THEME.shadow,
    border: '1px solid rgba(35,61,51,0.08)', display: 'flex', alignItems: 'center',
    padding: `0 ${SUBTITLE.padding}px`, gap: SUBTITLE.gap, fontFamily: KEI_FONT }}>
    <div style={{ width: SUBTITLE.tagWidth, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 7, alignItems: 'center' }}>
      <span style={{ fontSize: 19, color: 'white', background: accent, borderRadius: 8, padding: '8px 10px',
        width: '100%', boxSizing: 'border-box', textAlign: 'center' }}>{speakerName}</span>
      <div style={{ display: 'flex', gap: 4 }}>{[0, 1, 2].map(i => <span key={i} style={{ width: 15, height: 3,
        borderRadius: 2, background: accent, opacity: i === index % 3 ? 1 : 0.2 }} />)}</div>
    </div>
    <div style={{ width: SUBTITLE.textWidth, fontSize: THEME.subtitleSize, color: THEME.ink,
      lineHeight: SUBTITLE.lineHeight, whiteSpace: 'pre', textAlign: 'left' }}>{pages[index]}</div>
  </div>;
};
