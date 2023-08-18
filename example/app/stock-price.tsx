import React from "react";
import data from "../data/stockprice/tesla_stock.json";
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
  .slice(0, 30)
  .map((d) => ({ ...d, date: new Date(d.date).valueOf() }));

export default function StockPriceScreen() {
  const font = useFont(inter, 12);

  return (
    <View>
      <View style={{ height: 400 }}>
        <LineChart
          data={DATA}
          xKey="date"
          yKeys={["high"]}
          padding={{ left: 20 }}
          curve="linear"
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
              <Path
                path={paths["high.line"]}
                style="stroke"
                color="blue"
                strokeWidth={8}
              />
              <Path
                path={paths["high.area"]}
                style="fill"
                color="blue"
                strokeWidth={8}
              >
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(100, 500)}
                  colors={["blue", "white"]}
                />
              </Path>
              {/*<Path*/}
              {/*  path={paths.low}*/}
              {/*  style="stroke"*/}
              {/*  color="black"*/}
              {/*  strokeWidth={1}*/}
              {/*/>*/}
              {isPressActive && (
                <>
                  <Circle
                    cx={activePressX.position}
                    cy={activePressY.high.position}
                    r={10}
                    color="red"
                  />
                  {/*<Circle*/}
                  {/*  cx={activePressX.position}*/}
                  {/*  cy={activePressY.low.position}*/}
                  {/*  r={5}*/}
                  {/*  color="red"*/}
                  {/*/>*/}
                </>
              )}
              <Grid
                font={font}
                xScale={xScale}
                yScale={yScale}
                ticks={4}
                formatXLabel={(ms) => format(new Date(ms), "MM-dd")}
                labelBackgroundColor="transparent"
              />
            </>
          )}
        </LineChart>
      </View>
    </View>
  );
}
