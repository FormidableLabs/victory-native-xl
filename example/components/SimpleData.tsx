import * as React from "react";
import { Button, StyleSheet, View } from "react-native";
import { type InputDatum } from "victory-native-skia";

export function SimpleData({
  renderChart,
  controls,
  isPositiveX = false,
  isPositiveY,
}: {
  renderChart: ({ data }: { data: InputDatum[] }) => JSX.Element;
  controls?: () => JSX.Element;
  isPositiveX?: boolean;
  isPositiveY?: boolean;
}) {
  const [data, setData] = React.useState(() =>
    Array.from({ length: 10 })
      .fill(null)
      .map((_, i) => ({
        x: (isPositiveX ? 0 : -5) + i,
        y: (isPositiveY ? 0 : -5) + 10 * Math.random(),
      })),
  );

  const addPoint = () => {
    setData((oldData) => [
      ...oldData,
      {
        x: (oldData.at(-1)?.x || 0) + 1,
        y: (isPositiveY ? 0 : -5) + 10 * Math.random(),
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          width: "100%",
          backgroundColor: "rgb(240,240,240)",
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      >
        {renderChart({ data })}
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <Button title="Add point" onPress={addPoint} />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Reset"
              onPress={() =>
                Array.from({ length: 10 })
                  .fill(null)
                  .map((_, i) => ({
                    x: (isPositiveX ? 0 : -5) + i,
                    y: (isPositiveY ? 0 : -5) + 10 * Math.random(),
                  }))
              }
            />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              title="Shuffle"
              onPress={() =>
                setData((old) =>
                  old.map(({ x }) => ({
                    x,
                    y: (isPositiveY ? 0 : -5) + 10 * Math.random(),
                  })),
                )
              }
            />
          </View>
        </View>
        {controls?.()}
      </View>
    </View>
  );
}
