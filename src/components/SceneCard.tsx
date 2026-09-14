import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  random,
  spring,
  staticFile,
  Img,
} from "remotion";

interface Scene {
  text: string;
  imageQuery?: string;
  effect?: string;
}

interface RenderData {
  scenes?: Scene[];
}

type Props = { render: RenderData };

const RED = "#E30613";

const RED_KEYWORDS = [
  "RCE", "MILHOES", "BILHOES", "EXPLODIU", "CRESCER", "AUMENTAR",
  "JUROS", "DIVIDA", "BLOQUEIOS", "PROBLEMA", "MAIOR", "DIRETORIA",
  "MERCADO", "DECISAO", "MARTELO", "ESPECULACAO", "TREINO", "ELENCO",
  "PREPARACAO", "TORCIDA", "FIEL", "REACOES", "REDES", "SOCIAIS",
  "LIKE", "COMENTA", "NOTICIA", "GE", "VAR", "JUIZ",
];

// Orbital — S1 (Bola), S15 (Cronometro)
const OrbitalEffect = ({ p, frame }: { p: number; frame: number; }) => {
  const r1 = (frame * 0.6) % 360;
  const r2 = -(frame * 0.4) % 360;
  const r3 = (frame * 1.1) % 360;
  return (
    <>
      {/* Huge ring that explicitly overflows */}
      <circle cx="425" cy="300" r="380" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
      
      <circle cx="425" cy="300" r="190" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <circle cx="425" cy="300" r="310" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      <circle cx="425" cy="300" r="215" fill="none" stroke="rgba(255,255,255,0.14)"
        strokeWidth="1.5" strokeDasharray="18 14" transform={`rotate(${r1} 425 300)`} />
      <circle cx="425" cy="300" r="285" fill="none" stroke="rgba(227,6,19,0.35)"
        strokeWidth="1.5" strokeDasharray="10 28" transform={`rotate(${r2} 425 300)`} />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = ((i / 8) * 360 + r3) * (Math.PI / 180);
        const cx = 425 + Math.cos(angle) * 230;
        const cy = 300 + Math.sin(angle) * 230;
        return <rect key={i} x={cx - 4} y={cy - 4} width="8" height="8"
          fill={i % 3 === 0 ? RED : "white"} transform={`rotate(45 ${cx} ${cy})`} />;
      })}
      <circle cx="425" cy="300" r="230" fill="none" stroke={RED}
        strokeWidth="2" strokeDasharray={`${p * 1445} 1445`} transform="rotate(-90 425 300)" opacity="0.7" />
    </>
  );
};

// Crowd — S2 (Torcida), S17 (Fans)
const CrowdEffect = ({ frame }: { frame: number }) => {
  const wOff = frame * 0.06;
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => {
        const y = 120 + i * 100;
        const pts = Array.from({ length: 20 }).map((_, j) => {
          const x = j * 47;
          const wy = y + Math.sin(j * 0.5 + wOff + i * 0.8) * (22 - i * 3);
          return `${x},${wy}`;
        }).join(" ");
        return <polyline key={i} points={pts} fill="none"
          stroke={`rgba(255,255,255,${0.12 - i * 0.02})`} strokeWidth="1.5" />;
      })}
      {Array.from({ length: 14 }).map((_, i) => {
        const x = 50 + (i % 7) * 115 + (Math.floor(i / 7) * 55);
        const yOff = ((frame * (1.2 + (i % 4) * 0.2) + i * 50) % 520);
        const op = yOff < 420 ? yOff / 420 : 1 - (yOff - 420) / 100;
        return <rect key={i} x={x} y={560 - yOff} width="7" height="7"
          fill={i % 5 === 0 ? RED : "white"} opacity={Math.max(0, op)}
          transform={`rotate(${frame * (i % 2 === 0 ? 2 : -2)} ${x + 3.5} ${560 - yOff + 3.5})`} />;
      })}
    </>
  );
};

