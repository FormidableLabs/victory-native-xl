import * as React from "react";
import data from "../data/stockprice/tesla_stock.json";
import { Button, View } from "react-native";
import { CartesianChart, useAnimatedPath } from "victory-native";
import type { SkPath } from "@shopify/react-native-skia";
import { LinearGradient, Path, vec, Fill } from "@shopify/react-native-skia";

const DATA = data
  .slice(200, 300)
  .map((d) => ({ ...d, date: new Date(d.date).valueOf() }));

export default function AnimatedPathScreen() {
  const [data, setData] = React.useState(DATA);
  return (
    <View>
      <View style={{ height: 400 }}>
        <CartesianChart
          data={data}
          xKey="date"
          yKeys={["high"]}
          curve={{ high: "catmullRom" }}
        >
          {({ paths, chartBounds, canvasSize }) => (
            <>
              <Fill>
                <LinearGradient
                  colors={["gray", "black"]}
                  start={vec(0, 0)}
                  end={vec(canvasSize.width, canvasSize.height)}
                />
              </Fill>
              <AreaPath
                path={paths["high.area"]}
                bottom={chartBounds.bottom}
                top={chartBounds.top}
              />
              <LinePath path={paths["high.line"]} />
            </>
          )}
        </CartesianChart>
      </View>
      <View>
        <Button
          title="Animate"
          onPress={() => {
            setData((data) => [...data].reverse());
          }}
        />
      </View>
    </View>
  );
}

const AreaPath = ({
  path,
  top,
  bottom,
}: {
  path: SkPath;
  top: number;
  bottom: number;
}) => {
  const animPath = useAnimatedPath(path, { type: "spring" });

  return (
    <Path path={animPath} style="fill">
      <LinearGradient
        start={vec(0, top)}
        end={vec(0, bottom)}
        colors={["#00ff0096", "#00ff0022"]}
      />
    </Path>
  );
};

const LinePath = ({ path }: { path: SkPath }) => {
  const animPath = useAnimatedPath(path, { type: "spring" });

  return <Path path={animPath} style="stroke" color="green" strokeWidth={3} />;
};
