import * as React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Text } from "./Text";
import { Entypo } from "@expo/vector-icons";
import { useDarkMode } from "react-native-dark";
import { appColors } from "../app/consts/colors";

type Props = {
  message: string;
  fileName: string;
};

export const InfoCard = ({ message, fileName }: Props) => {
  const isDark = useDarkMode();
  return (
    <View style={styles.card}>
      <Text>{message}</Text>
      <View style={styles.file}>
        <Entypo
          name="code"
          size={20}
          color={isDark ? appColors.text.dark : appColors.text.light}
        />
        <Text style={styles.fileName}>example/app/{fileName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: appColors.infoCardBackground.light,
    padding: 15,
    borderRadius: 10,
    $dark: {
      backgroundColor: appColors.infoCardBackground.dark,
    },
  },
  file: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  fileName: {
    fontFamily: Platform.select({
      ios: "Courier New",
      android: "monospace",
    }),
    fontWeight: "bold",
    marginLeft: 10,
  },
});
