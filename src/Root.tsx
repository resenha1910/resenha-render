import "./fonts.css";

import { Composition } from "remotion";
import { Resenha1910 } from "./Resenha1910";
import { calculateMetadata } from "./calculateMetadata";

export const RemotionRoot = () => {
  return (
    <Composition
      id="Resenha1910"
      component={Resenha1910}
      fps={30}
      width={1080}
      height={1920}
      durationInFrames={900}
      calculateMetadata={calculateMetadata}
    />
  );
};