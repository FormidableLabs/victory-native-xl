import * as React from "react";
import { Button, View } from "react-native";
import { Point } from "../charts/types";

export function SimpleData({
  renderChart,
  controls,
}: {
  renderChart: ({ data }: { data: Point[] }) => JSX.Element;
  controls?: () => JSX.Element;
}) {
  const [data, setdata] = React.useState(DATA);

  const addPoint = () => {
    setdata((oldData) => [
      ...oldData,
      { x: oldData.at(-1).x + 1, y: -5 + 10 * Math.random() },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ flex: 1, width: "100%", backgroundColor: "rgb(240,240,240)" }}
      >
        {renderChart({ data })}
      </View>
      <View style={{ flex: 1 }}>
        <Button title="Add point" onPress={addPoint} />
        <Button title="Reset" onPress={() => setdata(DATA)} />
        <Button
          title="Shuffle y values"
          onPress={() =>
            setdata((old) =>
              old.map(({ x }) => ({
                x,
                y: -5 + 10 * Math.random(),
              })),
            )
          }
        />
        {controls?.()}
      </View>
    </View>
  );
}

const DATA = Array.from({ length: 10 })
  .fill(null)
  .map((_, i) => ({ x: i, y: -5 + 10 * Math.random() }));
