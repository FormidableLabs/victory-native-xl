import * as React from "react";
import { Link, Stack } from "expo-router";
import { Text, FlatList, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function LandingPage() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "VN Skia",
          headerLargeTitle: true,
          headerTintColor: "#f04d21",
        }}
      />
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
  { title: "New Line", path: "/new-line" },
  { title: "Time Scale", path: "/time-scale" },
];

const Separator = () => <View style={{ height: 12 }} />;
