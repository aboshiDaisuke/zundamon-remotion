import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { CHARACTER } from "../layout";

interface DualCharactersProps {
  currentSpeaker: "zundamon" | "metan";
  isSpeaking: boolean;
  sceneFrame: number;
  /** 0-based topic index (scenes 3_1〜3_5 share one topic) */
  topicIndex: number;
  /** Frames since this topic first appeared */
  topicFrame: number;
  /** Frames since the current speaker started talking (drives the one-time hop) */
  speakFrame: number;
}

export const DualCharacters: React.FC<DualCharactersProps> = ({
  currentSpeaker,
  isSpeaking,
  sceneFrame,
  topicIndex,
  topicFrame,
  speakFrame,
}) => {
  const zundaSpeaking = currentSpeaker === "zundamon" && isSpeaking;
  const metanSpeaking = currentSpeaker === "metan" && isSpeaking;

  // One small hop right when a line starts, then stand still
  const hop =
    speakFrame >= 0 && speakFrame < 10 ? Math.sin((speakFrame / 10) * Math.PI) * 16 : 0;
  const activeScale = interpolate(speakFrame, [0, 6], [0.97, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const zundaLift = zundaSpeaking ? hop : 0;
  const metanLift = metanSpeaking ? hop : 0;
  const zundaScale = zundaSpeaking ? activeScale : 0.97;
  const metanScale = metanSpeaking ? activeScale : 0.97;
  const zundaBrightness = zundaSpeaking ? 1 : 0.9;
  const metanBrightness = metanSpeaking ? 1 : 0.9;

  // Lip-sync timing: toggle mouth open/close every 4 frames (approx 0.13s) when speaking
  const isZundaMouthOpen = zundaSpeaking && Math.floor(sceneFrame / 4) % 2 === 0;
  const isMetanMouthOpen = metanSpeaking && Math.floor(sceneFrame / 4) % 2 === 0;

  // Dynamic image selection for Shikoku Metan
  const getMetanImage = () => {
    let base = "characters/metan_talk";
    switch (topicIndex) {
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
    switch (topicIndex) {
      case 0: // めたんオープニング（冷めた目・傾聴）
        base = "characters/zunda_listen";
        break;
      case 1: // 自虐①電車ゼロ（ショック・青ざめ）
        base = "characters/zunda_shocked";
        break;
      case 2: // 自虐②イオン大渋滞＆神戸ナンバーコンプレックス（解説 -> ショック・悔しがり）
        base = topicFrame < 230 ? "characters/zunda_explain" : "characters/zunda_shocked";
        break;
      case 3: // めたん自虐③百貨店消滅（ドヤ顔・ツッコミ）
        base = "characters/zunda_proud";
        break;
      case 4: // 自虐④阿波踊り狂乱と静寂（踊り -> 困り）
        base = topicFrame < 150 ? "characters/zunda_dance" : "characters/zunda_apology";
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
        base = topicFrame < 130 ? "characters/zunda_explain" : "characters/zunda_apology";
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

  const figureStyle = (
    left: number,
    lift: number,
    scale: number,
    brightness: number,
    flip: boolean,
    front: boolean
  ): React.CSSProperties => ({
    position: "absolute",
    left: `${left}px`,
    bottom: `${CHARACTER.bottom}px`,
    width: `${CHARACTER.width}px`,
    height: `${CHARACTER.height}px`,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    transformOrigin: "bottom center",
    transform: `translateY(${-lift}px) scale(${scale})${flip ? " scaleX(-1)" : ""}`,
    filter: `brightness(${brightness}) drop-shadow(0 12px 18px rgba(0,0,0,0.18))`,
    zIndex: front ? 20 : 10,
  });

  const imgStyle: React.CSSProperties = {
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "contain",
  };

  return (
    <>
      {/* Zundamon: left, flipped to face inward */}
      <div style={figureStyle(CHARACTER.zundaLeft, zundaLift, zundaScale, zundaBrightness, true, zundaSpeaking)}>
        <Img src={staticFile(getZundaImage())} style={imgStyle} />
      </div>

      {/* Shikoku Metan: right */}
      <div style={figureStyle(CHARACTER.metanLeft, metanLift, metanScale, metanBrightness, false, metanSpeaking)}>
        <Img src={staticFile(getMetanImage())} style={imgStyle} />
      </div>
    </>
  );
};
