import React from "react";
import { interpolate, useCurrentFrame, staticFile, Img } from "remotion";

interface BackgroundProps {
  bgImage?: string;
}

export const Background: React.FC<BackgroundProps> = ({ bgImage }) => {
  const frame = useCurrentFrame();

  // Dynamic wave phase shifts (representing the water capital Tokushima / Yoshino river)
  const waveShift1 = (frame * 1.5) % 1920;
  const waveShift2 = (frame * 0.9) % 1920;

  // Gentle ambient background gradient angle shift
  const gradShift = interpolate(frame, [0, 900], [125, 145]);

  // Subtle zoom/pan effect for Minchirie background
  const bgScale = interpolate(frame, [0, 900], [1.02, 1.06], {
    extrapolateRight: "clamp",
  });

  // Ambient pulsating lighting
  const pulse1 = Math.sin(frame * 0.04) * 0.1 + 0.55;
  const pulse2 = Math.cos(frame * 0.035) * 0.1 + 0.45;

  // Floating bokeh particles (Zundamon emerald & Metan sakura pink)
  const bokehParticles = [
    { id: 1, x: 12, y: 35, size: 140, color: "rgba(165, 214, 167, 0.45)", speed: 0.7, offset: 0 },
    { id: 2, x: 88, y: 25, size: 160, color: "rgba(244, 143, 177, 0.40)", speed: 0.6, offset: 50 },
    { id: 3, x: 45, y: 65, size: 180, color: "rgba(129, 199, 132, 0.35)", speed: 0.5, offset: 120 },
    { id: 4, x: 20, y: 80, size: 110, color: "rgba(248, 187, 208, 0.40)", speed: 0.8, offset: 80 },
    { id: 5, x: 78, y: 75, size: 150, color: "rgba(178, 235, 242, 0.40)", speed: 0.55, offset: 30 },
    { id: 6, x: 50, y: 15, size: 90, color: "rgba(255, 255, 255, 0.65)", speed: 0.9, offset: 15 },
    { id: 7, x: 30, y: 40, size: 70, color: "rgba(200, 230, 201, 0.50)", speed: 1.1, offset: 65 },
    { id: 8, x: 70, y: 45, size: 85, color: "rgba(248, 187, 208, 0.45)", speed: 1.0, offset: 110 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: `linear-gradient(${gradShift}deg, #e8f5e9 0%, #e0f2f1 40%, #fce4ec 100%)`,
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* Minchirie Illustration Background Image (Cover full screen with gentle warmth) */}
      {bgImage && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          <Img
            src={staticFile(bgImage)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${bgScale})`,
              filter: "brightness(0.92) contrast(1.05) saturate(1.1)",
            }}
          />
          {/* Studio Vignette & Soft Ambient Overlay to keep characters & card popped */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.2) 50%, rgba(0,0,0,0.3) 100%)",
              backdropFilter: "blur(1.5px)",
            }}
          />
        </div>
      )}

      {/* Credit Badge for Minchirie */}
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          right: "24px",
          background: "rgba(0, 0, 0, 0.55)",
          color: "rgba(255, 255, 255, 0.9)",
          padding: "4px 12px",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: 600,
          letterSpacing: "0.5px",
          zIndex: 30,
          pointerEvents: "none",
        }}
      >
        背景：みんちりえ
      </div>
      {/* Large Ambient Glow Orbs */}
      <div
        style={{
          position: "absolute",
          top: "-150px",
          left: "-100px",
          width: "900px",
          height: "900px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(129, 199, 132, ${pulse1}) 0%, rgba(129, 199, 132, 0) 70%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-180px",
          right: "-100px",
          width: "950px",
          height: "950px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(244, 143, 177, ${pulse2}) 0%, rgba(244, 143, 177, 0) 70%)`,
          filter: "blur(70px)",
        }}
      />

      {/* Floating Animated Bokeh Orbs */}
      {bokehParticles.map((p) => {
        const floatY = Math.sin((frame + p.offset) * 0.035 * p.speed) * 35;
        const floatX = Math.cos((frame + p.offset) * 0.025 * p.speed) * 20;
        const scale = 1 + Math.sin((frame + p.offset) * 0.04) * 0.08;

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              top: `${p.y}%`,
              left: `${p.x}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: "50%",
              background: p.color,
              transform: `translate(${floatX}px, ${floatY}px) scale(${scale})`,
              filter: "blur(12px)",
              opacity: 0.85,
            }}
          />
        );
      })}

      {/* Dynamic Animated Water Waves (Tokushima "Water Capital" Theme) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "380px",
          pointerEvents: "none",
          opacity: 0.65,
        }}
      >
        {/* Wave Layer 1 (Slower, Cyan-Green) */}
        <svg
          viewBox="0 0 1920 320"
          style={{
            position: "absolute",
            bottom: "20px",
            width: "3840px",
            height: "220px",
            transform: `translateX(-${waveShift1}px)`,
          }}
        >
          <path
            d="M 0,160 Q 480,240 960,160 T 1920,160 Q 2400,240 2880,160 T 3840,160 L 3840,320 L 0,320 Z"
            fill="url(#waveGrad1)"
          />
          <defs>
            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(165, 214, 167, 0.35)" />
              <stop offset="50%" stopColor="rgba(128, 203, 196, 0.40)" />
              <stop offset="100%" stopColor="rgba(165, 214, 167, 0.35)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Wave Layer 2 (Faster, Pink-Aqua) */}
        <svg
          viewBox="0 0 1920 320"
          style={{
            position: "absolute",
            bottom: "0px",
            width: "3840px",
            height: "180px",
            transform: `translateX(-${waveShift2}px)`,
          }}
        >
          <path
            d="M 0,140 Q 480,60 960,140 T 1920,140 Q 2400,60 2880,140 T 3840,140 L 3840,320 L 0,320 Z"
            fill="url(#waveGrad2)"
          />
          <defs>
            <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(244, 143, 177, 0.25)" />
              <stop offset="50%" stopColor="rgba(178, 235, 242, 0.30)" />
              <stop offset="100%" stopColor="rgba(244, 143, 177, 0.25)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Subtle modern geometric dot pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `
            radial-gradient(circle at 25px 25px, rgba(46, 125, 50, 0.05) 2%, transparent 0%),
            radial-gradient(circle at 75px 75px, rgba(194, 24, 91, 0.04) 2%, transparent 0%)
          `,
          backgroundSize: "90px 90px",
          opacity: 0.9,
        }}
      />
    </div>
  );
};