// Player — S3, S4, S7, S8, S11
const PlayerEffect = ({ p, frame, variant }: { p: number; frame: number; variant: number }) => {
  const scan = (frame * 4) % 600;
  const speedLen = interpolate(p, [0, 1], [0, 180]);
  const fromRight = variant % 2 === 1;
  return (
    <>
      <polygon points="425,0 150,600 700,600" fill="rgba(255,255,255,0.025)" />
      <line x1="170" y1="0" x2="140" y2="600" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <line x1="680" y1="0" x2="710" y2="600" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <rect x="0" y={scan} width="850" height="1.5" fill="rgba(255,255,255,0.28)" />
      {Array.from({ length: 5 }).map((_, i) => {
        const y = 180 + i * 75;
        const x0 = fromRight ? 850 : speedLen;
        const x1 = fromRight ? 850 - speedLen : 0;
        return <line key={i} x1={x0} y1={y} x2={x1} y2={y + (i % 2 === 0 ? 6 : -6)}
          stroke={i % 3 === 0 ? RED : "rgba(255,255,255,0.45)"}
          strokeWidth={i % 3 === 0 ? "2.5" : "1.5"} />;
      })}
      <rect x="0" y="590" width={interpolate(p, [0, 1], [0, 850])} height="3" fill={RED} />
    </>
  );
};

// Digital — S5, S6
const DigitalEffect = ({ p, frame }: { p: number; frame: number; }) => {
  const pulse = 200 + Math.sin(frame * 0.12) * 35;
  return (
    <>
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 11 }).map((_, col) => {
          const x = col * 80 + 35;
          const y = row * 75 + 30;
          const d = Math.sqrt((x - 425) ** 2 + (y - 300) ** 2);
          const op = Math.max(0, 0.18 - d * 0.00035);
          return <circle key={`${row}-${col}`} cx={x} cy={y} r="2" fill="white" opacity={op} />;
        })
      )}
      <circle cx="425" cy="300" r={pulse} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <circle cx="425" cy="300" r={pulse + 50} fill="none" stroke="rgba(227,6,19,0.2)"
        strokeWidth="1" strokeDasharray="8 14" />
      {Array.from({ length: 6 }).map((_, i) => {
        const x = 95 + i * 115;
        const maxH = 50 + random(i * 33 + 7) * 110;
        const h = interpolate(p, [i * 0.06, Math.min(1, i * 0.06 + 0.5)], [0, maxH], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        return <rect key={i} x={x} y={570 - h} width="10" height={h}
          fill={i === 3 ? RED : "rgba(255,255,255,0.5)"} />;
      })}
    </>
  );
};

// Document — S9, S10, S12
const DocumentEffect = ({ p, frame, variant }: { p: number; frame: number; variant: number }) => {
  const sigLen = interpolate(p, [0, 0.85], [0, 560]);
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => {
        const y = 100 + i * 62;
        const w = interpolate(p, [i * 0.06, Math.min(1, i * 0.06 + 0.45)], [0, 640], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        return <rect key={i} x="105" y={y} width={w} height="1"
          fill={i === 0 ? "rgba(227,6,19,0.65)" : "rgba(255,255,255,0.15)"} />;
      })}
      {([[85, 75], [765, 75], [85, 555], [765, 555]] as [number, number][]).map(([cx, cy], i) => {
        const sz = 22;
        const hDir = i < 2 ? 1 : -1;
        const vDir = i % 2 === 0 ? 1 : -1;
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={cx + vDir * sz} y2={cy} stroke="white" strokeWidth="2" />
            <line x1={cx} y1={cy} x2={cx} y2={cy + hDir * sz} stroke="white" strokeWidth="2" />
          </g>
        );
      })}
      {variant === 0 && (
        <path
          d={`M140,450 Q${140 + sigLen * 0.3},${440 + Math.sin(frame * 0.25) * 25} ${140 + sigLen * 0.6},${455 + Math.sin(frame * 0.15) * 15} T${140 + sigLen},450`}
          fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round" />
      )}
      {variant === 2 && (
        <line x1="200" y1="80" x2={200 + sigLen} y2={80 + sigLen * 0.65}
          stroke={RED} strokeWidth="3" strokeLinecap="round"
          strokeDasharray={`${p * 700} 700`} />
      )}
    </>
  );
};

