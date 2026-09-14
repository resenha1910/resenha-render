import { CalculateMetadataFunction, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";

export const calculateMetadata: CalculateMetadataFunction<Record<string, unknown>> = async () => {
  const duration = await getAudioDurationInSeconds(
    staticFile("/audio.wav")
  );

  return {
    durationInFrames: Math.ceil(duration * 30),
  };
};