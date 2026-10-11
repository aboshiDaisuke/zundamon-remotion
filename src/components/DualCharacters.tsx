import React from 'react';
import { Img, staticFile } from 'remotion';
import { CHARACTER } from '../layout';

interface Props {
  currentSpeaker: 'zundamon' | 'metan'; isSpeaking: boolean; mouthLevel: number;
  speakFrame: number; absoluteFrame: number; expressions: { zundamon: string; metan: string };
}
export const DualCharacters: React.FC<Props> = ({ currentSpeaker, isSpeaking, mouthLevel, speakFrame, absoluteFrame, expressions }) => {
  return <>{(['zundamon', 'metan'] as const).map(actor => {
    const active = actor === currentSpeaker;
    const speaking = active && isSpeaking;
    const hop = speaking && speakFrame < 10 ? Math.sin(speakFrame / 10 * Math.PI) * 12 : 0;
    const mouth = speaking && mouthLevel >= 0.7 ? 'open' : 'close';
    const blink = (absoluteFrame + (actor === 'metan' ? 51 : 0)) % 137;
    const eye = blink >= 90 && blink < 94 ? '_blink' : '';
    const prefix = actor === 'zundamon' ? 'zunda' : 'metan';
    return <div key={actor} style={{ position: 'absolute',
      left: actor === 'zundamon' ? CHARACTER.zundaLeft : CHARACTER.metanLeft,
      bottom: CHARACTER.bottom, width: CHARACTER.width, height: CHARACTER.height,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center', transformOrigin: 'bottom center',
      transform: `translateY(${-hop}px)${actor === 'zundamon' ? ' scaleX(-1)' : ''}`,
      filter: `brightness(${active ? 1 : 0.96}) drop-shadow(0 8px 10px rgba(28,50,38,0.16))`, zIndex: 20 }}>
      <Img src={staticFile(`characters/${prefix}_${expressions[actor]}${eye}_${mouth}.png`)}
        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
    </div>;
  })}</>;
};
