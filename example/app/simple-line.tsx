import { Path, useFont } from "@shopify/react-native-skia";
import * as React from "react";
import { View } from "react-native";
import { LineChart } from "victory-native-skia";
import inter from "../assets/inter-medium.ttf";

export default function SimpleLinePage() {
  const font = useFont(inter, 12);

  return (
    <>
      <View style={{ height: 400 }}>
        <LineChart
          xKey="day"
          yKeys={["sales"]}
          gridOptions={{
            font,
            labelOffset: 4,
            formatXLabel: (n) => String(n) + "!",
          }}
          data={[
            { sales: 5, day: 1 },
            { sales: 8, day: 2 },
            { sales: 4, day: 3 },
            { sales: 13, day: 4 },
            { sales: 7, day: 5 },
          ]}
        >
          {({ paths }) => {
            return (
              <Path
                path={paths["sales.line"]}
                style="stroke"
                color="black"
                strokeWidth={4}
              />
            );
          }}
        </LineChart>
      </View>
    </>
  );
}
