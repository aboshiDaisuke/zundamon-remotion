import React from 'react';
import { Img, spring, staticFile, useVideoConfig } from 'remotion';
import { KEI_FONT } from '../load-font';
import { CARD } from '../layout';
import { THEME } from '../theme';
import { requireTextFits } from '../text-layout';
import data from '../dual_scene_data.json';

interface Props { topic: string; category: string; image: string; points: string[]; topicNum: number; topicFrame: number; }
export const DualTopicCard: React.FC<Props> = ({ topic, category, image, points, topicNum, topicFrame }) => {
  const { fps } = useVideoConfig();
  const entrance = spring({ frame: topicFrame, fps, config: { damping: 200 }, durationInFrames: 14 });
  requireTextFits(topic, THEME.headingSize, CARD.width - CARD.padding * 2, '大見出し');
  requireTextFits(`${data.program.label} / ${category}`, 16, CARD.width - CARD.padding * 2 - 90, 'カテゴリ');
  points.forEach(p => requireTextFits(p, THEME.pointSize, CARD.width - CARD.padding * 2 - 58, '解説ポイント'));
  return <div style={{ position: 'absolute', left: '50%', top: CARD.top, width: CARD.width, height: CARD.height,
    transform: `translateX(-50%) translateY(${(1 - entrance) * 10}px)`, opacity: entrance,
    background: THEME.paper, borderRadius: THEME.radius, boxShadow: THEME.shadow,
    overflow: 'hidden', zIndex: 15, fontFamily: KEI_FONT }}>
    <div style={{ height: CARD.headingHeight, boxSizing: 'border-box', padding: `14px ${CARD.padding}px 12px`,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: THEME.green, background: THEME.greenLight, fontSize: 16,
          borderRadius: 6, padding: '3px 12px' }}>{data.program.label} / {category}</span>
        <span style={{ color: THEME.green, fontSize: 20 }}>#{String(topicNum).padStart(2, '0')}</span>
      </div>
      <h2 style={{ margin: 0, color: THEME.green, fontSize: THEME.headingSize,
        fontWeight: 'normal', lineHeight: 1.2, whiteSpace: 'nowrap' }}>{topic}</h2>
    </div>
    <div style={{ height: CARD.imageHeight, overflow: 'hidden', background: THEME.greenLight }}>
      <Img src={staticFile(image)} style={{ width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${1 + Math.min(topicFrame / (fps * 18), 1) * 0.025})` }} />
    </div>
    <div style={{ height: CARD.height - CARD.headingHeight - CARD.imageHeight, boxSizing: 'border-box',
      padding: `12px ${CARD.padding}px`, display: 'flex', alignItems: 'center' }}>
      <div style={{ borderLeft: `5px solid ${THEME.green}`, paddingLeft: 16, display: 'flex',
        flexDirection: 'column', gap: CARD.pointGap }}>
        {points.map((point, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, height: CARD.pointHeight }}>
          <span style={{ background: THEME.green, color: 'white', width: 26, height: 26,
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{i + 1}</span>
          <span style={{ color: THEME.ink, fontSize: THEME.pointSize, whiteSpace: 'nowrap', lineHeight: 1.15 }}>{point}</span>
        </div>)}
      </div>
    </div>
  </div>;
};
