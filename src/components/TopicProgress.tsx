import React from 'react';
import { PROGRESS } from '../layout';
import { KEI_FONT } from '../load-font';
import { THEME } from '../theme';
export const TopicProgress: React.FC<{ topic: number; total: number; progress: number }> = ({ topic, total, progress }) =>
  <div style={{ position: 'absolute', top: PROGRESS.top, width: PROGRESS.width, height: PROGRESS.height,
    left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 16,
    color: THEME.green, fontFamily: KEI_FONT, zIndex: 16 }}>
    <span style={{ fontSize: 16, whiteSpace: 'nowrap' }}>今回のお話 {String(topic).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
    <div style={{ display: 'flex', gap: 6, flex: 1 }}>{Array.from({ length: total }, (_, i) =>
      <div key={i} style={{ height: 4, flex: 1, borderRadius: 3, overflow: 'hidden', background: 'rgba(32,91,66,.15)' }}>
        <div style={{ height: '100%', background: THEME.green,
          width: `${i + 1 < topic ? 100 : i + 1 === topic ? Math.min(100, Math.max(0, progress * 100)) : 0}%` }} />
      </div>)}</div>
  </div>;
