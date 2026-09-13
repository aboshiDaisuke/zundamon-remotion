import React from "react";
import { Img, spring, useVideoConfig } from "remotion";

interface ZundamonCharacterProps {
  imageSrc: string;
  isSpeaking: boolean;
  sceneFrame: number;
  emotion?: string;
}

export const ZundamonCharacter: React.FC<ZundamonCharacterProps> = ({
  imageSrc,
  isSpeaking,
  sceneFrame,
  emotion = "✨",
}) => {
  const { fps } = useVideoConfig();

  // Entrance spring animation when scene begins
  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: {
      damping: 12,
      stiffness: 140,
    },
  });

  // Emotion badge pop-in
  const emotionPop = spring({
    frame: sceneFrame - 6,
    fps,
    config: {
      damping: 10,
      stiffness: 160,
    },
  });

  // Breathing animation (subtle scale and Y offset)
  const breath = Math.sin(sceneFrame * 0.08) * 8;
  const breathScale = 1 + Math.sin(sceneFrame * 0.08) * 0.015;

  // Speaking bounce (hopping cute motion)
  const hop = isSpeaking ? Math.abs(Math.sin(sceneFrame * 0.38)) * 18 : 0;

  // Dynamic tilt while talking
  const tilt = isSpeaking ? Math.sin(sceneFrame * 0.22) * 2.2 : 0;

  const scale = entrance * breathScale;
  const translateY = (1 - entrance) * 220 - breath - hop;

  // Emotion float animation
  const emotionFloat = Math.sin(sceneFrame * 0.12) * 8;

  return (
    <div
      style={{
        position: "absolute",
        left: "50px",
        bottom: "-30px",
        width: "660px",
        height: "980px",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 10,
        transform: `translateY(${translateY}px) scale(${scale}) rotate(${tilt}deg)`,
        transformOrigin: "bottom center",
      }}
    >
      {/* Emotion Bubble over head */}
      <div
        style={{
          position: "absolute",
          top: "100px",
          right: "80px",
          zIndex: 15,
          opacity: emotionPop,
          transform: `scale(${emotionPop}) translateY(${emotionFloat}px)`,
          background: "linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%)",
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "36px",
          boxShadow: "0 8px 20px rgba(46, 125, 50, 0.25)",
          border: "3px solid #81c784",
        }}
      >
        {emotion}
      </div>

      {/* Soft shadow below character */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          width: "320px",
          height: "38px",
          borderRadius: "50%",
          backgroundColor: "rgba(46, 125, 50, 0.22)",
          filter: "blur(14px)",
          transform: `scale(${isSpeaking ? 1 - hop * 0.015 : 1})`,
          zIndex: 1,
        }}
      />

      {/* Character Image */}
      <Img
        src={imageSrc}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          filter: "drop-shadow(0 14px 28px rgba(46, 125, 50, 0.2))",
          zIndex: 2,
        }}
      />
    </div>
  );
};
