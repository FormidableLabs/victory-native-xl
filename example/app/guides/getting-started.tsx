import * as React from "react";
import { StyleSheet, View, SafeAreaView, Linking } from "react-native";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import type { SharedValue } from "react-native-reanimated";
import { Button } from "example/components/Button";
import { appColors } from "../../consts/colors";
import inter from "../../assets/inter-medium.ttf";
import { urlForRoute } from "../../consts/routes";

export default function GettingStartedScreen(props: { segment: string }) {
  const font = useFont(inter, 12);
  const { state, isActive } = useChartPressState({ x: 0, y: { highTmp: 0 } });
  const url = urlForRoute(props.segment);

  const handleDocsButtonPress = React.useCallback(async () => {
    url && (await Linking.canOpenURL(url)) && Linking.openURL(url);
  }, [url]);

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={{ margin: 20 }}>
        <Button onPress={handleDocsButtonPress} title="Read Docs" />
      </View>
      <View style={{ flex: 1, maxHeight: 400, padding: 32 }}>
        <CartesianChart
          data={DATA}
          xKey="day"
          yKeys={["highTmp"]}
          axisOptions={{
            font,
          }}
          chartPressState={state}
        >
          {({ points }) => (
            <>
              <Line points={points.highTmp} color="red" strokeWidth={3} />
              {isActive && (
                <ToolTip x={state.x.position} y={state.y.highTmp.position} />
              )}
            </>
          )}
        </CartesianChart>
      </View>
    </SafeAreaView>
  );
}

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color="black" />;
}

const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i,
  highTmp: 40 + 30 * Math.random(),
}));

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
});
