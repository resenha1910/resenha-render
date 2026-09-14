import { Img, staticFile } from "remotion";

export const Logo = ({ style, width = 95 }: { style?: React.CSSProperties, width?: number }) => {
  return (
    <Img
      src={staticFile("logo.png")}
      style={{
        width,
        objectFit: "contain",
        ...style
      }}
    />
  );
};
