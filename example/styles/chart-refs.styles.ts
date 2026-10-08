import { StyleSheet } from "react-native";
import { appColors } from "../consts/colors";

export const styles = StyleSheet.create({
  chartContainer: { flex: 1, maxHeight: 400 },
  flex1: { flex: 1 },
  dataActions: { flexDirection: "row", gap: 12, paddingVertical: 16 },
  safeView: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 8,
  },
  debugLabel: {
    color: appColors.text.light,
    fontSize: 14,
    $dark: {
      color: appColors.text.dark,
    },
  },
  snapshotContainer: {
    height: 300,
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
  },
  snapshot: {
    width: "100%",
    height: "100%",
  },
  optionsScrollView: {
    flex: 0.5,
    backgroundColor: appColors.cardBackground.light,
    $dark: {
      backgroundColor: appColors.cardBackground.dark,
    },
  },
  options: {
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});
