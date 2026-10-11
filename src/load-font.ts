import { useEffect, useState } from 'react';
import { cancelRender, continueRender, delayRender, staticFile } from 'remotion';

let fontPromise: Promise<void> | undefined;
export const KEI_FONT = "'KeiFontFamily', sans-serif";
export const useEnsureKeiFont = () => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender('けいフォントを読み込み中'));
  useEffect(() => {
    fontPromise ??= (async () => {
      const face = await new FontFace('KeiFontFamily', `url(${staticFile('fonts/keifont.ttf')})`).load();
      document.fonts.add(face);
      await document.fonts.ready;
    })();
    fontPromise.then(() => { setReady(true); continueRender(handle); }).catch(cancelRender);
  }, [handle]);
  return ready;
};
