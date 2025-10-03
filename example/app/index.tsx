import * as React from "react";
import { Stack, useRouter } from "expo-router";
import {
  FlatList,
  View,
  useWindowDimensions,
  StyleSheet,
  Linking,
} from "react-native";
import { ChartCard } from "../components/ChartCard";
import { appColors } from "../consts/colors";
import { ChartRoutes } from "../consts/routes";
import { InfoCard } from "../components/InfoCard";
import { Button } from "../components/Button";
import { VICTORY_OSS_URL } from "../consts/urls";
import { Text } from "../components/Text";

export default function LandingPage() {
  const router = useRouter();

  React.useEffect(() => {
    setTimeout(() => {
      router.replace("/guides/getting-started");
    }, 100);
  }, [router]);
  const { width } = useWindowDimensions();

  const handleDocsButtonPress = React.useCallback(async () => {
    (await Linking.canOpenURL(VICTORY_OSS_URL)) &&
      Linking.openURL(VICTORY_OSS_URL);
  }, []);

  return (
    <View style={styles.view}>
      <Stack.Screen options={{ title: "Victory" }} />
      <FlatList
        ListHeaderComponent={() => (
          <InfoCard style={{ margin: 5, width: "auto" }}>
            <View style={{ flex: 1, gap: 10 }}>
              <Text>
                Explore the Victory Native app, designed to highlight the core
                features of Victory Native’s API, customization options, and
                capabilities.
              </Text>
              <Button onPress={handleDocsButtonPress} title="Read the Docs" />
            </View>
          </InfoCard>
        )}
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
