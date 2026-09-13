import React from "react";
import "./fonts.css";
import { Composition } from "remotion";
import { DualExplainer } from "./DualExplainer";
import { ZundamonExplainer } from "./ZundamonExplainer";
import dualSceneData from "./dual_scene_data.json";
import sceneData from "./scene_data.json";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ずんだもん ＆ 四国めたん 掛け合い版（メイン） */}
      <Composition
        id="DualExplainer"
        component={DualExplainer}
        durationInFrames={dualSceneData.totalFrames}
        fps={dualSceneData.fps}
        width={1920}
        height={1080}
      />

      {/* ずんだもんソロ版 */}
      <Composition
        id="ZundamonExplainer"
        component={ZundamonExplainer}
        durationInFrames={sceneData.totalFrames}
        fps={sceneData.fps}
        width={1920}
        height={1080}
      />
    </>
  );
};
