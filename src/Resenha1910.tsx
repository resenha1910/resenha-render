import {
  AbsoluteFill,
  Audio,
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
} from "remotion";
import { useEffect, useState } from "react";

import { Background } from "./components/Background";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SceneCard } from "./components/SceneCard";

interface Scene {
  text: string;
  imageQuery?: string;
  effect?: string;
}

interface RenderData {
  headline?: string;
  summary?: string;
  source?: string;
  cta?: string;
  text?: string;
  narration?: string;
  keywords?: string[];
  imageQueries?: string[];
  scenes?: Scene[];
  sceneCount?: number;
  durationEstimate?: number;
}

export const Resenha1910 = () => {
  const [render, setRender] = useState<RenderData | null>(null);
  const [handle] = useState(() =>
    delayRender("Carregando os dados da notícia")
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(staticFile("render.json"));

        if (!response.ok) {
          throw new Error(
            `Erro ao carregar render.json: ${response.status}`
          );
        }

        const data: RenderData = await response.json();

        setRender(data);
        continueRender(handle);
      } catch (error) {
        cancelRender(
          error instanceof Error
            ? error
            : new Error("Não foi possível carregar render.json")
        );
      }
    };

    loadData();
  }, [handle]);

  if (!render) {
    return (
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
          color: "#fff",
          fontFamily: "Road Rage",
          fontSize: 80,
        }}
      >
        Carregando notícia...
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <Background />

      <Header />

      {/* Headline removed for test without headline */}

      <SceneCard render={render} />

      <Footer />

      {/* Narração principal */}
      <Audio src={staticFile("audio.wav")} />

      {/* Trilha Sonora de Fundo - Volume baixo para não atrapalhar a voz */}
      <Audio src={staticFile("music.mp3")} volume={0.15} />
    </AbsoluteFill>
  );
};
