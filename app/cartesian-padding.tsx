import * as React from "react";
import { Button, Text, View } from "react-native";
import { Line } from "../charts/cartesian/Line";
import { CartesianChart } from "../charts/cartesian/CartesianChart";
import { SimpleData } from "../utils/SimpleData";
import Slider from "@react-native-community/slider";

export default function CartesianPaddingPage() {
  const [padding, setPadding] = React.useState(0);

  return (
    <SimpleData
      renderChart={({ data }) => (
        <CartesianChart data={data} padding={{ bottom: padding }}>
          <Line />
        </CartesianChart>
      )}
      controls={() => (
        <View>
          <Slider
            value={padding}
            onValueChange={setPadding}
            minimumValue={0}
            maximumValue={100}
            step={5}
          />
        </View>
      )}
    />
  );
}
