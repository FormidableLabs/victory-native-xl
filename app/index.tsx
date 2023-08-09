import { Link } from "expo-router";
import { Text, SafeAreaView, FlatList, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function LandingPage() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 12 }}
        ItemSeparatorComponent={Separator}
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
    </SafeAreaView>
  );
}

const EXAMPLES: { title: string; path: string }[] = [
  { title: "Plain Bar", path: "/bar" },
  { title: "Plain Line", path: "/line" },
  { title: "Axes", path: "/axes" },
  { title: "Cartesian Padding", path: "/cartesian-padding" },
];

const Separator = () => <View style={{ height: 12 }} />;
