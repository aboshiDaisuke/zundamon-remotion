import React from "react";
import { Img, spring, staticFile, useVideoConfig } from "remotion";
import { KEI_FONT } from "../load-font";

interface DualTopicCardProps {
  topic: string;
  sub: string;
  points: string[];
  category: string;
  imageIndex: number;
  image?: string;
  imageLabel?: string;
  emotion?: string;
  sceneFrame: number;
  sceneIndex: number;
  topicNum?: number;
}

const DUAL_ILLUSTRATIONS: Record<number, { image: string; label: string }> = {
  0: {
    image: "images/card_scene1_bizan.jpg",
    label: "📍 眉山山頂から望む水都パノラマ",
  },
  1: {
    image: "images/card_scene2_diesel.jpg",
    label: "📍 電車ゼロ！ディーゼル汽車が走る街",
  },
  2: {
    image: "images/card_scene3_kobe.jpg",
    label: "📍 イオン駐車場＆謎の神戸ナンバー（淡路島）",
  },
  3: {
    image: "images/pure_illust/illust_scene4_closed.jpg",
    label: "📍 そごう閉店・県内デパート消滅の現実",
  },
  4: {
    image: "images/anime/art_scene5_awaodori.jpg",
    label: "📍 阿波踊り狂乱の4日間と残り361日",
  },
  5: {
    image: "images/pure_illust/illust_scene6_kansai.jpg",
    label: "📍 大阪のTVが映る！実質関西圏疑惑",
  },
  6: {
    image: "images/anime/art_scene7_ramen.jpg",
    label: "📍 濃すぎ徳島ラーメン＆山盛り白ご飯",
  },
  7: {
    image: "images/anime/art_scene8_saoshika.jpg",
    label: "📍 高級和菓子「小男鹿」高嶺の花",
  },
  8: {
    image: "images/pure_illust/illust_scene9_apology.jpg",
    label: "📍 誠意の最終兵器「ごめんなさいの味」",
  },
  9: {
    image: "images/pure_illust/illust_scene10_welcome.jpg",
    label: "📍 水都とグルメの街・徳島市へようこそ！",
  },
};

export const DualTopicCard: React.FC<DualTopicCardProps> = ({
  topic,
  sub,
  points,
  category,
  imageIndex,
  image,
  imageLabel,
  emotion = "🌸",
  sceneFrame,
  sceneIndex,
  topicNum,
}) => {
  const { fps } = useVideoConfig();

  const cardEntrance = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  const photoEntrance = spring({
    frame: sceneFrame - 3,
    fps,
    config: { damping: 13, stiffness: 100 },
  });

  const kenBurnsScale = 1.0 + Math.min(sceneFrame / (fps * 15), 1) * 0.05;
  const currentIllustration = image
    ? { image, label: imageLabel || DUAL_ILLUSTRATIONS[sceneIndex]?.label || "📍 徳島市PR" }
    : DUAL_ILLUSTRATIONS[sceneIndex] || DUAL_ILLUSTRATIONS[0];

  const displayNum = topicNum !== undefined ? topicNum : sceneIndex + 1;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "70px",
        transform: `translateX(-50%) translateY(${(1 - cardEntrance) * 20}px) scale(${0.97 + cardEntrance * 0.03})`,
        width: "860px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 15,
        opacity: cardEntrance,
      }}
    >
      {/* 1. Header Bar (Clean, Balanced & Centered Hierarchy) */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(16px)",
          borderRadius: "18px",
          padding: "10px 24px 12px 24px",
          border: "2px solid #81c784",
          boxShadow: "0 6px 20px rgba(46, 125, 50, 0.14)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {/* Category Badge (Centered, Elegant) */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)",
            color: "#ffffff",
            padding: "5px 22px",
            borderRadius: "12px",
            fontSize: "16px",
            fontFamily: KEI_FONT,
            letterSpacing: "0.8px",
            boxShadow: "0 2px 6px rgba(27, 94, 32, 0.3)",
            border: "1.5px solid rgba(255, 255, 255, 0.7)",
          }}
        >
          <span style={{ fontSize: "16px" }}>{emotion}</span>
          <span>徳島市PR #{displayNum} ｜ {category}</span>
        </div>

        {/* Main Topic Title (Keifont, 38px, Grand, Crisp & Centered) */}
        <h2
          style={{
            margin: 0,
            fontSize: "38px",
            fontFamily: KEI_FONT,
            color: "#1b5e20",
            letterSpacing: "0.5px",
            textAlign: "center",
            lineHeight: "1.22",
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.08)",
          }}
        >
          {topic}
        </h2>
      </div>

      {/* 2. Main Illustration Stage (Crisp 16:9 Aspect, 100% Visible) */}
      <div
        style={{
          width: "860px",
          height: "385px",
          borderRadius: "18px",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 14px 32px rgba(0, 0, 0, 0.18)",
          border: "3.5px solid #ffffff",
          opacity: photoEntrance,
          transform: `scale(${0.96 + photoEntrance * 0.04})`,
          background: "#1c2b1c",
        }}
      >
        {/* Ambient Blur Background */}
        <Img
          src={staticFile(currentIllustration.image)}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(24px) brightness(0.75)",
            transform: "scale(1.15)",
          }}
        />

        {/* Crisp Foreground Illustration */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            padding: "6px 10px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <Img
            src={staticFile(currentIllustration.image)}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              transform: `scale(${kenBurnsScale})`,
              transformOrigin: "center center",
            }}
          />
        </div>
      </div>

      {/* 3. Explanation Points (Significantly Enlarged 23px Keifont + Left Accent Bar) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {points.map((point, pIdx) => {
          const pointSpring = spring({
            frame: sceneFrame - (3 + pIdx * 4),
            fps,
            config: { damping: 12, stiffness: 140 },
          });

          return (
            <div
              key={pIdx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                background: "rgba(255, 255, 255, 0.98)",
                backdropFilter: "blur(14px)",
                padding: "10px 20px 10px 16px",
                borderRadius: "14px",
                border: "1.5px solid rgba(165, 214, 167, 0.9)",
                borderLeft: "6px solid #2e7d32",
                boxShadow: "0 4px 14px rgba(46, 125, 50, 0.10)",
                opacity: pointSpring,
                transform: `translateX(${(1 - pointSpring) * 16}px)`,
              }}
            >
              {/* Point Number Badge */}
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "15px",
                  fontFamily: KEI_FONT,
                  flexShrink: 0,
                  boxShadow: "0 2px 6px rgba(27, 94, 32, 0.3)",
                }}
              >
                {pIdx + 1}
              </div>
              {/* Point Text (Enlarged to 24px with Keifont, Highly Legible & Clear) */}
              <span
                style={{
                  fontSize: "24px",
                  fontFamily: KEI_FONT,
                  color: "#144a18",
                  lineHeight: "1.32",
                  letterSpacing: "0.3px",
                  textShadow: "0 1px 0 rgba(255, 255, 255, 0.8)",
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

