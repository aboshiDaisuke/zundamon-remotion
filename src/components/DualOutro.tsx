import React from "react";
import {
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "./Background";
import { KEI_FONT } from "../load-font";
import { CHARACTER, SUBTITLE } from "../layout";

// ~6.7 seconds at 30fps: characters wave → thanks title → credits → iris out
export const OUTRO_FRAMES = 200;

const IRIS_START = 138;
const IRIS_END = 168;

const CONFETTI_COLORS = ["#7cc243", "#f06292", "#ffd54f", "#81d4fa", "#ffffff"];
const CONFETTI = Array.from({ length: 56 }, (_, i) => ({
  x: random(`x${i}`) * 1920,
  delay: random(`d${i}`) * 50,
  speed: 5 + random(`s${i}`) * 4,
  sway: 20 + random(`w${i}`) * 40,
  size: 12 + random(`z${i}`) * 12,
  spin: (random(`r${i}`) - 0.5) * 16,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
}));

export const DualOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const charIn = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
  const titleIn = spring({ frame: frame - 8, fps, config: { damping: 10, stiffness: 140 } });
  const subIn = interpolate(frame, [26, 38], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const creditIn = interpolate(frame, [40, 54], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Characters hop twice together, then keep waving (mouth toggles like a cheer)
  const hop = frame >= 10 && frame < 40 ? Math.abs(Math.sin(((frame - 10) / 15) * Math.PI)) * 22 : 0;
  const mouthOpen = frame < 60 && Math.floor(frame / 5) % 2 === 0;

  // Iris-out: the scene shrinks into a circle on the center, then closes
  const irisRadius = interpolate(frame, [IRIS_START, IRIS_END], [1200, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t * t,
  });

  const endIn = spring({ frame: frame - IRIS_END, fps, config: { damping: 12, stiffness: 160 } });

  const figure = (left: number, flip: boolean): React.CSSProperties => ({
    position: "absolute",
    left: `${left}px`,
    bottom: `${CHARACTER.bottom}px`,
    width: `${CHARACTER.width}px`,
    height: `${CHARACTER.height}px`,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    transformOrigin: "bottom center",
    transform: `translateY(${(1 - charIn) * 300 - hop}px)${flip ? " scaleX(-1)" : ""}`,
    filter: "drop-shadow(0 12px 18px rgba(0,0,0,0.18))",
    zIndex: 20,
  });

  return (
    <div style={{ position: "absolute", inset: 0, background: "#10230f" }}>
      {/* Shown after the iris closes */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "64px",
          fontFamily: KEI_FONT,
          color: "#ffffff",
          letterSpacing: "12px",
          opacity: endIn,
          transform: `scale(${0.8 + endIn * 0.2})`,
        }}
      >
        おしまい
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `circle(${irisRadius}px at 50% 46%)`,
        }}
      >
        <Background bgImage="backgrounds/minchirie_living.jpg" />

        {/* Confetti */}
        {CONFETTI.map((c, i) => {
          const t = frame - c.delay;
          if (t < 0) return null;
          const y = -40 + t * c.speed;
          const x = c.x + Math.sin(t * 0.08 + i) * c.sway;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${x}px`,
                top: `${y}px`,
                width: `${c.size}px`,
                height: `${c.size * 0.6}px`,
                background: c.color,
                borderRadius: "2px",
                transform: `rotate(${t * c.spin}deg) scaleY(${Math.cos(t * 0.15 + i)})`,
                zIndex: 25,
              }}
            />
          );
        })}

        {/* Thanks title */}
        <div
          style={{
            position: "absolute",
            top: "250px",
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            zIndex: 30,
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.97)",
              borderRadius: "28px",
              padding: "24px 56px 28px",
              boxShadow: "0 14px 40px rgba(20, 50, 20, 0.22)",
              borderBottom: "8px solid #1b5e20",
              transform: `scale(${0.6 + titleIn * 0.4})`,
              opacity: Math.min(1, titleIn * 1.5),
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "72px",
                fontFamily: KEI_FONT,
                color: "#1b5e20",
                letterSpacing: "2px",
                lineHeight: 1.25,
              }}
            >
              ご視聴ありがとう
              <br />
              ございました！
            </div>
          </div>
          <div
            style={{
              fontSize: "36px",
              fontFamily: KEI_FONT,
              color: "#ffffff",
              background: "#c2185b",
              padding: "8px 32px",
              borderRadius: "999px",
              opacity: subIn,
              transform: `translateY(${(1 - subIn) * 16}px)`,
            }}
          >
            汽車に乗って、徳島市で会いましょう！
          </div>
        </div>

        {/* Credits */}
        <div
          style={{
            position: "absolute",
            top: `${SUBTITLE.top}px`,
            left: "50%",
            transform: "translateX(-50%)",
            width: `${SUBTITLE.width}px`,
            textAlign: "center",
            fontSize: "22px",
            fontFamily: KEI_FONT,
            lineHeight: 1.7,
            color: "#ffffff",
            textShadow: "0 1px 4px rgba(0,0,0,0.6)",
            opacity: creditIn,
            zIndex: 30,
          }}
        >
          VOICEVOX:ずんだもん ／ VOICEVOX:四国めたん ／ 立ち絵素材: 坂本アヒル様
          <br />
          フォント: けいフォント ／ 背景: みんちりえ ／ BGM: しゃろう
        </div>

        <div style={figure(CHARACTER.zundaLeft, true)}>
          <Img
            src={staticFile(`characters/zunda_greeting_${mouthOpen ? "open" : "close"}.png`)}
            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
          />
        </div>
        <div style={figure(CHARACTER.metanLeft, false)}>
          <Img
            src={staticFile(`characters/metan_proud_${mouthOpen ? "open" : "close"}.png`)}
            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
};
