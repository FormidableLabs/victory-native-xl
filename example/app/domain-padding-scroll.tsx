import * as React from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import {
  CartesianChart,
  Line,
  Scatter,
  useChartTransformState,
} from "victory-native";

import { appColors } from "../consts/colors";

const MONTH_WIDTH = 60;
const mockData = Array.from({ length: 10 }, (_, i) => ({
  x: i * MONTH_WIDTH,
  y: Math.random() * 10,
}));

const MinimalReproduction = () => {
  const { state } = useChartTransformState({});

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={{ height: 600 }}>
        <CartesianChart
          data={mockData}
          xKey="x"
          yKeys={["y"]}
          viewport={{ x: [0, MONTH_WIDTH * 4] }} // Show first 4 months
          padding={{ right: 20, bottom: 40 }}
          domainPadding={10} // This causes the issue
          transformState={state}
          transformConfig={{
            pan: {
              enabled: true,
              dimensions: "x",
            },
            pinch: {
              enabled: false,
            },
          }}
        >
          {({ points }) => (
            <>
              <Line
                points={points.y}
                color="blue"
                curveType="linear"
                strokeWidth={1}
              />
              <Scatter
                points={points.y}
                shape="circle"
                radius={4}
                color="blue"
              />
            </>
          )}
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

export default MinimalReproduction;
