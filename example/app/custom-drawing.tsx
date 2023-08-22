import { vec, type SkPoint, useFont, Points } from "@shopify/react-native-skia";
import * as React from "react";
import { View } from "react-native";
import { CartesianChart } from "victory-native";
import inter from "../assets/inter-medium.ttf";

const DATA = Array.from({ length: 13 }, (_, index) => ({
  day: index + 1,
  stars: Math.floor(Math.random() * (50 - 5 + 1)) + 5,
}));

const calculateStarPoints = (
  centerX: number,
  centerY: number,
  radius: number,
  points: number,
): SkPoint[] => {
  const vectors: SkPoint[] = [];
  for (let i = 0; i <= 2 * points; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const x = centerX + Math.cos(angle) * (i % 2 === 0 ? radius * 2 : radius);
    const y = centerY + Math.sin(angle) * (i % 2 === 0 ? radius * 2 : radius);
    vectors.unshift(vec(x, y));
  }
  return vectors;
};

const numPoints = (i: number) => {
  if (i <= 3) return 3;
  if (i >= 4 && i > 8) return 4;
  return 5;
};

const colorSwatches = (i: number) => {
  if (i <= 3) return ["#e11d48", "#c084fc"];
  if (i >= 4 && i > 8) return ["#2563eb", "#10b981"];
  return ["#ea580c", "#eab308"];
};

export default function LineChartPage() {
  const font = useFont(inter, 12);

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.5 }}>
          <CartesianChart
            xKey="day"
            padding={10}
            yKeys={["stars"]}
            domainPadding={30}
            gridOptions={{
              font,
            }}
            data={DATA}
          >
            {({ transformedData }) => {
              return (
                <>
                  {transformedData.x.map((x, i) => {
                    const y = transformedData.y.stars.at(i)!;
                    return (
                      <React.Fragment key={`point-${x}-${y}`}>
                        <Points
                          points={calculateStarPoints(x, y, 5, numPoints(i))}
                          mode="polygon"
                          color={colorSwatches(i).at(0)}
                          style="stroke"
                          strokeCap="round"
                          strokeWidth={2}
                        />
                        <Points
                          points={calculateStarPoints(x, y, 8.5, numPoints(i))}
                          mode="polygon"
                          color={colorSwatches(i).at(1)}
                          style="stroke"
                          strokeCap="round"
                          strokeWidth={2}
                        />
                      </React.Fragment>
                    );
                  })}
                </>
              );
            }}
          </CartesianChart>
        </View>
      </View>
    </>
  );
}
