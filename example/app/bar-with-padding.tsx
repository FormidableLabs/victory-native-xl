import * as React from "react";
import { Bar, CartesianChart } from "victory-native";
import { SafeAreaView, StyleSheet, View, ScrollView } from "react-native";
import { useFont } from "@shopify/react-native-skia";
import { InputSlider } from "../components/InputSlider";
import { appColors } from "../consts/colors";
import inter from "../assets/inter-medium.ttf";

const data = [
  {
    year: "2025",
    amountPerMonth: 20084,
  },
  {
    year: "2026",
    amountPerMonth: 19705,
  },
  {
    year: "2027",
    amountPerMonth: 19485,
  },
];

export const BarWithPadding = () => {
  const [clipPadding, setClipPadding] = React.useState(0);
  const [padding, setPadding] = React.useState(0);
  const [domainPadding, setDomainPadding] = React.useState(0);
  const font = useFont(inter, 12);
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.chart}>
        <CartesianChart
          // pad the clip rect bounds
          clipPadding={{
            left: clipPadding,
            right: clipPadding,
          }}
          data={data}
          xKey="year"
          xAxis={{
            tickCount: 3,
            font,
          }}
          yKeys={["amountPerMonth"]}
          domainPadding={{ left: domainPadding, right: domainPadding }}
          padding={padding}
        >
          {({ points, chartBounds }) => {
            console.log("points", points.amountPerMonth);
            console.log("chartBounds", chartBounds);
            return (
              <Bar
                points={points.amountPerMonth}
                barWidth={50}
                chartBounds={chartBounds}
              />
            );
          }}
        </CartesianChart>
      </View>
      <ScrollView
        style={styles.optionsScrollView}
        contentContainerStyle={styles.options}
      >
        <InputSlider
          label="Clip Padding (adds padding to the clip rect)"
          maxValue={50}
          minValue={0}
          step={1}
          value={clipPadding}
          onChange={setClipPadding}
        />
        <InputSlider
          label="Padding"
          maxValue={50}
          minValue={3}
          step={1}
          value={padding}
          onChange={setPadding}
        />
        <InputSlider
          label="Domain Padding"
          maxValue={50}
          minValue={0}
          step={1}
          value={domainPadding}
          onChange={setDomainPadding}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
  optionsScrollView: {
    flex: 1,
    backgroundColor: appColors.cardBackground.light,
    $dark: {
      backgroundColor: appColors.cardBackground.dark,
    },
  },
  chart: {
    flex: 1.5,
    width: 350,
    justifyContent: "center",
    padding: 20,
  },
  options: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});

export default BarWithPadding;
