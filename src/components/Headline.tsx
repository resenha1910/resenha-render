import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";

type Props = {
  text: string;
};

const RED_KEYWORDS = ["DECISÃO", "DEPAY", "NOVELA", "FIEL", "CORINTHIANS", "MARTELO", "TIMÃO", "RENOVA"];

export const Headline = ({ text }: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Zoom in constante estilo cinematográfico
  const scale = interpolate(frame, [0, 150], [1, 1.15]);

  // Saída suave
  const fadeOut = interpolate(frame, [142, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const words = text.toUpperCase().split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length > 20) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  if (currentLine) lines.push(currentLine);

  const renderLine = (line: string, lineIndex: number) => {
    const wordsInLine = line.split(" ");
    return wordsInLine.map((w, i) => {
      const cleanW = w.replace(/[^A-ZÇÃÕÁÉÍÓÚ]/g, '');
      const isRed = RED_KEYWORDS.some(kw => cleanW.includes(kw));
      
      // Animação mola (spring) palavra por palavra
      const delay = (lineIndex * 5 + i) * 3;
      const wordScale = spring({
        fps,
        frame: frame - delay,
        config: { damping: 12, stiffness: 200 },
      });

      return (
        <span
          key={i}
          style={{
            color: isRed ? "#E00000" : "#FFFFFF",
            display: "inline-block",
            transform: `scale(${wordScale})`,
            marginRight: "20px",
          }}
        >
          {w}
        </span>
      );
    });
  };

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        opacity: fadeOut,
      }}
    >
      {/* Filtro SVG para efeito "envelhecido / rasgado" (Grunge) no texto */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="grunge-text">
          <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div
        style={{
          width: "90%",
          // Aplica o tilt (inclinação), o zoom, o skewX e o filtro grunge
          transform: `scale(${scale}) skewX(-12deg) rotate(-2deg)`,
          fontFamily: "'Big Noodle Titling Oblique', sans-serif",
          fontSize: 150,
          fontWeight: 900,
          lineHeight: 0.95,
          letterSpacing: 2,
          textAlign: "center",
          textTransform: "uppercase",
          textShadow: `
            4px 4px 0px #333,
            8px 8px 0px #000
          `,
          filter: "url(#grunge-text)",
        }}
      >
        {lines.map((line, index) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            {renderLine(line, index)}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};