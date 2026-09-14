import { Audio, staticFile } from "remotion";

export const HelloWorld = () => {
  return (
    <Audio src={staticFile("audio.wav")} />
  );
};