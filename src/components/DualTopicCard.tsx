import React from "react";
import { Img, spring, staticFile, useVideoConfig } from "remotion";
import { KEI_FONT } from "../load-font";
import { CARD } from "../layout";

interface DualTopicCardProps {
  topic: string;
  category: string;
  image: string;
  points: string[];
  topicNum: number;
  /** Frames since this topic first appeared (not reset when the same topic continues) */
  topicFrame: number;
}

const DEEP_GREEN = "#1b5e20";

export const DualTopicCard: React.FC<DualTopicCardProps> = ({
  topic,
  category,
  image,
  points,
  topicNum,
  topicFrame,
}) => {
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: topicFrame,
    fps,
    config: { damping: 200 },
    durationInFrames: 12,
  });

  const kenBurnsScale = 1 + Math.min(topicFrame / (fps * 15), 1) * 0.04;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: `${CARD.top}px`,
        width: `${CARD.width}px`,
        height: `${CARD.height}px`,
        transform: `translateX(-50%) translateY(${(1 - entrance) * 12}px)`,
        opacity: entrance,
        background: "rgba(255, 255, 255, 0.97)",
        borderRadius: "24px",
        boxShadow: "0 12px 36px rgba(20, 50, 20, 0.18)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        zIndex: 15,
      }}
    >
      {/* Category badge + heading */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          padding: "14px 24px 10px",
        }}
      >
        <div
          style={{
            background: DEEP_GREEN,
            color: "#ffffff",
            padding: "3px 18px",
            borderRadius: "999px",
            fontSize: "16px",
            fontFamily: KEI_FONT,
            letterSpacing: "0.8px",
          }}
        >
          徳島市PR #{topicNum} ｜ {category}
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: "38px",
            fontFamily: KEI_FONT,
            fontWeight: "normal",
            color: DEEP_GREEN,
            letterSpacing: "0.5px",
            lineHeight: 1.2,
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          {topic}
        </h2>
      </div>

      {/* Illustration (full width, 385px; card images are authored at 1720x770) */}
      <div
        style={{
          width: `${CARD.width}px`,
          height: "385px",
          flexShrink: 0,
          overflow: "hidden",
          background: "#dfe8da",
        }}
      >
        <Img
          src={staticFile(image)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${kenBurnsScale})`,
          }}
        />
      </div>

      {/* Explanation points: circled numbering + deep green bar */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "3px",
          margin: "10px 28px 10px 28px",
          paddingLeft: "18px",
          borderLeft: `6px solid ${DEEP_GREEN}`,
        }}
      >
        {points.map((point, i) => {
          const p = spring({
            frame: topicFrame - (6 + i * 4),
            fps,
            config: { damping: 200 },
            durationInFrames: 10,
          });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                opacity: p,
                transform: `translateX(${(1 - p) * 10}px)`,
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: DEEP_GREEN,
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontFamily: KEI_FONT,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <span
                style={{
                  fontSize: "24px",
                  fontFamily: KEI_FONT,
                  color: "#17301a",
                  lineHeight: 1.3,
                  letterSpacing: "0.3px",
                  whiteSpace: "nowrap",
                }}
              >
                {point}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
