import React from "react";
import {
  Audio,
  interpolate,
  Series,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import sceneData from "./scene_data.json";
import { Background } from "./components/Background";
import { ZundamonCharacter } from "./components/ZundamonCharacter";
import { SubtitleBar } from "./components/SubtitleBar";
import { TopicCard } from "./components/TopicCard";
import { HeaderBar } from "./components/HeaderBar";
import { useEnsureKeiFont } from "./load-font";

interface SceneItemProps {
  scene: (typeof sceneData.scenes)[0];
  index: number;
}

const SingleScene: React.FC<SceneItemProps> = ({ scene, index }) => {
  const localFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Voice speaks for the duration of the audio
  const isSpeaking = localFrame < scene.duration * fps;

  return (
    <>
      {/* Voice Audio playback */}
      <Audio src={staticFile(scene.audioFile)} volume={1.0} />

      {/* Header bar */}
      <HeaderBar isSpeaking={isSpeaking} />

      {/* Topic Card with Key Points */}
      <TopicCard
        topic={scene.topic}
        sub={scene.sub}
        points={scene.points}
        category={scene.category}
        emotion={scene.emotion}
        sceneIndex={index}
        sceneFrame={localFrame}
      />

      {/* Character with Emotion Bubble */}
      <ZundamonCharacter
        imageSrc={staticFile(`characters/${scene.character}`)}
        isSpeaking={isSpeaking}
        sceneFrame={localFrame}
        emotion={scene.emotion}
      />

      {/* Subtitle */}
      <SubtitleBar text={scene.text} sceneFrame={localFrame} />
    </>
  );
};

export const ZundamonExplainer: React.FC = () => {
  useEnsureKeiFont();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Gentle fade-in and fade-out for the background music (subtle ambient background so voice is crystal clear)
  const bgmVolume = interpolate(
    frame,
    [0, 30, durationInFrames - 45, durationInFrames],
    [0, 0.06, 0.06, 0],
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
      {/* Background Music (Carefree Acoustic) */}
      <Audio
        src={staticFile("audio/bgm.mp3")}
        volume={bgmVolume}
        loop
      />

      {/* Universal continuous civic background */}
      <Background />

      {/* Sequence of individual scenes */}
      <Series>
        {sceneData.scenes.map((scene, idx) => (
          <Series.Sequence
            key={scene.id}
            durationInFrames={scene.durationInFrames}
          >
            <SingleScene scene={scene} index={idx} />
          </Series.Sequence>
        ))}
      </Series>
    </div>
  );
};
