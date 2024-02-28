import * as React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import type { PieSliceData } from "./PieSlice";
import { usePieChartContext } from "./contexts/PieChartContext";
import { PieChartLegendItem } from "./PieChartLegendItem";

export type PieLegendPosition = "top" | "bottom" | "left" | "right";
type PieChartLegendProps = {
  position?: PieLegendPosition;
  containerStyle?: StyleProp<ViewStyle>;
  children?: (args: { slice: PieSliceData }) => React.ReactNode;
};

export const PieChartLegend = (props: PieChartLegendProps) => {
  const { position = "bottom", containerStyle, children } = props;

  const { setPosition, data } = usePieChartContext();
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
        return children ? (
          <React.Fragment key={index}>{children({ slice })}</React.Fragment>
        ) : (
          <PieChartLegendItem key={index} slice={slice} />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  containerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  containerColumn: {
    justifyContent: "center",
    flexDirection: "column",
  },
});