// Stadium — S14
const StadiumEffect = ({ p, frame }: { p: number; frame: number }) => {
  const sw = Math.sin(frame * 0.035) * 18;
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={i} x1={i * 160} y1="600" x2="425" y2="140"
          stroke={`rgba(255,255,255,${0.035 + i * 0.008})`} strokeWidth="1" />
      ))}
      <path d="M110,310 Q425,150 740,310" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
      <polygon points={`105,0 ${165 + sw},0 380,600 320,600`} fill="rgba(255,255,255,0.035)" />
      <polygon points={`745,0 ${685 - sw},0 470,600 530,600`} fill="rgba(255,255,255,0.035)" />
      <path d={`M210,${560 - p * 80} Q425,${470 - p * 100} 640,${560 - p * 80}`}
        fill="none" stroke={RED} strokeWidth="2" opacity="0.75" />
    </>
  );
};

// Burst — S13 (acao), S16 (comemoracao)
const BurstEffect = ({ p, frame }: { p: number; frame: number }) => {
  const numRays = 14;
  return (
    <>
      {Array.from({ length: numRays }).map((_, i) => {
        const angle = (i / numRays) * 2 * Math.PI;
        const innerR = 75;
        const outerR = interpolate(p, [0, 1], [75, 480]);
        return <line key={i}
          x1={425 + Math.cos(angle) * innerR} y1={300 + Math.sin(angle) * innerR}
          x2={425 + Math.cos(angle) * outerR} y2={300 + Math.sin(angle) * outerR}
          stroke={i % 3 === 0 ? "rgba(227,6,19,0.5)" : "rgba(255,255,255,0.14)"}
          strokeWidth={i % 4 === 0 ? "3" : "1"} />;
      })}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = ((i / 5) * 360 + frame * 1.8) * (Math.PI / 180);
        const r = 195 + i * 30;
        const cx = 425 + Math.cos(angle) * r;
        const cy = 300 + Math.sin(angle) * r;
        const sz = 9 + i * 2;
        return <polygon key={i}
          points={`${cx},${cy - sz} ${cx + sz * 0.35},${cy - sz * 0.35} ${cx + sz},${cy} ${cx + sz * 0.35},${cy + sz * 0.35} ${cx},${cy + sz} ${cx - sz * 0.35},${cy + sz * 0.35} ${cx - sz},${cy} ${cx - sz * 0.35},${cy - sz * 0.35}`}
          fill={i % 2 === 0 ? RED : "white"} opacity="0.85"
          transform={`rotate(${frame * (i % 2 === 0 ? 1.8 : -1.8)} ${cx} ${cy})`} />;
      })}
    </>
  );
};

const SCENE_EFFECTS = [
  "orbital","crowd","player","player","digital",
  "digital","player","player","document","document",
  "player","document","burst","stadium","orbital",
  "burst","crowd",
] as const;

type EffectType = typeof SCENE_EFFECTS[number];

const SceneOverlay = ({ sceneIndex, p, frame }: { sceneIndex: number; p: number; frame: number }) => {
  const type: EffectType = SCENE_EFFECTS[Math.min(sceneIndex, SCENE_EFFECTS.length - 1)];
  const variant = sceneIndex % 3;
  switch (type) {
    case "orbital":  return <OrbitalEffect  p={p} frame={frame} />;
    case "crowd":    return <CrowdEffect    frame={frame} />;
    case "player":   return <PlayerEffect   p={p} frame={frame} variant={variant} />;
    case "digital":  return <DigitalEffect  p={p} frame={frame} />;
    case "document": return <DocumentEffect p={p} frame={frame} variant={variant} />;
    case "stadium":  return <StadiumEffect  p={p} frame={frame} />;
    case "burst":    return <BurstEffect    p={p} frame={frame} />;
    default:         return <PlayerEffect   p={p} frame={frame} variant={0} />;
  }
};

