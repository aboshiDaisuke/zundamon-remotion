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
import { useEnsureKeiFont } from "./load-font";

interface DualSceneProps {
  scene: (typeof dualSceneData.scenes)[0];
  index: number;
}

const SingleDualScene: React.FC<DualSceneProps> = ({ scene, index }) => {
  const localFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isSpeaking = localFrame < scene.duration * fps;

  // In scene 10, Metan speaks first (frames 0-140), then Zundamon speaks (frames 140+)
  let activeSpeaker: "zundamon" | "metan" = scene.character_speaker as "zundamon" | "metan";
  let activeSpeakerName = scene.speaker_name;
  let activeSubtitle = scene.text;

  if (scene.id === "dual_scene10") {
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

  return (
    <>
      {/* Minchirie Background with Bokeh & Water Animation for this scene */}
      <Background bgImage={scene.bg_image} />

      {/* Voice Audio */}
      <Audio src={staticFile(scene.audioFile)} volume={1.0} />

      {/* Header bar with Prominent Top-Right Telop */}
      <HeaderBar isSpeaking={isSpeaking} subTitle={scene.sub} />

      {/* Center Topic Card */}
      <DualTopicCard
        topic={scene.topic}
        sub={scene.sub}
        points={scene.points}
        category={scene.category}
        imageIndex={index}
        image={scene.image}
        emotion={scene.emotion}
        sceneFrame={localFrame}
        sceneIndex={index}
        topicNum={(scene as any).topic_num}
      />

      {/* Characters (Zundamon on Left with lip sync, Shikoku Metan on Right with lip sync) */}
      <DualCharacters
        currentSpeaker={activeSpeaker}
        isSpeaking={isSpeaking}
        sceneFrame={localFrame}
        sceneIndex={index}
      />

      {/* Subtitle Bar with Speaker Tag */}
      <DualSubtitleBar
        text={activeSubtitle}
        speakerName={activeSpeakerName}
        characterSpeaker={activeSpeaker}
        sceneFrame={localFrame}
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

      {/* Background */}
      <Background />

      {/* Scene Sequence */}
      <Series>
        {dualSceneData.scenes.map((scene, idx) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={scene.durationInFrames}
          >
            <SingleDualScene scene={scene} index={idx} />
          </Series.Sequence>
        ))}
      </Series>
    </div>
  );
};
