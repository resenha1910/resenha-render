import { interpolate, useCurrentFrame } from "remotion";
import React from "react";

type GlitchTextProps = {
  children: React.ReactNode;
};

export const GlitchText = ({ children }: GlitchTextProps) => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [0, 10],
    [0.5, 1],
    {
      extrapolateRight: "clamp",
    }
  );

  const opacity = interpolate(
    frame,
    [0, 5],
    [0, 1],
    {
      extrapolateRight: "clamp",
    }
  );

  const translateX = interpolate(
    frame,
    [0, 5, 10],
    [-20, 10, 0],
    {
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      style={{
        transform: `scale(${scale}) translateX(${translateX}px)`,
        opacity,

        color: "#fff",

        fontSize: 90,
        fontWeight: 900,

        textAlign: "center",
        textTransform: "uppercase",

        letterSpacing: -3,

        textShadow:
          "4px 0px #e30613, -4px 0px #ffffff",

        fontFamily: "Arial Black, Arial, sans-serif",
      }}
    >
      {children}
    </div>
  );
};