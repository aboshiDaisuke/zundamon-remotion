import React from "react";
import { SoundWave } from "./SoundWave";
import { KEI_FONT } from "../load-font";

interface HeaderBarProps {
  isSpeaking: boolean;
  subTitle?: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ isSpeaking, subTitle }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "8px",
        left: "40px",
        right: "40px",
        height: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 30,
      }}
    >
      {/* Left: Official City Emblem & Header Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "rgba(255, 255, 255, 0.96)",
          padding: "4px 18px 4px 12px",
          borderRadius: "14px",
          backdropFilter: "blur(12px)",
          border: "2px solid #81c784",
          boxShadow: "0 4px 12px rgba(46, 125, 50, 0.10)",
        }}
      >
        {/* Tokushima City Emblem Motif Badge */}
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1b5e20 0%, #0d47a1 100%)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: 900,
            border: "1.5px solid #a5d6a7",
            boxShadow: "0 2px 6px rgba(13, 71, 161, 0.2)",
          }}
        >
          徳
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                fontSize: "12px",
                fontFamily: KEI_FONT,
                color: "#1b5e20",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Tokushima City Official PR
            </span>
            <span
              style={{
                fontSize: "12px",
                fontFamily: KEI_FONT,
                background: "#e8f5e9",
                color: "#1b5e20",
                padding: "2px 8px",
                borderRadius: "6px",
                border: "1px solid #c8e6c9",
              }}
            >
              公式広報
            </span>
          </div>

          <span
            style={{
              fontSize: "19px",
              fontFamily: KEI_FONT,
              color: "#1b5e20",
              letterSpacing: "0.4px",
              lineHeight: "1.2",
            }}
          >
            徳島県徳島市 シティプロモーション 〜阿波おどりと水都のまち〜
          </span>
        </div>
      </div>

      {/* Right: Prominent TV-Style Top-Right Telop & Voice Indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {subTitle && (
          <div
            style={{
              background: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)",
              color: "#ffffff",
              padding: "7px 24px",
              borderRadius: "14px",
              border: "2px solid #ffd54f",
              boxShadow: "0 4px 14px rgba(27, 94, 32, 0.35)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ color: "#ffd54f", fontSize: "16px" }}>✦</span>
            <span
              style={{
                fontSize: "20px",
                fontFamily: KEI_FONT,
                letterSpacing: "0.6px",
                textShadow: "0 1px 2px rgba(0,0,0,0.4)",
              }}
            >
              {subTitle}
            </span>
          </div>
        )}
        <SoundWave isSpeaking={isSpeaking} />
      </div>
    </div>
  );
};
