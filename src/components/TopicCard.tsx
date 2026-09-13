import React from "react";
import { spring, useVideoConfig, staticFile, Img } from "remotion";

interface TopicCardProps {
  topic: string;
  sub: string;
  points: string[];
  category?: string;
  emotion?: string;
  sceneIndex: number;
  sceneFrame: number;
}

// 徳島市各シーンに対応するアニメ調イラストとスポット名
const SCENE_ILLUSTRATIONS: Record<number, { image: string; label: string }> = {
  0: {
    image: "images/art_scene1_view.png",
    label: "📍 眉山山頂から望む水都パノラマ",
  },
  1: {
    image: "images/art_scene2_cruise.png",
    label: "📍 新町川水際公園・ひょうたん島",
  },
  2: {
    image: "images/card_scene3_kobe.jpg",
    label: "📍 イオン駐車場＆謎の神戸ナンバー（淡路島）",
  },
  3: {
    image: "images/art_scene4_bizan.png",
    label: "📍 徳島市のシンボル 眉山（標高290m）",
  },
  4: {
    image: "images/art_scene5_gourmet.png",
    label: "📍 徳島ラーメン ＆ 特産すだち",
  },
  5: {
    image: "images/art_scene_saoshika.png",
    label: "📍 徳島伝統銘菓 冨士屋「小男鹿」",
  },
  6: {
    image: "images/art_scene_saoshika.png",
    label: "📍 徳島県人御用達「ごめんなさいの味」",
  },
  7: {
    image: "images/art_scene6_castle.png",
    label: "📍 蜂須賀公ゆかり 徳島城跡 鷲の門",
  },
  8: {
    image: "images/art_scene7_park.png",
    label: "📍 水と緑豊かな城下町 徳島中央公園",
  },
};

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  sub,
  points,
  category = "市政情報",
  emotion = "🌸",
  sceneIndex,
  sceneFrame,
}) => {
  const { fps } = useVideoConfig();

  // Entrance spring for main card
  const cardEntrance = spring({
    frame: sceneFrame,
    fps,
    config: {
      damping: 14,
      stiffness: 110,
    },
  });

  // Photo subtle entrance & Ken Burns effect (slow gentle zoom)
  const photoEntrance = spring({
    frame: sceneFrame - 4,
    fps,
    config: { damping: 13, stiffness: 100 },
  });

  // Slow zoom effect: 1.0 to 1.05 over time
  const kenBurnsScale = 1.0 + Math.min(sceneFrame / (fps * 15), 1) * 0.06;

  const currentIllustration = SCENE_ILLUSTRATIONS[sceneIndex] || SCENE_ILLUSTRATIONS[0];

  return (
    <div
      style={{
        position: "absolute",
        right: "35px",
        top: "115px",
        width: "1220px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        zIndex: 15,
        opacity: cardEntrance,
        transform: `translateX(${(1 - cardEntrance) * 50}px) scale(${0.94 + cardEntrance * 0.06})`,
      }}
    >
      {/* Tokushima Civic Category Pill */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "12px",
          alignSelf: "flex-start",
          background: "rgba(255, 255, 255, 0.95)",
          padding: "6px 20px",
          borderRadius: "24px",
          border: "2px solid #81c784",
          boxShadow: "0 6px 16px rgba(46, 125, 50, 0.12)",
        }}
      >
        <span style={{ fontSize: "22px" }}>{emotion}</span>
        <span
          style={{
            fontSize: "17px",
            fontWeight: "800",
            color: "#1b5e20",
            letterSpacing: "1px",
          }}
        >
          TOKUSHIMA CITY INFO #{sceneIndex + 1} ｜ {category}
        </span>
      </div>

      {/* Main 2-Column Banner Card (Left: Anime Illustration, Right: Info & Points) */}
      <div
        style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(244,250,244,0.98) 100%)",
          backdropFilter: "blur(18px)",
          borderRadius: "28px",
          padding: "24px 28px",
          border: "3px solid rgba(129, 199, 132, 0.45)",
          boxShadow: "0 20px 44px rgba(46, 125, 50, 0.12), inset 0 2px 4px rgba(255, 255, 255, 0.9)",
          display: "flex",
          flexDirection: "row",
          gap: "26px",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Left Column: Anime Art Photo Frame with Ken Burns effect */}
        <div
          style={{
            width: "470px",
            height: "275px",
            borderRadius: "20px",
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
            boxShadow: "0 10px 24px rgba(0, 0, 0, 0.14)",
            border: "3px solid #ffffff",
            opacity: photoEntrance,
            transform: `scale(${0.92 + photoEntrance * 0.08})`,
          }}
        >
          {/* Anime Art Image */}
          <Img
            src={staticFile(currentIllustration.image)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${kenBurnsScale})`,
              transformOrigin: "center center",
            }}
          />

          {/* Gradient Overlay for Tag Visibility */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60px",
              background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Spot Name Label Tag */}
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "12px",
              background: "rgba(27, 94, 32, 0.9)",
              backdropFilter: "blur(6px)",
              color: "#ffffff",
              padding: "4px 14px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 700,
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              letterSpacing: "0.5px",
            }}
          >
            {currentIllustration.label}
          </div>
        </div>

        {/* Right Column: Title, Sub, and Points */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            minWidth: 0,
          }}
        >
          {/* Header Row: Stacked Title & Sub for clean typography */}
          <div
            style={{
              borderBottom: "2px solid rgba(129, 199, 132, 0.3)",
              paddingBottom: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "4px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "34px",
                  fontFamily: "'keifont', sans-serif",
                  color: "#1b5e20",
                  letterSpacing: "-0.5px",
                  whiteSpace: "nowrap",
                }}
              >
                {topic}
              </h2>

              <span
                style={{
                  fontSize: "16px",
                  fontFamily: "'keifont', sans-serif",
                  color: "#2e7d32",
                  background: "rgba(76, 175, 80, 0.14)",
                  padding: "4px 14px",
                  borderRadius: "10px",
                  whiteSpace: "nowrap",
                }}
              >
                {sub}
              </span>
            </div>
          </div>

          {/* Bullet Key Points */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {points.map((point, pIdx) => {
              const pointSpring = spring({
                frame: sceneFrame - (6 + pIdx * 5),
                fps,
                config: { damping: 12, stiffness: 140 },
              });

              return (
                <div
                  key={pIdx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background: "rgba(255, 255, 255, 0.95)",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    border: "1.5px solid rgba(200, 230, 201, 0.9)",
                    borderLeft: "5px solid #2e7d32",
                    boxShadow: "0 2px 8px rgba(46, 125, 50, 0.08)",
                    opacity: pointSpring,
                    transform: `translateX(${(1 - pointSpring) * 20}px)`,
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "#1b5e20",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontFamily: "'keifont', sans-serif",
                      flexShrink: 0,
                    }}
                  >
                    {pIdx + 1}
                  </div>
                  <span
                    style={{
                      fontSize: "22px",
                      fontFamily: "'keifont', sans-serif",
                      color: "#144a18",
                      lineHeight: "1.3",
                    }}
                  >
                    {point}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
