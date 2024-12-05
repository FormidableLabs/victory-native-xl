import * as React from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  type TouchableHighlightProps,
} from "react-native";
import { useDarkMode } from "react-native-dark";
import { appColors } from "../consts/colors";

type ButtonProps = Omit<TouchableHighlightProps, "children"> & {
  title: string;
};

export const Button = ({ style, title, ...rest }: ButtonProps) => {
  const isDark = useDarkMode();
  return (
    <TouchableHighlight
      underlayColor={
        isDark
          ? appColors.buttonUnderlayColor.dark
          : appColors.buttonUnderlayColor.light
      }
      {...rest}
      style={[styles.touchable, style]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  touchable: {
    backgroundColor: appColors.buttonBackgroundColor.light,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    borderWidth: StyleSheet.hairlineWidth,
    borderTopWidth: 1,
    borderColor: appColors.buttonBorderColor.light,
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1,
    $dark: {
      borderColor: appColors.buttonBorderColor.dark,
      backgroundColor: appColors.buttonBackgroundColor.dark,
    },
  },
  text: {
    fontWeight: "bold",
    color: appColors.text.light,
    $dark: {
      color: appColors.text.dark,
    },
  },
});
