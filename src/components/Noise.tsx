import {AbsoluteFill, Img} from "remotion";

export const Noise = () => {
  return (
    <AbsoluteFill
      style={{
        opacity:0.12,
        mixBlendMode:"overlay",
      }}
    >
      <Img src="https://grainy-gradients.vercel.app/noise.svg" style={{width: "100%", height: "100%", objectFit: "cover"}} />
    </AbsoluteFill>
  );
};