import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  random,
} from "remotion";

export const Background = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const time1 = frame * 0.002;
  const time2 = frame * 0.0015;

  // Glitch flash logic
  const isFlash = frame % Math.floor(fps * 2.5) === 0 && random(frame) > 0.3;
  const isMinorGlitch = frame % Math.floor(fps * 1.2) === 0 && random(frame) > 0.5;

  // Movimentos senoidais lentos para os 'blobs' de fumaça
  const b1X = 50 + Math.sin(time1) * 30;
  const b1Y = 30 + Math.cos(time1 * 1.2) * 20;
  const b2X = 50 + Math.cos(time2) * 40;
  const b2Y = 70 + Math.sin(time2 * 0.8) * 30;
  const b3X = 50 + Math.sin(time1 * 0.5) * 20;
  const b3Y = 50 + Math.cos(time2 * 1.5) * 20;

  return (
    <AbsoluteFill style={{ backgroundColor: "#040404", overflow: "hidden" }}>
      
      {/* Dynamic Smoky Background Blobs */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${b1X}% ${b1Y}%, rgba(227,6,19,0.15) 0%, transparent 60%)`,
          filter: "blur(40px)"
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${b2X}% ${b2Y}%, rgba(255,255,255,0.05) 0%, transparent 70%)`,
          filter: "blur(60px)"
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${b3X}% ${b3Y}%, rgba(50,0,0,0.3) 0%, transparent 80%)`,
          filter: "blur(50px)"
        }}
      />

      {/* Film Grain Overlay Animado (Otimizado para não travar) */}
      <AbsoluteFill style={{ opacity: 0.35, mixBlendMode: "overlay", transform: `translate(${frame % 3 === 0 ? 5 : 0}px, ${frame % 2 === 0 ? 5 : 0}px)` }}>
        <svg width="110%" height="110%" style={{ marginLeft: "-5%", marginTop: "-5%" }}>
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" seed="1" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </AbsoluteFill>

      {/* Deep Dark Vignette para manter o centro em foco */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.85) 100%)",
          pointerEvents: "none"
        }}
      />
      
      {/* Glitch Flashes */}
      {isFlash && (
        <AbsoluteFill style={{ backgroundColor: "rgba(255,255,255,0.7)", mixBlendMode: "overlay" }} />
      )}
      {isMinorGlitch && (
        <AbsoluteFill style={{ backgroundColor: "rgba(195,0,0,0.15)", mixBlendMode: "color-burn", transform: "translateY(-10px)" }} />
      )}

      {/* VHS Scanlines */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.3) 50%)",
          backgroundSize: "100% 6px",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
