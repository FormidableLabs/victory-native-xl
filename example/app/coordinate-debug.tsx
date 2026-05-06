import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import {
  CartesianChart,
  type ChartPressState,
  Line,
  Scatter,
  setScale,
  setTranslate,
  useChartPressState,
  useChartTransformState,
} from "victory-native";
import {
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
} from "react-native-reanimated";
import { Button } from "example/components/Button";
import { InfoCard } from "example/components/InfoCard";
import { Text } from "example/components/Text";
import { appColors } from "../consts/colors";
import inter from "../assets/inter-medium.ttf";

type PressState = ChartPressState<{ x: number; y: { highTmp: number } }>;
type TransformState = ReturnType<typeof useChartTransformState>["state"];

type Readout = {
  active: boolean;
  index: number;
  xValue: number;
  xPosition: number;
  yValue: number;
  yPosition: number;
  scaleX: number;
  translateX: number;
};

const DATA = Array.from({ length: 31 }, (_, day) => ({
  day,
  highTmp: 45 + ((day * 13) % 34),
}));

const initialReadout: Readout = {
  active: false,
  index: -1,
  xValue: 0,
  xPosition: 0,
  yValue: 0,
  yPosition: 0,
  scaleX: 1,
  translateX: 0,
};

export default function CoordinateDebugScreen() {
  const font = useFont(inter, 12);
  const nestedPress = useChartPressState({ x: 0, y: { highTmp: 0 } });
  const transformedPress = useChartPressState({ x: 0, y: { highTmp: 0 } });
  const { state: transformState } = useChartTransformState();

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView contentContainerStyle={styles.content}>
        <InfoCard>
          Coordinate debug fixture for press mapping. Tap or drag across each
          chart and compare the displayed index and x value with the touched
          horizontal position.
        </InfoCard>

        <Text style={styles.heading}>Nested Padded Chart</Text>
        <View style={styles.nestedOuter}>
          <View style={styles.chartFrame}>
            <CartesianChart
              data={DATA}
              xKey="day"
              yKeys={["highTmp"]}
              padding={{ left: 30, right: 20, top: 20, bottom: 30 }}
              chartPressState={nestedPress.state}
              axisOptions={{ font }}
            >
              {({ points }) => (
                <>
                  <Line points={points.highTmp} color="red" strokeWidth={3} />
                  <Scatter points={points.highTmp} color="#a78bfa" radius={4} />
                  {nestedPress.isActive && (
                    <ToolTip
                      x={nestedPress.state.x.position}
                      y={nestedPress.state.y.highTmp.position}
                    />
                  )}
                </>
              )}
            </CartesianChart>
          </View>
        </View>
        <ReadoutPanel state={nestedPress.state} />

        <Text style={styles.heading}>Transform + Press Chart</Text>
        <View style={styles.chartFrame}>
          <CartesianChart
            data={DATA}
            xKey="day"
            yKeys={["highTmp"]}
            chartPressState={transformedPress.state}
            transformState={transformState}
            transformConfig={{
              pan: { enabled: true, dimensions: ["x"] },
              pinch: { enabled: true, dimensions: ["x"] },
            }}
            axisOptions={{ font }}
          >
            {({ points }) => (
              <>
                <Line points={points.highTmp} color="red" strokeWidth={3} />
                <Scatter points={points.highTmp} color="#a78bfa" radius={4} />
                {transformedPress.isActive && (
                  <ToolTip
                    x={transformedPress.state.x.position}
                    y={transformedPress.state.y.highTmp.position}
                  />
                )}
              </>
            )}
          </CartesianChart>
        </View>
        <ReadoutPanel
          state={transformedPress.state}
          transformState={transformState}
        />
        <View style={styles.buttonRow}>
          <Button
            style={styles.button}
            title="Zoom 2x"
            onPress={() => {
              transformState.matrix.value = setScale(
                transformState.matrix.value,
                2,
                1,
              );
            }}
          />
          <Button
            style={styles.button}
            title="Pan +80"
            onPress={() => {
              transformState.matrix.value = setTranslate(
                transformState.matrix.value,
                80,
                0,
              );
            }}
          />
          <Button
            style={styles.button}
            title="Reset"
            onPress={() => {
              transformState.matrix.value = setScale(
                setTranslate(transformState.matrix.value, 0, 0),
                1,
                1,
              );
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ReadoutPanel({
  state,
  transformState,
}: {
  state: PressState;
  transformState?: TransformState;
}) {
  const readout = usePressReadout(state, transformState);

  return (
    <View style={styles.readout}>
      <Text style={styles.readoutText}>active: {String(readout.active)}</Text>
      <Text style={styles.readoutText}>matchedIndex: {readout.index}</Text>
      <Text style={styles.readoutText}>x.value: {readout.xValue}</Text>
      <Text style={styles.readoutText}>
        x.position: {readout.xPosition.toFixed(1)}
      </Text>
      <Text style={styles.readoutText}>y.value: {readout.yValue}</Text>
      <Text style={styles.readoutText}>
        y.position: {readout.yPosition.toFixed(1)}
      </Text>
      <Text style={styles.readoutText}>
        scaleX: {readout.scaleX.toFixed(2)}
      </Text>
      <Text style={styles.readoutText}>
        translateX: {readout.translateX.toFixed(1)}
      </Text>
    </View>
  );
}

function usePressReadout(state: PressState, transformState?: TransformState) {
  const [readout, setReadout] = React.useState(initialReadout);

  useAnimatedReaction(
    () => ({
      active: state.isActive.value,
      index: state.matchedIndex.value,
      xValue: state.x.value.value,
      xPosition: state.x.position.value,
      yValue: state.y.highTmp.value.value,
      yPosition: state.y.highTmp.position.value,
      scaleX: transformState?.matrix.value?.[0] ?? 1,
      translateX: transformState?.matrix.value?.[3] ?? 0,
    }),
    (next) => {
      runOnJS(setReadout)(next);
    },
  );

  return readout;
}

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color="black" />;
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
  content: {
    padding: 20,
    gap: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
  },
  nestedOuter: {
    paddingLeft: 28,
    paddingTop: 18,
    paddingRight: 12,
    backgroundColor: "rgba(167, 139, 250, 0.15)",
  },
  chartFrame: {
    height: 260,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#a78bfa",
  },
  readout: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(127, 127, 127, 0.14)",
  },
  readoutText: {
    fontVariant: ["tabular-nums"],
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    flex: 1,
  },
});
