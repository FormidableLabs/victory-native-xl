import React from "react";
import data from "../data/weather/austin_weather.json";
import { CartesianChart } from "victory-native";
import {
  Circle,
  LinearGradient,
  Path,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import { View } from "react-native";
import inter from "../assets/inter-medium.ttf";
import { format } from "date-fns";

const DATA = data
  .slice(0, 15)
  .map((d) => ({ ...d, date: new Date(d.date).valueOf() }));

export default function TimeScale() {
  const font = useFont(inter, 12);

  return (
    <View>
      <View style={{ height: 400 }}>
        <CartesianChart
          data={DATA}
          xKey="date"
          yKeys={["high", "low"]}
          padding={10}
          curve="cardinal"
          gridOptions={{
            font,
            formatXLabel: (s) => format(s, "MMM-dd"),
            xLabelOffset: 6,
            yLabelOffset: 6,
            xTicks: 5,
          }}
        >
          {({ paths, isPressActive, activePressX, activePressY }) => (
            <>
              <Path
                path={paths["high.area"]}
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
                path={paths["low.line"]}
                style="stroke"
                color="black"
                strokeWidth={1}
              />
              {isPressActive && (
                <>
                  <Circle
                    cx={activePressX.position}
                    cy={activePressY.high.position}
                    r={5}
                    color="red"
                  />
                  <Circle
                    cx={activePressX.position}
                    cy={activePressY.low.position}
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
