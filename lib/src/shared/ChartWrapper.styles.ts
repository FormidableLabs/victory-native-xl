import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  overflowHidden: {
    overflow: "hidden",
  },
});

export const sizeStyle = (width: number, height: number) => ({ width, height });
