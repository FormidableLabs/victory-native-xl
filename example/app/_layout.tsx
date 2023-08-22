import { Stack } from "expo-router";
import * as React from "react";
import { Platform, SafeAreaView, Text } from "react-native";
import { useAssets } from "expo-asset";
import { Image, type ImageSource } from "expo-image";

const titleCaseName = (name: string) =>
  name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function Layout() {
  const [assets] = useAssets([
    require("../assets/victory.png"),
  ]) as ImageSource[][];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
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
                        color: "#f04d21",
                      }}
                    >
                      {titleCaseName(children)}
                    </Text>
                  }
                </>
              )
            );
          },
          headerTintColor: "#f04d21",
        }}
      />
    </SafeAreaView>
  );
}
