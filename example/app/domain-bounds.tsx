import * as React from "react";
import data from "../data/stockprice/tesla_stock.json";
import { CartesianChart } from "victory-native";
import { Path, useFont } from "@shopify/react-native-skia";
import { View } from "react-native";
import inter from "../assets/inter-medium.ttf";
import { format } from "date-fns";

const DATA = data
  .slice(0, 50)
  .map((d) => ({ ...d, date: new Date(d.date).valueOf() }));

export default function DomainBoundsScreen() {
  const font = useFont(inter, 12);

  return (
    <View>
      <View style={{ height: 400 }}>
        <CartesianChart
          data={DATA}
          xKey="date"
          yKeys={["high"]}
          curve={{ high: "natural" }}
          padding={{ left: 10 }}
          domain={{
            // Add 3-weeks to the ends of the domain
            x: [
              DATA.at(0)!.date - 3 * 7 * 24 * 60 * 60 * 1000,
              DATA.at(-1)!.date + 3 * 7 * 24 * 60 * 60 * 1000,
            ],
            // Make y domain start at 0
            y: [0],
          }}
          gridOptions={{
            font,
            xTicks: 5,
            yTicks: 5,
            xLabelOffset: 12,
            yLabelOffset: 12,
            formatXLabel: (ms) => format(new Date(ms), "MM-dd"),
          }}
        >
          {({ paths }) => (
            <>
              <Path
                style="fill"
                strokeWidth={3}
                color="red"
                path={paths["high.area"]}
              />
            </>
          )}
        </CartesianChart>
      </View>
    </View>
  );
}
