// 1920x1080 layout grid built on broadcast safe areas.
// Title safe (5%): text never leaves x 96–1824 / y 54–1026.
// Action safe (3.5%): characters stay within x 67–1853.
export const SAFE = { left: 96, right: 1824, top: 54, bottom: 1026 };

// Header telops: y 54–118
export const HEADER = { top: SAFE.top, height: 64 };

// Center card: y 150–760, 150px clear of the subtitle
export const CARD = { top: 150, width: 860, height: 610 };

// Subtitle: y 910–1020
export const SUBTITLE = { top: 910, width: 1380, height: 110 };

// Characters: feet end at y 900 so they never touch the subtitle
export const CHARACTER = {
  width: 450,
  height: 760,
  bottom: 180,
  zundaLeft: 70,
  metanLeft: 1400,
};
