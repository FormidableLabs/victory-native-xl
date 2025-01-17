import * as React from "react";
import { Bar, CartesianChart } from "victory-native";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { appColors } from "../consts/colors";

const data = [
  {
    year: 2025,
    amountPerMonth: 20084,
  },
  {
    year: 2026,
    amountPerMonth: 19705,
  },
  {
    year: 2027,
    amountPerMonth: 19485,
  },
];

export const BarWithPadding = () => {
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.chart}>
        <CartesianChart
          data={data}
          xKey="year"
          yKeys={["amountPerMonth"]}
          // domainPadding={{ left: 25, right: 25 }}
          padding={25}
        >
          {({ points, chartBounds, ...rest }) => {
            console.log("points", points.amountPerMonth);
            console.log("chartBounds", chartBounds);
            console.log("canvasSize", rest.canvasSize);
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
  chart: {
    flex: 1.5,
  },
});

export default BarWithPadding;
