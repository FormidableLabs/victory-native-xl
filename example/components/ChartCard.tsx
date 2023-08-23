import * as React from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { appColors } from "../app/consts/colors";
import { ChartRoutes } from "../app/consts/routes";
import { Link } from "expo-router";

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
          <Text style={styles.description}>{item.description}</Text>
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
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    $dark: {
      shadowOpacity: 0.3,
      borderColor: appColors.cardBorder.dark,
      backgroundColor: appColors.cardBackground.dark,
    },
  },
  title: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 4,
    color: appColors.text.light,
    $dark: {
      color: appColors.text.dark,
    },
  },
  description: {
    color: appColors.text.light,
    $dark: {
      color: appColors.text.dark,
    },
  },
});
