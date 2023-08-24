import * as React from "react";
import {
  StyleSheet,
  TouchableHighlight,
  type TouchableHighlightProps,
} from "react-native";
import { appColors } from "../app/consts/colors";
import { Text } from "./Text";

type ButtonProps = Omit<TouchableHighlightProps, "children"> & {
  title: string;
};

export const Button = ({ style, title, ...rest }: ButtonProps) => {
  return (
    <TouchableHighlight {...rest} style={[styles.touchable, style]}>
      <Text style={styles.text}>{title}</Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  touchable: {
    backgroundColor: appColors.tint,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
  },
});
