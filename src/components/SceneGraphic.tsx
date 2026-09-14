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

type Scene = {
  imageQuery?: string;
  text: string;
};

type Props = {
  render: { scenes?: Scene[] };
};

export const SceneGraphic = ({ render }: Props) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const scenes = render.scenes ?? [];

  if (scenes.length === 0) return null;

  const headlineDuration = 5 * fps;
  const sceneDuration = Math.max(1, (durationInFrames - headlineDuration) / scenes.length);
  const sceneFrame = Math.max(0, frame - headlineDuration);
  const sceneIndex = Math.min(scenes.length - 1, Math.floor(sceneFrame / sceneDuration));
  const localFrame = sceneFrame - sceneIndex * sceneDuration;
  
  const progress = interpolate(localFrame, [0, sceneDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  
  // Lógica Cima / Baixo
  const isGraphicTop = !(random(sceneIndex) > 0.5);
  
  // Sorteio da direção
  const textDirectionMode = Math.floor(random(sceneIndex * 1.5) * 4);
  const oppMap = { 0: 1, 1: 0, 2: 3, 3: 2 };
  const directionMode = oppMap[textDirectionMode as 0|1|2|3];
  
  let trX = 0;
  let trY = 0;
  if (directionMode === 0) trX = -1200;
  if (directionMode === 1) trX = 1200;
  if (directionMode === 2) trY = -1200;
  if (directionMode === 3) trY = 1200;

  const slideIn = spring({
    fps,
    frame: localFrame,
    config: { damping: 14, stiffness: 150, mass: 0.8 },
  });

  const exitStart = Math.max(0, sceneDuration - 12);
  const slideOut = spring({
    fps,
    frame: localFrame - exitStart,
    config: { damping: 16, stiffness: 180, mass: 0.8 },
  });

  const translateX = (1 - slideIn) * trX + slideOut * (-trX);
  const translateY = (1 - slideIn) * trY + slideOut * (-trY);

  const isGlitch = localFrame > 5 && localFrame < 15 && random(localFrame) > 0.7;
  const glitchX = isGlitch ? random(localFrame + 1) * 30 - 15 : 0;
  
  // Spritesheet Logic (5 colunas, 4 linhas)
  const cols = 5;
  const rows = 4;
  
  const col = sceneIndex % cols;
  const row = Math.floor(sceneIndex / cols);
  

  // Zoom lento de câmera (Ken Burns)
  const scale = 1 + progress * 0.15;
  // Leve movimento panorâmico extra
  const panX = interpolate(progress, [0, 1], [0, random(sceneIndex) > 0.5 ? 20 : -20]);

  return (
    <AbsoluteFill
      style={{
        top: isGraphicTop ? 150 : 960,
        height: 810,
        justifyContent: "center",
        alignItems: "center",
        opacity: frame < headlineDuration ? 0 : 1,
        pointerEvents: "none",
        padding: 40,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `translate(${translateX + glitchX}px, ${translateY}px) scale(0.85)`,
          filter: (slideIn < 0.9 || slideOut > 0.1) ? "blur(15px)" : (isGlitch ? "contrast(200%) invert(10%)" : "none"),
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Contêiner da Máscara (Bordas Esfumaçadas) */}
        <div
          style={{
            width: "90%",
            height: "90%",
            WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)",
            maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)",
            overflow: "hidden",
            borderRadius: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* A Imagem com Motion (Ken Burns e Spritesheet) */}
          <div
            style={{
              width: "110%", // Um pouco maior para permitir o pan
              height: "110%",
              overflow: "hidden",
              position: "relative",
              transform: `scale(${scale}) translateX(${panX}px)`,
              filter: "contrast(1.2) saturate(0.8)",
            }}
          >
            <Img
              src={staticFile("spritesheet.jpg")}
              style={{
                position: "absolute",
                width: `${cols * 100}%`,
                height: `${rows * 100}%`,
                left: `-${col * 100}%`,
                top: `-${row * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
