import * as React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useDarkMode } from "react-native-dark";
import { Text } from "./Text";
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
        {Platform.OS === "ios" ? (
          <Entypo
            name="code"
            size={20}
            style={{ marginRight: 10 }}
            color={isDark ? appColors.text.dark : appColors.text.light}
          />
        ) : null}
        <Text style={styles.fileName}>example/app/{fileName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
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
  },
});
