import * as React from "react";
import data from "../data/stockprice/tesla_stock.json";
import { View } from "react-native";
import { LineChart, useAnimatedPath } from "victory-native-skia";
import type { SkPath } from "@shopify/react-native-skia";
import { Path } from "@shopify/react-native-skia";

const DATA = data.map((d) => ({ ...d, date: new Date(d.date).valueOf() }));

export default function AnimatedPathScreen() {
  return (
    <View style={{ height: 400 }}>
      <LineChart data={DATA} xKey="date" yKeys={["high"]}>
        {({ paths }) => <LinePath path={paths["high.line"]} />}
      </LineChart>
    </View>
  );
}

const LinePath = ({ path }: { path: SkPath }) => {
  const animPath = useAnimatedPath(path);

  return <Path path={animPath} style="stroke" color="red" strokeWidth={4} />;
};
