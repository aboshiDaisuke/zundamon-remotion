import React from 'react';
import { KEI_FONT } from '../load-font';
import { HEADER, SAFE } from '../layout';
import { THEME } from '../theme';
import data from '../dual_scene_data.json';
import { requireTextFits } from '../text-layout';

interface HeaderBarProps { isSpeaking?: boolean; subTitle?: string; }
export const HeaderBar: React.FC<HeaderBarProps> = ({ subTitle }) => {
  const { program } = data;
  requireTextFits(program.title, 30, HEADER.leftWidth - 56, '番組名');
  requireTextFits(program.eyebrow, 15, HEADER.leftWidth - 56, '番組名の上段');
  if (subTitle) requireTextFits(subTitle, 30, HEADER.rightWidth - 56, '右上テロップ');
  return <div style={{ position: 'absolute', top: HEADER.top, left: SAFE.left,
    width: SAFE.right - SAFE.left, height: HEADER.height, display: 'flex',
    justifyContent: 'space-between', gap: HEADER.gap, zIndex: 30, fontFamily: KEI_FONT }}>
    <div style={{ boxSizing: 'border-box', width: HEADER.leftWidth, flexShrink: 0,
      display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px',
      borderLeft: `6px solid ${THEME.green}`, borderRadius: 12, background: THEME.paper,
      boxShadow: THEME.shadow, color: THEME.green }}>
      <span style={{ fontSize: 15, lineHeight: 1.4, color: THEME.muted }}>{program.eyebrow}</span>
      <span style={{ fontSize: 30, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{program.title}</span>
    </div>
    {subTitle && <div style={{ maxWidth: HEADER.rightWidth, boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', padding: '0 24px', borderRadius: 12,
      border: `3px solid ${THEME.gold}`, background: `linear-gradient(120deg, ${THEME.green}, #317757)`,
      color: 'white', fontSize: 30, whiteSpace: 'nowrap', boxShadow: THEME.shadow }}>{subTitle}</div>}
  </div>;
};
