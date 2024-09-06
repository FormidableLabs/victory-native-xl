import * as React from "react";
import { View, Switch } from "react-native";
import { Text } from "./Text";

type Props = {
  label: string;
  value: boolean;
  onChange(value: boolean): void;
};

export const InputCheckbox = ({ label, value, onChange }: Props) => (
  <View
    style={{
      width: "100%",
      marginVertical: 10,
      alignItems: "center",
      flexDirection: "row",
    }}
  >
    <Text
      style={{
        fontWeight: "bold",
        marginRight: 10,
      }}
    >
      {label}
    </Text>
    <Switch value={value} onValueChange={onChange} />
  </View>
);
