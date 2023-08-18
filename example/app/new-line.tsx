import React from "react";
import { LineChart, Grid } from "victory-native-skia";
import {
  Circle,
  LinearGradient,
  Path,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import { Text, TextInput, View } from "react-native";
import Reanimated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import inter from "../assets/inter-medium.ttf";

const AnimatedText = Reanimated.createAnimatedComponent(TextInput);

export default function NewLinePage() {
  const activeX = useSharedValue(0);
  const font = useFont(inter, 12);
  const activeProfit = useSharedValue(0);
  const [isActive, setIsActive] = React.useState(false);
  const [activePoint, setActivePoint] = React.useState([0, 0] as [
    number,
    number,
  ]);

  const textProps = useAnimatedProps(() => {
    return {
      text: isActive
        ? `${activeX.value.toFixed(2)}, ${activeProfit.value.toFixed(2)}`
        : "",
    };
  });

  return (
    <View>
      <AnimatedText
        editable={false}
        // @ts-ignore
        animatedProps={textProps}
        style={{ fontSize: 24, padding: 12 }}
      />
      <Text style={{ fontSize: 24, padding: 12 }}>
        {`${activePoint[0]}, ${activePoint[1]}`}
      </Text>
      <View style={{ height: 400 }}>
        <LineChart
          data={DATA}
          xKey="month"
          yKeys={["profit", "revenue"]}
          padding={10}
          curve={{ revenue: "catmullRom", profit: "linear" }}
          chartType={{ revenue: "area", profit: "line" }}
          onPressActiveChange={setIsActive}
          activePressX={{ value: activeX }}
          activePressY={{ profit: { value: activeProfit } }}
          onPressValueChange={({
            x: { value: x },
            y: {
              revenue: { value: revenue },
            },
          }) => setActivePoint([x, revenue])}
        >
          {({
            paths,
            isPressActive,
            activePressX,
            activePressY,
            xScale,
            yScale,
          }) => (
            <>
              <Path
                path={paths.profit}
                style="stroke"
                color="black"
                strokeWidth={4}
              />
              <Path
                path={paths.revenue}
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
              <Grid
                font={font}
                xScale={xScale}
                yScale={yScale}
                formatYLabel={(s) => (typeof s === "number" ? s.toFixed(0) : s)}
              />
            </>
          )}
        </LineChart>
      </View>
    </View>
  );
}

const DATA = Array.from({ length: 20 }).map((_, i) => ({
  month: i,
  revenue: 1500 + Math.random() * 1000,
  profit: 500 + 500 * Math.random(),
}));
