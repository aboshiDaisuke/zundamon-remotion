import React from "react";
import { Img, interpolate, spring, staticFile, useVideoConfig } from "remotion";

interface DualCharactersProps {
  currentSpeaker: "zundamon" | "metan";
  isSpeaking: boolean;
  sceneFrame: number;
  sceneIndex: number;
}

export const DualCharacters: React.FC<DualCharactersProps> = ({
  currentSpeaker,
  isSpeaking,
  sceneFrame,
  sceneIndex,
}) => {
  const { fps } = useVideoConfig();

  // Speaking subtle bounce / breathing animation
  const zundaSpeaking = currentSpeaker === "zundamon" && isSpeaking;
  const metanSpeaking = currentSpeaker === "metan" && isSpeaking;

  const zundaBounce = zundaSpeaking ? Math.sin(sceneFrame * 0.4) * 8 : 0;
  const metanBounce = metanSpeaking ? Math.sin(sceneFrame * 0.4) * 8 : 0;

  // Active / inactive scale & brightness
  const zundaScale = zundaSpeaking ? 1.03 : 0.96;
  const metanScale = metanSpeaking ? 1.03 : 0.96;

  const zundaBrightness = zundaSpeaking ? 1.02 : 0.88;
  const metanBrightness = metanSpeaking ? 1.02 : 0.88;

  // Lip-sync timing: toggle mouth open/close every 4 frames (approx 0.13s) when speaking
  const isZundaMouthOpen = zundaSpeaking && Math.floor(sceneFrame / 4) % 2 === 0;
  const isMetanMouthOpen = metanSpeaking && Math.floor(sceneFrame / 4) % 2 === 0;

  // Dynamic image selection for Shikoku Metan
  const getMetanImage = () => {
    let base = "characters/metan_talk";
    switch (sceneIndex) {
      case 0: // オープニング（誇らしげ）
        base = "characters/metan_proud";
        break;
      case 1: // ずんだもん自虐①電車ゼロ（困り顔・苦笑）
        base = "characters/metan_troubled";
        break;
      case 2: // ずんだもん自虐②駅前閑散・イオン混雑（驚き）
        base = "characters/metan_surprise";
        break;
      case 3: // めたん自虐③百貨店消滅（困り顔）
        base = "characters/metan_troubled";
        break;
      case 4: // ずんだもん自虐④阿波踊り落差（呆れ・困り）
        base = "characters/metan_troubled";
        break;
      case 5: // めたん自虐⑤実質関西（ひそひそ・得意げ）
        base = "characters/metan_whisper";
        break;
      case 6: // ずんだもん自虐⑥ラーメン濃すぎ（驚き）
        base = "characters/metan_surprise";
        break;
      case 7: // めたん自虐⑦小男鹿高すぎ（上品・目閉じ）
        base = "characters/metan_closed";
        break;
      case 8: // ずんだもん自虐⑧ごめんなさいの味（苦笑い）
        base = "characters/metan_troubled";
        break;
      case 9: // フィナーレ（誇らしげに案内）
        base = "characters/metan_proud";
        break;
      default:
        base = metanSpeaking ? "characters/metan_talk" : "characters/metan_proud";
    }

    const state = isMetanMouthOpen ? "_open.png" : "_close.png";
    return base + state;
  };

  // Dynamic image selection for Zundamon (Self-deprecating, inward-facing)
  const getZundaImage = () => {
    let base = "characters/zunda_listen";
    switch (sceneIndex) {
      case 0: // めたんオープニング（冷めた目・傾聴）
        base = "characters/zunda_listen";
        break;
      case 1: // 自虐①電車ゼロ（ショック・青ざめ）
        base = "characters/zunda_shocked";
        break;
      case 2: // 自虐②イオン大渋滞＆神戸ナンバーコンプレックス（解説 -> ショック・悔しがり）
        base = sceneFrame < 230 ? "characters/zunda_explain" : "characters/zunda_shocked";
        break;
      case 3: // めたん自虐③百貨店消滅（ドヤ顔・ツッコミ）
        base = "characters/zunda_proud";
        break;
      case 4: // 自虐④阿波踊り狂乱と静寂（踊り -> 困り）
        base = sceneFrame < 150 ? "characters/zunda_dance" : "characters/zunda_apology";
        break;
      case 5: // めたん自虐⑤実質関西（傾聴）
        base = "characters/zunda_listen";
        break;
      case 6: // 自虐⑥徳島ラーメン濃すぎ（よだれ・お腹空いた）
        base = "characters/zunda_hungry";
        break;
      case 7: // めたん自虐⑦小男鹿（傾聴）
        base = "characters/zunda_listen";
        break;
      case 8: // 自虐⑧ごめんなさいの味（謝罪・平身低頭）
        base = sceneFrame < 130 ? "characters/zunda_explain" : "characters/zunda_apology";
        break;
      case 9: // フィナーレ（満面の笑顔）
        base = "characters/zunda_smile";
        break;
      default:
        base = zundaSpeaking ? "characters/zunda_explain" : "characters/zunda_listen";
    }

    const state = isZundaMouthOpen ? "_open.png" : "_close.png";
    return base + state;
  };

  return (
    <>
      {/* ===== Zundamon (Left Side, Inward-Facing: scaleX(-1)) ===== */}
      <div
        style={{
          position: "absolute",
          left: "10px",
          bottom: "120px",
          width: "440px",
          height: "690px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          zIndex: zundaSpeaking ? 20 : 10,
          transform: `scaleX(-1) translateY(${zundaBounce}px) scale(${zundaScale})`,
          filter: `brightness(${zundaBrightness}) drop-shadow(0 15px 25px rgba(0,0,0,${zundaSpeaking ? "0.22" : "0.10"}))`,
          transition: "filter 0.25s ease, transform 0.25s ease",
        }}
      >
        {/* Zundamon Active Glow Ring when speaking */}
        {zundaSpeaking && (
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              width: "340px",
              height: "55px",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(129, 199, 132, 0.45) 0%, rgba(129, 199, 132, 0) 70%)",
              zIndex: -1,
            }}
          />
        )}

        {/* Zundamon Image (flipped horizontally) */}
        <Img
          src={staticFile(getZundaImage())}
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />

        {/* Name Pill (Green) - Floating above head (un-flipped scaleX(-1) so text is normal) */}
        <div
          style={{
            position: "absolute",
            top: "-45px",
            left: "50%",
            transform: "translateX(-50%) scaleX(-1)",
            background: zundaSpeaking
              ? "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)"
              : "rgba(46, 125, 50, 0.85)",
            color: "#ffffff",
            padding: "5px 20px",
            borderRadius: "20px",
            fontSize: "17px",
            fontWeight: 800,
            letterSpacing: "0.5px",
            boxShadow: zundaSpeaking
              ? "0 4px 16px rgba(46, 125, 50, 0.45)"
              : "0 2px 8px rgba(0, 0, 0, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            border: "2px solid rgba(255, 255, 255, 0.95)",
            zIndex: 10,
          }}
        >
          <span>🌱</span>
          <span>ずんだもん</span>
        </div>
      </div>

      {/* ===== Shikoku Metan (Right Side, Outward/Forward Facing) ===== */}
      <div
        style={{
          position: "absolute",
          right: "10px",
          bottom: "120px",
          width: "440px",
          height: "700px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          zIndex: metanSpeaking ? 20 : 10,
          transform: `translateY(${metanBounce}px) scale(${metanScale})`,
          filter: `brightness(${metanBrightness}) drop-shadow(0 15px 25px rgba(0,0,0,${metanSpeaking ? "0.22" : "0.10"}))`,
          transition: "filter 0.25s ease, transform 0.25s ease",
        }}
      >
        {/* Metan Active Glow Ring when speaking */}
        {metanSpeaking && (
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              width: "360px",
              height: "60px",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(240, 98, 146, 0.45) 0%, rgba(240, 98, 146, 0) 70%)",
              zIndex: -1,
            }}
          />
        )}

        {/* Metan Image */}
        <Img
          src={staticFile(getMetanImage())}
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />

        {/* Name Pill (Pink) - Floating cleanly ABOVE head and hair decorations */}
        <div
          style={{
            position: "absolute",
            top: "-55px",
            left: "50%",
            transform: "translateX(-50%)",
            background: metanSpeaking
              ? "linear-gradient(135deg, #d81b60 0%, #ad1457 100%)"
              : "rgba(216, 27, 96, 0.85)",
            color: "#ffffff",
            padding: "5px 20px",
            borderRadius: "20px",
            fontSize: "17px",
            fontWeight: 800,
            letterSpacing: "0.5px",
            boxShadow: metanSpeaking
              ? "0 4px 16px rgba(216, 27, 96, 0.45)"
              : "0 2px 8px rgba(0, 0, 0, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            border: "2px solid rgba(255, 255, 255, 0.95)",
            zIndex: 10,
          }}
        >
          <span>🌸</span>
          <span>四国めたん</span>
        </div>
      </div>
    </>
  );
};

