import React from 'react';
import { Audio, interpolate, Series, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import data from './dual_scene_data.json';
import { Background } from './components/Background';
import { HeaderBar } from './components/HeaderBar';
import { DualCharacters } from './components/DualCharacters';
import { DualSubtitleBar } from './components/DualSubtitleBar';
import { DualTopicCard } from './components/DualTopicCard';
import { TopicProgress } from './components/TopicProgress';
import { DualOutro, OUTRO_FRAMES } from './components/DualOutro';
import { KEI_FONT, useEnsureKeiFont } from './load-font';
import { CANVAS } from './layout';

type Scene = typeof data.scenes[number];
const topics = [...new Set(data.scenes.map(s => s.topic_num))];
const timing = data.scenes.map(scene => {
  const group = data.scenes.filter(s => s.topic_num === scene.topic_num);
  return { offset: scene.startFrame - group[0].startFrame, duration: group.reduce((sum, s) => sum + s.durationInFrames, 0) };
});
const SceneView: React.FC<{ scene: Scene; offset: number; duration: number }> = ({ scene, offset, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const speaker = scene.character_speaker as 'zundamon' | 'metan';
  const topicFrame = frame + offset;
  return <>
    <Background bgImage={scene.bg_image} />
    <Audio src={staticFile(scene.audioFile)} />
    <HeaderBar subTitle={scene.sub} />
    <DualTopicCard topic={scene.topic} category={scene.category} image={scene.image} points={scene.points}
      topicNum={scene.topic_num} topicFrame={topicFrame} />
    <TopicProgress topic={scene.topic_num} total={topics.length} progress={topicFrame / duration} />
    <DualCharacters currentSpeaker={speaker} isSpeaking={frame < scene.duration * fps}
      mouthLevel={scene.mouthLevels[frame] ?? 0} speakFrame={frame} absoluteFrame={scene.startFrame + frame} expressions={scene.expressions} />
    <DualSubtitleBar text={scene.text} speakerName={scene.speaker_name} characterSpeaker={speaker}
      speakFrame={frame} speechFrames={scene.duration * fps} />
  </>;
};
export const DualExplainer: React.FC = () => {
  const ready = useEnsureKeiFont();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const volume = interpolate(frame, [0, 30, durationInFrames - 45, durationInFrames],
    [0, data.audio.bgmVolume, data.audio.bgmVolume, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (!ready) return null;
  return <div style={{ width: CANVAS.width, height: CANVAS.height, position: 'relative', overflow: 'hidden', fontFamily: KEI_FONT }}>
    <Audio src={staticFile(data.audio.bgm)} volume={volume} loop />
    <Series>{data.scenes.map((scene, i) => <Series.Sequence key={scene.id} durationInFrames={scene.durationInFrames}>
      <SceneView scene={scene} {...timing[i]} />
    </Series.Sequence>)}
      <Series.Sequence durationInFrames={OUTRO_FRAMES}><DualOutro /></Series.Sequence>
    </Series>
  </div>;
};
