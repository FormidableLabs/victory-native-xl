import React from "react";
import {
  LinearGradient,
  Path,
  vec,
  type SkFont,
  type SkPath,
} from "react-native-skia";
import { CartesianChart, Line, useLinePath } from "victory-native";

// Public chart types must interoperate with the renamed package's Skia types.
export function SkiaPackagePathTypes() {
  const { path }: { path: SkPath } = useLinePath([
    { x: 0, y: 10, xValue: 0, yValue: 10 },
    { x: 20, y: 30, xValue: 1, yValue: 30 },
  ]);

  return <Path path={path} />;
}

export function SkiaPackageFontTypes({ font }: { font: SkFont }) {
  return (
    <CartesianChart
      data={[{ x: 1, y: 2 }]}
      xKey="x"
      yKeys={["y"]}
      explicitSize={{ width: 320, height: 200 }}
      headless
      xAxis={{ font }}
      yAxis={[{ font }]}
    >
      {({ points }) => (
        <Line points={points.y} strokeWidth={2}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(320, 200)}
            colors={["red", "blue"]}
          />
        </Line>
      )}
    </CartesianChart>
  );
}
