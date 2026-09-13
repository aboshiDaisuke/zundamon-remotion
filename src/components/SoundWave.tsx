import React from "react";
import { useCurrentFrame } from "remotion";

export const SoundWave: React.FC<{ isSpeaking?: boolean }> = ({ isSpeaking = true }) => {
  const frame = useCurrentFrame();

  const bars = [0.4, 0.9, 0.6, 1.0, 0.7, 0.5, 0.8, 0.3];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        height: "36px",
        padding: "0 12px",
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        borderRadius: "20px",
        backdropFilter: "blur(6px)",
        boxShadow: "0 4px 12px rgba(46, 125, 50, 0.15)",
        border: "1.5px solid #a5d6a7",
      }}
    >
      <span
        style={{
          fontSize: "14px",
          fontWeight: "bold",
          color: "#2e7d32",
          marginRight: "4px",
          fontFamily: "'M PLUS Rounded 1c', sans-serif",
        }}
      >
        VOICE
      </span>
      {bars.map((heightMultiplier, i) => {
        const bounce = isSpeaking
          ? Math.abs(Math.sin((frame + i * 8) * 0.25)) * 22 * heightMultiplier + 6
          : 4;
        return (
          <div
            key={i}
            style={{
              width: "5px",
              height: `${bounce}px`,
              borderRadius: "3px",
              backgroundColor: i % 2 === 0 ? "#4caf50" : "#81c784",
              transition: "height 0.05s ease",
            }}
          />
        );
      })}
    </div>
  );
};
