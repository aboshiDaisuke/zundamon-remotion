// 1920×1080 / 30fps. All screen regions are defined here.
export const CANVAS = { width: 1920, height: 1080 };
export const SAFE = { left: 96, right: 1824, top: 54, bottom: 1026 };
export const HEADER = { top: SAFE.top, height: 64, leftWidth: 590, rightWidth: 970, gap: 32 };
export const CARD = {
  top: 150, width: 860, height: 610, headingHeight: 104, imageHeight: 385,
  padding: 28, pointGap: 5, pointHeight: 28,
};
export const SUBTITLE = {
  top: 910, width: 1380, height: 110, tagWidth: 152, padding: 24,
  gap: 24, textWidth: 1120, lineHeight: 1.3,
};
export const CHARACTER = {
  width: 450, height: 760, bottom: 180, zundaLeft: 70, metanLeft: 1400,
};
export const PROGRESS = { top: 786, width: 860, height: 38 };
