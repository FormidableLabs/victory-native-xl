import * as React from "react";
import { View } from "react-native";
import {
  CartesianChart,
  Line,
  useChartPressState,
  useChartTransformState,
} from "victory-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import type { SharedValue } from "react-native-reanimated";
import inter from "../assets/inter-medium.ttf";

export default function ScrollAndScrub() {
  const font = useFont(inter, 12);
  const { state, isActive } = useChartPressState({ x: 0, y: { highTmp: 0 } });
  const { state: transformState } = useChartTransformState();

  return (
    <View style={{ height: 300 }}>
      <CartesianChart
        data={DATA}
        xKey="day"
        yKeys={["highTmp"]}
        axisOptions={{
          font,
        }}
        transformConfig={{
          pan: {
            enabled: true,
            dimensions: ["x", "y"],
          },
        }}
        viewport={{
          x: [15, 30],
          y: [15, 120],
        }}
        chartPressState={state}
        transformState={transformState}
      >
        {({ points }) => (
          <>
            <Line points={points.highTmp} color="red" strokeWidth={3} />
            {isActive && (
              <ToolTip x={state.x.position} y={state.y.highTmp.position} />
            )}
          </>
        )}
      </CartesianChart>
    </View>
  );
}

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color="black" />;
}

const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i,
  highTmp: 40 + 30 * Math.random(),
}));
