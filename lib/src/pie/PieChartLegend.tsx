import * as React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import type { PieSliceData } from "./PieSlice";
import { usePieChartContext } from "./contexts/PieChartContext";

export type PieLegendPosition = "top" | "bottom" | "left" | "right";
type PieChartLegendProps = {
  data: PieSliceData[];
  position?: PieLegendPosition;
  containerStyle?: StyleProp<ViewStyle>;
  children: (args: { slice: PieSliceData }) => React.ReactNode;
};

export const PieChartLegend = (props: PieChartLegendProps) => {
  const { data, position = "bottom", containerStyle, children } = props;

  const { setPosition } = usePieChartContext();
  React.useLayoutEffect(() => {
    setPosition(position);
    return () => {};
  }, [position, setPosition]);

  const isHorizontal = position === "top" || position === "bottom";
  const baseContainerStyle = isHorizontal
    ? styles.containerRow
    : styles.containerColumn;

  return (
    <View style={[baseContainerStyle, containerStyle]}>
      {data.map((slice, index) => {
        return (
          <React.Fragment key={index}>{children({ slice })}</React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  containerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "hidden",
  },
  containerColumn: {
    justifyContent: "center",
    flexDirection: "column",
    overflow: "hidden",
  },
});
