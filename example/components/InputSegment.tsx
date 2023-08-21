import * as React from "react";
import { View, Text } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

type Props<T> = {
  label: string;
  value: T;
  values: T[];
  onChange(value: T): void;
};

export const InputSegment = <T extends string>({
  label,
  value,
  values,
  onChange,
}: Props<T>) => (
  <View style={{ marginVertical: 10, width: "100%" }}>
    <Text style={{ fontWeight: "bold", marginBottom: 10 }}>{label}</Text>
    <SegmentedControl
      style={{ width: "100%" }}
      selectedIndex={values.indexOf(value)}
      values={values.map((v) => v.charAt(0).toUpperCase() + v.slice(1))}
      onChange={(event) => {
        const index = event.nativeEvent.selectedSegmentIndex;
        const valueAtIndex = values.at(index);
        valueAtIndex && onChange(valueAtIndex);
      }}
    />
  </View>
);
