import React from "react";
import {
  Image,
  useImage,
  type ImageProps,
  type SkImage,
} from "@shopify/react-native-skia";

export type TickImage = Partial<Omit<ImageProps, "image">> & {
  image?: string;
  skImage?: SkImage | null;
  width?: number;
  height?: number;
};

type AxisImageProps = TickImage & {
  y: number;
  x: number;
};

export const AxisImage: React.FC<AxisImageProps> = ({
  image,
  skImage,
  y,
  x,
  ...rest
}) => {
  const imageSKFromHook = useImage(image || "");
  const imageSK = skImage || imageSKFromHook;

  return (
    <Image
      image={imageSK}
      fit="contain"
      y={y}
      x={x}
      width={12}
      height={12}
      {...rest}
    />
  );
};
