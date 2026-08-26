import * as React from "react";
import { Stack } from "expo-router";
import {
  SectionList,
  View,
  useWindowDimensions,
  StyleSheet,
  Linking,
} from "react-native";
import { ChartCard } from "../components/ChartCard";
import { appColors } from "../consts/colors";
import {
  getChartRouteSections,
  type ChartRoute,
  type ChartRouteSectionTitle,
} from "../consts/routes";
import { InfoCard } from "../components/InfoCard";
import { Button } from "../components/Button";
import { VICTORY_OSS_URL } from "../consts/urls";
import { Text } from "../components/Text";

type ChartRouteRowSection = {
  title: ChartRouteSectionTitle;
  count: number;
  data: ChartRoute[][];
};

export default function LandingPage() {
  const { width } = useWindowDimensions();
  const columnCount = width < 500 ? 1 : 2;
  const routeSections = getChartRouteRowSections(columnCount);

  const handleDocsButtonPress = React.useCallback(async () => {
    (await Linking.canOpenURL(VICTORY_OSS_URL)) &&
      Linking.openURL(VICTORY_OSS_URL);
  }, []);

  return (
    <View style={styles.view}>
      <Stack.Screen options={{ title: "Victory" }} />
      <SectionList
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
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        sections={routeSections}
        stickySectionHeadersEnabled={false}
        keyExtractor={(item) => item.map((route) => route.path).join(":")}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text selectable style={styles.sectionTitle}>
              {section.title}
            </Text>
            <Text style={styles.sectionCount}>{section.count} examples</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.cardRow}>
            {item.map((route) => (
              <View key={route.path} style={styles.cardCell}>
                <ChartCard item={route} />
              </View>
            ))}
            {item.length < columnCount ? (
              <View style={styles.cardCell} />
            ) : null}
          </View>
        )}
      />
    </View>
  );
}

const getChartRouteRowSections = (
  columnCount: number,
): ChartRouteRowSection[] =>
  getChartRouteSections().map(({ title, data }) => ({
    title,
    count: data.length,
    data: getChartRouteRows(data, columnCount),
  }));

const getChartRouteRows = (routes: ChartRoute[], columnCount: number) => {
  const rows: ChartRoute[][] = [];

  for (let index = 0; index < routes.length; index += columnCount) {
    rows.push(routes.slice(index, index + columnCount));
  }

  return rows;
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: { backgroundColor: appColors.viewBackground.dark },
  },
  content: {
    padding: 10,
  },
  sectionHeader: {
    paddingHorizontal: 6,
    paddingTop: 18,
    paddingBottom: 4,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionCount: {
    fontSize: 13,
    opacity: 0.68,
  },
  cardRow: {
    flexDirection: "row",
  },
  cardCell: {
    flex: 1,
  },
});
