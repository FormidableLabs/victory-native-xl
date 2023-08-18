import { Path, useFont } from "@shopify/react-native-skia";
import * as React from "react";
import { View } from "react-native";
import { Grid, LineChart } from "victory-native-skia";
import inter from "../assets/inter-medium.ttf";

export default function SimpleLinePage() {
  const font = useFont(inter, 18);

  return (
    <>
      <View style={{ height: 400 }}>
        <LineChart
          xKey="day"
          padding={10}
          yKeys={["sales"]}
          data={[
            { sales: 5, day: 1 },
            { sales: 8, day: 2 },
            { sales: 4, day: 3 },
            { sales: 13, day: 4 },
            { sales: 7, day: 5 },
          ]}
        >
          {({ paths, xScale, yScale }) => {
            return (
              <>
                <Path
                  path={paths.sales}
                  style="stroke"
                  color="black"
                  strokeWidth={4}
                />
                <Grid font={font} xScale={xScale} yScale={yScale} />
              </>
            );
          }}
        </LineChart>
      </View>
    </>
  );
}
