import * as React from "react";
import { Link, Stack } from "expo-router";
import { Text, FlatList, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function LandingPage() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: "Victory" }} />
      <FlatList
        contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 12 }}
        ItemSeparatorComponent={Separator}
        contentInsetAdjustmentBehavior="automatic"
        data={EXAMPLES}
        renderItem={({ item }) => (
          <Link href={item.path} asChild>
            <TouchableOpacity
              style={{
                padding: 12,
                borderRadius: 8,
                backgroundColor: "lightgray",
              }}
            >
              <Text>{item.title}</Text>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
}

const EXAMPLES: { title: string; path: string }[] = [
  { title: "Line Chart", path: "/line-chart" },
  { title: "New Line", path: "/new-line" },
  { title: "Time Scale", path: "/time-scale" },
  { title: "Stock Price", path: "/stock-price" },
  { title: "Animated Path", path: "/animated-path" },
  { title: "Domain Bounds", path: "/domain-bounds" },
  { title: "Ordinal Data", path: "/ordinal-data" },
  { title: "Custom Drawing", path: "/custom-drawing" },
];

const Separator = () => <View style={{ height: 12 }} />;