export const SceneCard = ({ render }: Props) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const headlineDuration = 0;
  const scenes = render.scenes ?? [];
  if (scenes.length === 0) return null;

  const sceneDuration = Math.max(1, (durationInFrames - headlineDuration) / scenes.length);
  const sceneFrame = Math.max(0, frame - headlineDuration);
  const sceneIndex = Math.min(scenes.length - 1, Math.floor(sceneFrame / sceneDuration));
  const scene = scenes[sceneIndex];
  if (!scene) return null;

  const text = scene.text;
  const localFrame = sceneFrame - sceneIndex * sceneDuration;
  const progress = interpolate(localFrame, [0, sceneDuration], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const isTextTop = random(sceneIndex) > 0.5;
  const textDirMode = Math.floor(random(sceneIndex * 1.5) * 4);
  const graphDirMode = ({ 0: 1, 1: 0, 2: 3, 3: 2 } as Record<number, number>)[textDirMode];

  const makeOffset = (mode: number) => {
    if (mode === 0) return { tx: -1200, ty: 0 };
    if (mode === 1) return { tx: 1200,  ty: 0 };
    if (mode === 2) return { tx: 0, ty: -1200 };
    return { tx: 0, ty: 1200 };
  };

  const { tx: trXT, ty: trYT } = makeOffset(textDirMode);
  const { tx: trXG, ty: trYG } = makeOffset(graphDirMode);

  const slideIn  = spring({ fps, frame: localFrame, config: { damping: 14, stiffness: 150, mass: 0.8 } });
  const exitStart = Math.max(0, sceneDuration - 12);
  const slideOut = spring({ fps, frame: localFrame - exitStart, config: { damping: 16, stiffness: 180, mass: 0.8 } });

  const textTX = (1 - slideIn) * trXT + slideOut * (-trXT);
  const textTY = (1 - slideIn) * trYT + slideOut * (-trYT);
  const graphTX = (1 - slideIn) * trXG + slideOut * (-trXG);
  const graphTY = (1 - slideIn) * trYG + slideOut * (-trYG);

  const isGlitch = localFrame > 5 && localFrame < 15 && random(localFrame) > 0.7;
  const gX = isGlitch ? random(localFrame + 1) * 28 - 14 : 0;

  const opIn  = interpolate(localFrame, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opOut = interpolate(localFrame, [sceneDuration - 5, sceneDuration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = opIn * opOut;

  const cols = 5, rows = 4;
  const col = sceneIndex % cols;
  const row = Math.floor(sceneIndex / cols);
  
  // Animações 3D Aleatórias e Suaves
  const rndX = random(sceneIndex + 1) * 2 - 1; 
  const rndY = random(sceneIndex + 2) * 2 - 1;
  const rndRotX = random(sceneIndex + 3) * 16 - 8;
  const rndRotY = random(sceneIndex + 4) * 16 - 8;
  const rndRotZ = random(sceneIndex + 5) * 4 - 2;

  // Base scale 1.25 removido para não recortar a imagem. Agora começa em 1.0.
  const kenBurns = 1.0 + progress * 0.05; 
  const panX = interpolate(progress, [0, 1], [0, rndX * 40]);
  const panY = interpolate(progress, [0, 1], [0, rndY * 30]);
  const rotX = interpolate(progress, [0, 1], [rndRotX, -rndRotX]);
  const rotY = interpolate(progress, [0, 1], [rndRotY, -rndRotY]);
  const rotZ = interpolate(progress, [0, 1], [rndRotZ, -rndRotZ]);

  let fontSize = 95;
  if (text.length > 120) fontSize = 65;
  else if (text.length > 80) fontSize = 80;

  const lines = (() => {
    const res: string[] = [];
    let cur = "";
    text.toUpperCase().split(" ").forEach(w => {
      const test = cur ? `${cur} ${w}` : w;
      if (test.length > (fontSize < 75 ? 30 : 22)) { if (cur) res.push(cur); cur = w; }
      else cur = test;
    });
    if (cur) res.push(cur);
    return res;
  })();

  const renderLine = (line: string, lineIdx: number) =>
    line.split(" ").map((w, i) => {
      const clean = w.replace(/[^A-Z0-9]/g, "");
      const isRed = RED_KEYWORDS.some(k => clean.includes(k)) || (!isNaN(Number(clean)) && clean.length > 0);
      const wordDelay = (lineIdx * 5 + i) * 1.5;
      const wordScale = spring({ fps, frame: localFrame - wordDelay, config: { damping: 12, stiffness: 220 } });
      return (
        <span key={i} style={{
          color: isRed ? RED : "#FFF",
          display: "inline-block",
          transform: `scale(${wordScale})`,
          marginRight: 12,
        }}>{w}</span>
      );
    });

  const slideBlur = slideIn < 0.9 || slideOut > 0.1;

  return (
    <AbsoluteFill style={{
      top: 150,
      height: 1620,
      display: "flex",
      flexDirection: isTextTop ? "column" : "column-reverse",
      justifyContent: "center",
      alignItems: "center",
      gap: 55,
      opacity: frame < headlineDuration ? 0 : opacity,
      pointerEvents: "none",
    }}>

      {/* TEXT */}
      <div style={{
        width: "88%",
        transform: `translate(${textTX + gX}px, ${textTY}px)`,
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        filter: slideBlur ? "blur(15px)" : isGlitch ? "contrast(150%) brightness(120%)" : "none",
        opacity: isGlitch ? 0.6 : 1,
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{
            fontSize,
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontFamily: "'Big Noodle Titling Oblique', sans-serif",
            textShadow: "3px 3px 0px rgba(0,0,0,1), 6px 6px 0px rgba(0,0,0,1)",
          }}>
            {renderLine(line, i)}
          </div>
        ))}
      </div>

      {/* GRAPHIC BLOCK */}
      <div style={{
        width: 860, height: 600,
        position: "relative",
        perspective: 1200,
        transformStyle: "preserve-3d",
        transform: `translate(${graphTX + gX}px, ${graphTY}px)`,
        filter: slideBlur ? "blur(15px)" : isGlitch ? "contrast(180%) invert(8%)" : "none",
      }}>

        {/* Grupo rotacionado em 3D */}
        <div style={{
          width: "100%", height: "100%", position: "absolute",
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`,
        }}>

          {/* Layer 0 — Behind elements */}
          <svg viewBox="0 0 850 600" width="860" height="600"
            style={{ position: "absolute", top: 0, left: 0, zIndex: 0, overflow: "visible" }}>
            <SceneOverlay sceneIndex={sceneIndex} p={progress} frame={localFrame} />
          </svg>

          {/* Layer 1 — Spritesheet (PNG transparente real) */}
          <div style={{
            position: "absolute", top: 0, left: 0,
            width: "100%", height: "100%", zIndex: 1,
            display: "flex", justifyContent: "center", alignItems: "center", // Center the inner sprite
            WebkitMaskImage: "radial-gradient(ellipse 88% 88% at center, black 42%, transparent 85%)",
            maskImage: "radial-gradient(ellipse 88% 88% at center, black 42%, transparent 85%)",
          }}>
            <div style={{
                width: 600,   // scale slot to fit container height (600px)
                height: 600,  // keeping 1:1 ratio
                overflow: "hidden", // clip the sprite
                position: "relative",
                // use kenBurns variable to avoid unused var errors
                transform: `scale(${kenBurns}) translate(${panX}px, ${panY}px)`,
              }}>
                <Img 
                  src={staticFile("spritesheet.png")}
                  style={{
                    position: "absolute",
                    width: cols * 600,
                    height: rows * 600,
                    left: -col * 600,
                    top: -row * 600,
                  }}
                />
            </div>
          </div>

          {/* Layer 2 — Front accent dots */}
          <svg viewBox="0 0 850 600" width="860" height="600"
            style={{ position: "absolute", top: 0, left: 0, zIndex: 2, pointerEvents: "none", mixBlendMode: "screen", transform: "translateZ(30px)", overflow: "visible" }}>
            {Array.from({ length: 3 }).map((_, i) => {
              const angle = ((sceneIndex * 60 + i * 120 + localFrame * 0.5)) * (Math.PI / 180);
              const r = 220 + i * 40;
              const cx = 425 + Math.cos(angle) * r;
              const cy = 300 + Math.sin(angle) * r;
              return <circle key={i} cx={cx} cy={cy} r={3 + i}
                fill={i === 1 ? RED : "white"} opacity="0.9" />;
            })}
          </svg>

        </div>
      </div>

      {/* Random Motion Graphics removed */}

    </AbsoluteFill>
  );
};
