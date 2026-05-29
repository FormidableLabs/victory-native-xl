import { ZoomTransform } from "d3-zoom";

const getSafeZoomScale = (scale: number) =>
  scale === 0 || !Number.isFinite(scale) ? 1 : scale;

export const createSafeZoomTransform = (
  scale: number,
  translateX: number,
  translateY: number,
) => new ZoomTransform(getSafeZoomScale(scale), translateX, translateY);
