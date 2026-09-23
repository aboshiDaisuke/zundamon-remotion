import React from "react";
import {
  Audio,
  interpolate,
  Series,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import dualSceneData from "./dual_scene_data.json";
import { Background } from "./components/Background";
import { HeaderBar } from "./components/HeaderBar";
import { DualCharacters } from "./components/DualCharacters";
import { DualSubtitleBar } from "./components/DualSubtitleBar";
import { DualTopicCard } from "./components/DualTopicCard";
import { DualOutro, OUTRO_FRAMES } from "./components/DualOutro";
import { useEnsureKeiFont } from "./load-font";

type DualScene = (typeof dualSceneData.scenes)[0];

interface DualSceneProps {
  scene: DualScene;
  /** Frames elapsed in the same topic before this scene started */
  topicOffset: number;
}

// Consecutive scenes sharing a topic_num (e.g. 3_1〜3_5) keep the card still
const topicOffsets = dualSceneData.scenes.map((scene, i, scenes) => {
  let offset = 0;
  for (let j = i - 1; j >= 0 && scenes[j].topic_num === scene.topic_num; j--) {
    offset += scenes[j].durationInFrames;
  }
  return offset;
});

const SingleDualScene: React.FC<DualSceneProps> = ({ scene, topicOffset }) => {
  const localFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isSpeaking = localFrame < scene.duration * fps;

  // In scene 10, Metan speaks first (frames 0-140), then Zundamon speaks (frames 140+)
  let activeSpeaker: "zundamon" | "metan" = scene.character_speaker as "zundamon" | "metan";
  let activeSpeakerName = scene.speaker_name;
  let activeSubtitle = scene.text;
  let speakStart = 0;

  if (scene.id === "dual_scene10") {
    speakStart = localFrame < 145 ? 0 : 145;
    if (localFrame < 145) {
      activeSpeaker = "metan";
      activeSpeakerName = "四国めたん";
      activeSubtitle = "色々申し上げましたけれど、\n一度味わえば病みつきになるのが徳島市の奥深さですわ！";
    } else {
      activeSpeaker = "zundamon";
      activeSpeakerName = "ずんだもん";
      activeSubtitle = "みんなも汽車に乗って、濃いラーメンと、\n『ごめんなさいの味』を体験しに来てほしいのだ！";
    }
  }

  const topicFrame = localFrame + topicOffset;
  const speakFrame = localFrame - speakStart;

  return (
    <>
      <Background bgImage={scene.bg_image} />

      <Audio src={staticFile(scene.audioFile)} volume={1.0} />

      <HeaderBar subTitle={scene.sub} />

      <DualTopicCard
        topic={scene.topic}
        category={scene.category}
        image={scene.image}
        points={scene.points}
        topicNum={scene.topic_num}
        topicFrame={topicFrame}
      />

      <DualCharacters
        currentSpeaker={activeSpeaker}
        isSpeaking={isSpeaking}
        sceneFrame={localFrame}
        topicIndex={scene.topic_num - 1}
        topicFrame={topicFrame}
        speakFrame={speakFrame}
      />

      <DualSubtitleBar
        key={speakStart}
        text={activeSubtitle}
        speakerName={activeSpeakerName}
        characterSpeaker={activeSpeaker}
        speakFrame={speakFrame}
      />
    </>
  );
};

export const DualExplainer: React.FC = () => {
  useEnsureKeiFont();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Subtle ambient BGM (Sharou's 2:23 AM, lively and pleasant)
  const bgmVolume = interpolate(
    frame,
    [0, 30, durationInFrames - 45, durationInFrames],
    [0, 0.11, 0.11, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      style={{
        width: "1920px",
        height: "1080px",
        position: "relative",
        overflow: "hidden",
        fontFamily:
          "'keifont', 'Hiragino Maru Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif",
      }}
    >
      {/* Ambient BGM */}
      <Audio
        src={staticFile("audio/bgm.mp3")}
        volume={bgmVolume}
        loop
      />

      <Background />

      {/* Scene Sequence */}
      <Series>
        {dualSceneData.scenes.map((scene, idx) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={scene.durationInFrames}
          >
            <SingleDualScene scene={scene} topicOffset={topicOffsets[idx]} />
          </Series.Sequence>
        ))}
        <Series.Sequence durationInFrames={OUTRO_FRAMES}>
          <DualOutro />
        </Series.Sequence>
      </Series>
    </div>
  );
};
