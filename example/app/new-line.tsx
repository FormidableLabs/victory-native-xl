import React from "react";
import { CartesianChart } from "victory-native";
import {
  Circle,
  LinearGradient,
  Path,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import { Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import inter from "../assets/inter-medium.ttf";

export default function NewLinePage() {
  const activeX = useSharedValue(0);
  const font = useFont(inter, 12);
  const activeProfit = useSharedValue(0);
  const [activePoint, setActivePoint] = React.useState([0, 0] as [
    number,
    number,
  ]);

  return (
    <View>
      <Text style={{ fontSize: 24, padding: 12 }}>
        {`${activePoint[0]}, ${activePoint[1]}`}
      </Text>
      <View style={{ height: 400 }}>
        <CartesianChart
          gridOptions={{
            font,
            formatYLabel: (n) => n.toFixed(0),
            yLabelOffset: 4,
            xLabelOffset: 4,
          }}
          data={DATA}
          xKey="month"
          yKeys={["profit", "revenue"]}
          padding={10}
          curve={{ revenue: "catmullRom", profit: "linear" }}
          activePressX={{ value: activeX }}
          activePressY={{ profit: { value: activeProfit } }}
          onPressValueChange={({
            x: { value: x },
            y: {
              revenue: { value: revenue },
            },
          }) => setActivePoint([x, revenue])}
        >
          {({ paths, isPressActive, activePressX, activePressY }) => (
            <>
              <Path
                path={paths["revenue.area"]}
                style="fill"
                color="blue"
                strokeWidth={4}
              >
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(0, 500)}
                  colors={["blue", "white"]}
                />
              </Path>
              <Path
                path={paths["profit.line"]}
                style="stroke"
                color="black"
                strokeWidth={4}
              />
              {isPressActive && (
                <>
                  <Circle
                    cx={activePressX.position}
                    cy={activePressY.profit.position}
                    r={5}
                    color="red"
                  />
                  <Circle
                    cx={activePressX.position}
                    cy={activePressY.revenue.position}
                    r={5}
                    color="red"
                  />
                </>
              )}
            </>
          )}
        </CartesianChart>
      </View>
    </View>
  );
}

const DATA = Array.from({ length: 20 }).map((_, i) => ({
  month: i,
  revenue: 1500 + Math.random() * 1000,
  profit: 500 + 500 * Math.random(),
}));
