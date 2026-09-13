import React from "react";
import { spring, useVideoConfig } from "remotion";
import { KEI_FONT } from "../load-font";

interface DualSubtitleBarProps {
  text: string;
  speakerName: string;
  characterSpeaker: "zundamon" | "metan";
  sceneFrame: number;
}

export const DualSubtitleBar: React.FC<DualSubtitleBarProps> = ({
  text,
  speakerName,
  characterSpeaker,
  sceneFrame,
}) => {
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const isZunda = characterSpeaker === "zundamon";

  return (
    <div
      style={{
        position: "absolute",
        bottom: "24px",
        left: "50%",
        transform: `translateX(-50%) translateY(${(1 - entrance) * 30}px)`,
        width: "1380px",
        zIndex: 35,
        opacity: entrance,
      }}
    >
      {/* Main Subtitle Box with Integrated Speaker Tag */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(18px)",
          border: isZunda
            ? "3px solid #81c784"
            : "3px solid #f48fb1",
          borderRadius: "22px",
          padding: "14px 36px 14px 36px",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "92px",
          position: "relative",
        }}
      >
        {/* Integrated Speaker Tag (Inside Box top-left) */}
        <div
          style={{
            position: "absolute",
            top: "-18px",
            left: isZunda ? "140px" : "auto",
            right: isZunda ? "auto" : "140px",
            background: isZunda
              ? "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)"
              : "linear-gradient(135deg, #ad1457 0%, #d81b60 100%)",
            color: "#ffffff",
            padding: "4px 24px",
            borderRadius: "16px",
            fontSize: "18px",
            fontFamily: KEI_FONT,
            letterSpacing: "0.8px",
            boxShadow: isZunda
              ? "0 4px 10px rgba(27, 94, 32, 0.35)"
              : "0 4px 10px rgba(173, 20, 87, 0.35)",
            border: "2px solid rgba(255, 255, 255, 0.95)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: "16px" }}>{isZunda ? "🌱" : "🌸"}</span>
          <span>{speakerName}</span>
        </div>

        {/* Subtitle Text with Keifont */}
        <span
          style={{
            fontSize: "33px",
            fontFamily: KEI_FONT,
            color: isZunda ? "#1b5e20" : "#880e4f",
            textAlign: "center",
            lineHeight: "1.35",
            letterSpacing: "0.5px",
            whiteSpace: "pre-line",
            textShadow: isZunda
              ? "0 1px 2px rgba(255, 255, 255, 0.8), 0 0 1px rgba(27, 94, 32, 0.2)"
              : "0 1px 2px rgba(255, 255, 255, 0.8), 0 0 1px rgba(136, 14, 79, 0.2)",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
