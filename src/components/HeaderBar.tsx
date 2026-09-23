import React from "react";
import { KEI_FONT } from "../load-font";
import { HEADER, SAFE } from "../layout";

interface HeaderBarProps {
  isSpeaking?: boolean;
  subTitle?: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ subTitle }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: `${HEADER.top}px`,
        left: `${SAFE.left}px`,
        width: `${SAFE.right - SAFE.left}px`,
        height: `${HEADER.height}px`,
        display: "flex",
        alignItems: "stretch",
        justifyContent: "space-between",
        gap: "32px",
        zIndex: 30,
      }}
    >
      {/* Left: Program title (two lines so both telops fit inside title safe) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "rgba(255, 255, 255, 0.95)",
          padding: "0 24px",
          borderRadius: "14px",
          borderLeft: "8px solid #1b5e20",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
          fontFamily: KEI_FONT,
          color: "#1b5e20",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontSize: "15px", lineHeight: 1.2, letterSpacing: "1px" }}>
          徳島県徳島市 シティプロモーション
        </span>
        <span style={{ fontSize: "30px", lineHeight: 1.15, letterSpacing: "1px" }}>
          〜阿波おどりと水都のまち〜
        </span>
      </div>

      {/* Right: Corner telop (gold frame + deep green) */}
      {subTitle && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)",
            color: "#ffffff",
            padding: "0 28px",
            borderRadius: "14px",
            border: "3px solid #ffd54f",
            boxShadow: "0 4px 12px rgba(27, 94, 32, 0.3)",
            fontSize: "30px",
            fontFamily: KEI_FONT,
            letterSpacing: "1px",
            whiteSpace: "nowrap",
          }}
        >
          {subTitle}
        </div>
      )}
    </div>
  );
};
