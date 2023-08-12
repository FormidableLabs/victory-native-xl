import { ChartOptionsProvider } from "example/components/OptionsProvider";
import { Stack } from "expo-router";
import * as React from "react";
import { SafeAreaView } from "react-native";

export default function Layout() {
  return (
    <ChartOptionsProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen
            name="chart-options-modal"
            options={{
              title: "Chart Options",
              presentation: "modal",
            }}
          />
        </Stack>
      </SafeAreaView>
    </ChartOptionsProvider>
  );
}
