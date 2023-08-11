import * as React from "react";
import { View } from "react-native";

export function KeyedData({
  renderChart,
  controls,
}: {
  renderChart: ({ data }: { data: Datum[] }) => JSX.Element;
  controls?: () => JSX.Element;
}) {
  const [data] = React.useState(DATA);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ flex: 1, width: "100%", backgroundColor: "rgb(240,240,240)" }}
      >
        {renderChart({ data })}
      </View>
      <View style={{ flex: 1 }}>{controls?.()}</View>
    </View>
  );
}

type Datum = { quarter: number; earnings: number; spend: number };

const DATA: Datum[] = [
  { quarter: 1, earnings: 13000, spend: 2000 },
  { quarter: 2, earnings: 16500, spend: 4000 },
  { quarter: 3, earnings: 14250, spend: 5000 },
  { quarter: 4, earnings: 19000, spend: 6000 },
];
