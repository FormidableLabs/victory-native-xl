import * as React from "react";
import { SimpleData } from "../components/SimpleData";
import { CartesianChart, Line, XAxis, YAxis } from "victory-native-skia";
import { Button, View } from "react-native";

export default function AxesPage() {
  const [yAxisMode, setYAxisMode] = React.useState<
    "zero" | "fix-left" | "fix-right"
  >("zero");
  const [xAxisMode, setXAxisMode] = React.useState<
    "zero" | "fix-bottom" | "fix-top"
  >("zero");

  return (
    <SimpleData
      renderChart={({ data }) => (
        <CartesianChart data={data} padding={40}>
          <XAxis mode={xAxisMode} />
          <YAxis mode={yAxisMode} />
          <Line />
        </CartesianChart>
      )}
      controls={() => (
        <React.Fragment>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Button
                title="fixed-bottom"
                onPress={() => setXAxisMode("fix-bottom")}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button title="zero" onPress={() => setXAxisMode("zero")} />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                title="fixed-top"
                onPress={() => setXAxisMode("fix-top")}
              />
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Button
                title="fixed-left"
                onPress={() => setYAxisMode("fix-left")}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button title="zero" onPress={() => setYAxisMode("zero")} />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                title="fixed-right"
                onPress={() => setYAxisMode("fix-right")}
              />
            </View>
          </View>
        </React.Fragment>
      )}
    />
  );
}
