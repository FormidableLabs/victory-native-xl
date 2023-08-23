import { Stack } from "expo-router";
import * as React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useAssets } from "expo-asset";
import { Image, type ImageSource } from "expo-image";
import { appColors } from "./consts/colors";
import { useDarkMode } from "react-native-dark";

const titleCaseName = (name: string) =>
  name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function Layout() {
  const isDark = useDarkMode();
  const [assets] = useAssets([
    require("../assets/victory.png"),
  ]) as ImageSource[][];

  return (
    <View style={styles.layout}>
      <Stack
        screenOptions={{
          headerTransparent: Boolean(Platform.OS === "ios"),
          headerBlurEffect: isDark ? "dark" : "light",
          headerStyle: {
            backgroundColor:
              Platform.OS === "android"
                ? isDark
                  ? appColors.androidHeader.dark
                  : appColors.androidHeader.light
                : undefined,
          },
          headerTitle: ({ children }) => {
            return (
              assets?.at(0) && (
                <>
                  <Image
                    style={{ width: 24, height: 24 }}
                    source={assets.at(0)}
                  />
                  {
                    <Text
                      style={{
                        marginHorizontal: Platform.select({
                          ios: 5,
                          android: 8,
                        }),
                        fontSize: 16,
                        color: appColors.tint,
                      }}
                    >
                      {titleCaseName(children)}
                    </Text>
                  }
                </>
              )
            );
          },
          headerTintColor: appColors.tint,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: { backgroundColor: appColors.viewBackground.dark },
  },
});
