import type { SkPoint } from "@shopify/react-native-skia";

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function calculatePointOnCircumference(
  center: SkPoint,
  radius: number,
  angleInRadians: number,
): SkPoint {
  return {
    x: center.x + radius * Math.cos(angleInRadians),
    y: center.y + radius * Math.sin(angleInRadians),
  };
}
