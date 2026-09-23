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
              filter: "blur(6px) saturate(0.9)",
            }}
          />
          {/* Soft veil so the card, characters and subtitles stay legible */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.18) 55%, rgba(20,40,20,0.28) 100%)",
            }}
          />
        </>
      )}

      <div
        style={{
          position: "absolute",
          bottom: `${1080 - SAFE.bottom}px`,
          right: `${1920 - SAFE.right}px`,
          color: "rgba(255, 255, 255, 0.9)",
          fontSize: "14px",
          fontWeight: 600,
          textShadow: "0 1px 3px rgba(0,0,0,0.5)",
          zIndex: 30,
        }}
      >
        背景：みんちりえ
      </div>
    </div>
  );
};
