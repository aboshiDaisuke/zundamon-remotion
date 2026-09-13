import React from "react";
import { spring, useVideoConfig } from "remotion";

interface SubtitleBarProps {
  text: string;
  sceneFrame: number;
}

export const SubtitleBar: React.FC<SubtitleBarProps> = ({ text, sceneFrame }) => {
  const { fps } = useVideoConfig();

  // Entrance spring animation for the subtitle container
  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: {
      damping: 14,
      stiffness: 120,
    },
  });

  // Calculate font size based on text length
  const fontSize = text.length > 40 ? 36 : text.length > 30 ? 40 : 44;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "35px",
        left: "50%",
        transform: `translateX(-50%) translateY(${(1 - entrance) * 70}px)`,
        opacity: entrance,
        width: "1760px",
        height: "165px",
        zIndex: 25,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Official Tokushima PR Name Tag */}
      <div
        style={{
          alignSelf: "flex-start",
          marginLeft: "240px",
          marginBottom: "-12px",
          zIndex: 30,
          background: "linear-gradient(135deg, #1b5e20 0%, #0d47a1 100%)",
          color: "#ffffff",
          padding: "7px 26px",
          borderRadius: "18px 18px 6px 6px",
          fontSize: "21px",
          fontFamily: "'keifont', sans-serif",
          letterSpacing: "0.8px",
          boxShadow: "0 6px 14px rgba(13, 71, 161, 0.3)",
          border: "2px solid #a5d6a7",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span style={{ fontSize: "18px" }}>🌱</span>
        徳島市PRナビゲーター ずんだもん
      </div>

      {/* Main Subtitle Box */}
      <div
        style={{
          width: "100%",
          height: "130px",
          backgroundColor: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(14px)",
          borderRadius: "32px",
          border: "4px solid #4caf50",
          boxShadow: "0 16px 36px rgba(46, 125, 50, 0.22), inset 0 2px 4px rgba(255, 255, 255, 0.9)",
          display: "flex",
          alignItems: "center",
          padding: "0 50px 0 240px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Accent leaf decoration */}
        <div
          style={{
            position: "absolute",
            right: "-20px",
            bottom: "-30px",
            fontSize: "130px",
            opacity: 0.07,
            pointerEvents: "none",
            transform: "rotate(20deg)",
          }}
        >
          🍃
        </div>

        {/* Subtitle Text */}
        <span
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: "'keifont', sans-serif",
            color: "#1b5e20",
            lineHeight: 1.35,
            letterSpacing: "0.5px",
            textShadow: `
              3px 3px 0 #ffffff,
              -3px -3px 0 #ffffff,
              3px -3px 0 #ffffff,
              -3px 3px 0 #ffffff,
              0 3px 0 #ffffff,
              3px 0 0 #ffffff,
              0 -3px 0 #ffffff,
              -3px 0 0 #ffffff,
              0 6px 16px rgba(46, 125, 50, 0.25)
            `,
            wordBreak: "keep-all",
            overflowWrap: "anywhere",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
