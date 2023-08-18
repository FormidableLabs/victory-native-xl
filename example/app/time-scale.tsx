import React from "react";
import data from "../data/weather/austin_weather.json";
import { Grid, LineChart } from "victory-native-skia";
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
        <LineChart
          data={DATA}
          xKey="date"
          yKeys={["high", "low"]}
          padding={10}
          curve="cardinal"
          chartType={{ high: "area", low: "line" }}
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
              <Path path={paths.high} style="fill" color="blue" strokeWidth={4}>
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(0, 500)}
                  colors={["blue", "white"]}
                />
              </Path>
              <Path
                path={paths.low}
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
              <Grid
                font={font}
                xScale={xScale}
                yScale={yScale}
                ticks={4}
                formatXLabel={(s) =>
                  typeof s === "number" ? format(s, "MMM-dd") : s
                }
              />
            </>
          )}
        </LineChart>
      </View>
    </View>
  );
}
