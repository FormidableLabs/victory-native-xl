import * as React from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  type TouchableHighlightProps,
} from "react-native";
import { appColors } from "../app/consts/colors";

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
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
    color: appColors.text.dark,
  },
});
