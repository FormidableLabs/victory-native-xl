import * as React from "react";
import { StyleSheet, TouchableHighlight, View } from "react-native";
import { Link } from "expo-router";
import { appColors } from "../app/consts/colors";
import { ChartRoutes } from "../app/consts/routes";
import { Text } from "./Text";

type Props = {
  item: (typeof ChartRoutes)[number];
};

export const ChartCard = ({ item }: Props) => {
  return (
    <Link style={{ flex: 1 }} href={item.path} asChild>
      <TouchableHighlight
        style={styles.touchableHighlight}
        activeOpacity={0.75}
        underlayColor={appColors.tint}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text>{item.description}</Text>
        </View>
      </TouchableHighlight>
    </Link>
  );
};

const styles = StyleSheet.create({
  touchableHighlight: {
    margin: 6,
    borderRadius: 6,
  },
  card: {
    flex: 1,
    backgroundColor: appColors.cardBackground.light,
    borderRadius: 6,
    padding: 15,
    borderColor: appColors.cardBorder.light,
    $dark: {
      backgroundColor: appColors.cardBackground.dark,
    },
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
  },
});
