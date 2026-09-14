import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Logo } from "./Logo";

export const Header = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Piscar de 0 a 1 suavemente
  const blink = Math.sin(frame / 6) * 0.5 + 0.5;
  
  // Animação de entrada dos botões
  const buttonSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 150 }
  });
  
  // Pulso do Like Emoji
  const pulseLike = spring({
    frame: frame % 60, // pulsa a cada segundo
    fps,
    config: { damping: 2, stiffness: 200 }
  });

  // Animação do botão de Seguir (TikTok style)
  // Loop de 3 segundos (90 frames a 30fps)
  const followCycle = frame % 90;
  
  // Clica no frame 30, conclui no 40
  const isClicked = followCycle > 30;
  
  const clickScale = interpolate(followCycle, [25, 30, 35], [1, 0.5, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const checkScale = interpolate(followCycle, [30, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  // Desaparece depois que clicou (estilo TikTok)
  const followOpacity = interpolate(followCycle, [60, 75], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Margem de segurança para o TikTok/Reels/Shorts
  const safetyMargin = 120;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>

      {/* Gradiente superior para escurecer o topo inteiro */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: safetyMargin + 180,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,.95), rgba(0,0,0,.75), rgba(0,0,0,0))",
        }}
      />

      {/* Barra preta */}
      <div
        style={{
          position: "absolute",
          top: safetyMargin,
          left: 0,
          width: "100%",
          height: 120, // Aumentado para caber o logo maior
          background: "rgba(10,10,10,.92)",
          borderBottom: "4px solid #E30613",
        }}
      />

      {/* Logo Wrapper */}
      <div
        style={{
          position: "absolute",
          top: safetyMargin - 30, // ajustado pro novo tamanho
          left: 20,
          width: 180, 
          height: 180, 
        }}
      >
        {/* Círculo Vermelho Piscando e Logo */}
        <div style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: `6px solid rgba(227, 6, 19, ${blink})`, // #E30613
            boxShadow: `0 0 35px rgba(227, 6, 19, ${blink * 0.8})`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(5,5,5,1)",
            overflow: "hidden", // Garante que o interior não vaze
        }}>
          <Logo width={140} style={{ borderRadius: "50%" }} />
        </div>

        {/* Botão de Seguir Animado (Estilo TikTok) tangenciando a base */}
        <div style={{
          position: "absolute",
          bottom: -15,
          left: "50%",
          transform: `translateX(-50%) scale(${clickScale})`,
          opacity: followOpacity,
          width: 40,
          height: 40,
          borderRadius: 20,
          background: "#E30613", // Sempre vermelho
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
          color: "white",
          fontWeight: "bold",
        }}>
          {isClicked ? (
            // Checkmark
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `scale(${checkScale})` }}>
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            // Plus
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          )}
        </div>
      </div>

      {/* Nome */}
      <div
        style={{
          position: "absolute",
          left: 220, // empurrado levemente para a direita pelo logo maior
          top: safetyMargin + 5,
          color: "white",
          fontSize: 54, // Aumentado
          fontWeight: 900,
          fontFamily: "Arial Black",
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        RESENHA 1910
      </div>

      {/* Slogan */}
      <div
        style={{
          position: "absolute",
          left: 220,
          top: safetyMargin + 80,
          color: "#bbbbbb",
          fontSize: 28, // Aumentado a pedido do usuario
          fontWeight: 600,
          fontFamily: "Arial",
        }}
      >
        Notícias do Corinthians em tempo real
      </div>

      {/* Botões de Ação (Curtir, Compartilhar) */}
      <div
        style={{
          position: "absolute",
          right: 30,
          top: safetyMargin + 25,
          display: "flex",
          gap: 20,
          opacity: buttonSpring,
          transform: `translateY(${(1 - buttonSpring) * -50}px)`,
        }}
      >
        {/* CURTIR (THUMBS UP SVG) */}
        <div style={{
          background: "rgba(255,255,255,0.1)",
          width: 64,
          height: 64,
          borderRadius: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid rgba(255,255,255,0.2)",
          transform: `scale(${1 + pulseLike * 0.2})`, // Pulso mais forte
          boxShadow: "0 5px 15px rgba(0,0,0,0.5)"
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill={pulseLike > 0.5 ? "#FFF" : "none"} stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
          </svg>
        </div>

        {/* COMPARTILHAR (SETA) */}
        <div style={{
          background: "rgba(255,255,255,0.1)",
          width: 64,
          height: 64,
          borderRadius: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid rgba(255,255,255,0.2)",
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </div>
      </div>

    </AbsoluteFill>
  );
};
