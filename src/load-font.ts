import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

let globalLoaded = false;

export const useEnsureKeiFont = () => {
  const [handle] = useState(() => {
    if (globalLoaded || typeof window === "undefined") return null;
    return delayRender("Loading KeiFontFamily");
  });

  useEffect(() => {
    if (!handle) return;
    if (globalLoaded) {
      continueRender(handle);
      return;
    }

    const font = new FontFace(
      "KeiFontFamily",
      `url(${staticFile("fonts/keifont.ttf")})`
    );

    font
      .load()
      .then((f) => {
        document.fonts.add(f);
        document.fonts.ready.then(() => {
          globalLoaded = true;
          continueRender(handle);
        });
      })
      .catch((err) => {
        console.warn("Font load warning:", err);
        continueRender(handle);
      });
  }, [handle]);
};

export const KEI_FONT = "'KeiFontFamily', sans-serif";
