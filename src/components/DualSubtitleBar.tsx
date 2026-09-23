import React from "react";
import { interpolate } from "remotion";
import { KEI_FONT } from "../load-font";
import { SUBTITLE } from "../layout";

interface DualSubtitleBarProps {
  text: string;
  speakerName: string;
  characterSpeaker: "zundamon" | "metan";
  /** Frames since this line started */
  speakFrame: number;
}

export const DualSubtitleBar: React.FC<DualSubtitleBarProps> = ({
  text,
  speakerName,
  characterSpeaker,
  speakFrame,
}) => {
  const isZunda = characterSpeaker === "zundamon";
  const accent = isZunda ? "#2e7d32" : "#c2185b";
  const ink = isZunda ? "#1b4d1e" : "#7a1045";

  const opacity = interpolate(speakFrame, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: `${SUBTITLE.top}px`,
        left: "50%",
        transform: "translateX(-50%)",
        width: `${SUBTITLE.width}px`,
        height: `${SUBTITLE.height}px`,
        zIndex: 35,
        opacity,
      }}
    >
      <div
        style={{
          position: "relative",
          height: "100%",
          background: "rgba(255, 255, 255, 0.96)",
          borderRadius: "20px",
          borderTop: `5px solid ${accent}`,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.16)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 48px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20px",
            left: isZunda ? "36px" : "auto",
            right: isZunda ? "auto" : "36px",
            background: accent,
            color: "#ffffff",
            padding: "3px 20px",
            borderRadius: "999px",
            fontSize: "18px",
            fontFamily: KEI_FONT,
            letterSpacing: "0.8px",
          }}
        >
          {speakerName}
        </div>

        <span
          style={{
            fontSize: "33px",
            fontFamily: KEI_FONT,
            color: ink,
            textAlign: "center",
            lineHeight: 1.35,
            letterSpacing: "0.5px",
            whiteSpace: "pre-line",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
