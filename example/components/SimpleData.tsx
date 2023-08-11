import * as React from "react";
import { Button, View } from "react-native";
import { type InputDatum } from "victory-native-skia";

export function SimpleData({
  renderChart,
  controls,
}: {
  renderChart: ({ data }: { data: InputDatum[] }) => JSX.Element;
  controls?: () => JSX.Element;
}) {
  const [data, setData] = React.useState(DATA);

  const addPoint = () => {
    setData((oldData) => [
      ...oldData,
      { x: (oldData.at(-1)?.x || 0) + 1, y: -5 + 10 * Math.random() },
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
        <Button title="Reset" onPress={() => setData(DATA)} />
        <Button
          title="Shuffle y values"
          onPress={() =>
            setData((old) =>
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
