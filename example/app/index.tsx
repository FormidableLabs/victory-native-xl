import * as React from "react";
import { Stack } from "expo-router";
import { FlatList, View, useWindowDimensions, StyleSheet } from "react-native";
import { ChartCard } from "../components/ChartCard";
import { appColors } from "./consts/colors";
import { ChartRoutes } from "./consts/routes";

export default function LandingPage() {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.view}>
      <Stack.Screen options={{ title: "Victory" }} />
      <FlatList
        contentContainerStyle={{ padding: 10 }}
        numColumns={width < 500 ? 1 : 2}
        contentInsetAdjustmentBehavior="automatic"
        data={ChartRoutes}
        renderItem={({ item }) => <ChartCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: { backgroundColor: appColors.viewBackground.dark },
  },
});
