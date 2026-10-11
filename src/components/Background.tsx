import React from "react";
import { interpolate, useCurrentFrame, staticFile, Img } from "remotion";
import { SAFE } from "../layout";

interface BackgroundProps {
  bgImage?: string;
}

export const Background: React.FC<BackgroundProps> = ({ bgImage }) => {
  const frame = useCurrentFrame();

  // Slow Ken Burns zoom on the Minchirie background
  const bgScale = interpolate(frame, [0, 900], [1.03, 1.08], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(160deg, #eef5ea 0%, #f7f3f5 100%)",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {bgImage && (
        <>
          <Img
            src={staticFile(bgImage)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${bgScale})`,
              filter: "blur(12px) saturate(0.65)",
            }}
          />
          {/* Soft veil so the card, characters and subtitles stay legible */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(250,252,246,0.70) 0%, rgba(250,252,246,0.64) 55%, rgba(230,239,227,0.82) 100%)",
            }}
          />
        </>
      )}

      <div
        style={{
          position: "absolute",
          bottom: `${1080 - SAFE.bottom}px`,
          right: `${1920 - SAFE.right}px`,
          color: "#405d4c",
          fontSize: "14px",
          fontWeight: 600,
          textShadow: "0 1px 2px rgba(255,255,255,0.8)",
          zIndex: 30,
        }}
      >
        背景：みんちりえ
      </div>
    </div>
  );
};
