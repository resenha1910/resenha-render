import { AbsoluteFill } from "remotion";

export const Footer = () => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 40,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          color: "#FFFFFF",
          fontFamily: "Arial",
          fontSize: 35,
          fontWeight: "bold",
        }}
      >
        SIGA O RESENHA 1910
      </div>
    </AbsoluteFill>
  );
};