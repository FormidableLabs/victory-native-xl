import React, { useState } from "react";
import { View, Image, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  type CartesianActionsHandle,
  CartesianChart,
  Line,
  useChartPressState,
  type CartesianChartRef,
} from "victory-native";
import { Circle, useFont, ImageFormat } from "react-native-skia";
import {
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
} from "react-native-reanimated";
import { useDarkMode } from "react-native-dark";
import { styles } from "../styles/chart-refs.styles";
import { Button } from "../components/Button";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "../consts/colors";

const randomNumber = () => Math.floor(Math.random() * (50 - 25 + 1)) + 25;
const PROGRAMMATIC_TOUCH = { x: 180, y: 180 };

const DATA = (numberPoints = 13) =>
  Array.from({ length: numberPoints }, (_, index) => ({
    day: index + 1,
    sales: randomNumber(),
  }));
function ToolTip({
  x,
  y,
  color = "red",
}: {
  x: SharedValue<number>;
  y: SharedValue<number>;
  color?: string;
}) {
  return <Circle cx={x} cy={y} r={6} color={color} />;
}

export default function ChartRefsExample() {
  const isDark = useDarkMode();
  const [data, setData] = useState(DATA());

  const colors = {
    stroke: isDark ? "#fafafa" : "#71717a",
    xLine: isDark ? "#71717a" : "#ffffff",
    yLine: isDark ? "#aabbcc" : "#ddfa55",
    frameLine: isDark ? "#444" : "#aaa",
    xLabel: isDark ? appColors.text.dark : appColors.text.light,
    yLabel: isDark ? appColors.text.dark : appColors.text.light,
    scatter: "#a78bfa",
  };
  const font = useFont(inter, 12);
  // Create chart press state for interactivity
  const { state } = useChartPressState<{
    x: number;
    y: Record<"sales", number>;
  }>({
    x: 0,
    y: { sales: 0 },
  });
  const chartRef =
    React.useRef<CartesianChartRef<typeof state | undefined>>(null);
  const actionRef = React.useRef<CartesianActionsHandle<typeof state> | null>(
    null,
  );
  const [snapshotUri, setSnapshotUri] = React.useState<string | null>(null);
  const [lastAction, setLastAction] = React.useState("none");
  const [matchedIndex, setMatchedIndex] = React.useState(-1);

  useAnimatedReaction(
    () => state.matchedIndex.value,
    (value, previousValue) => {
      if (value !== previousValue) {
        runOnJS(setMatchedIndex)(value);
      }
    },
  );

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setLastAction("actions ref auto");
      state.isActive.value = true;
      actionRef.current?.handleTouch(
        state,
        PROGRAMMATIC_TOUCH.x,
        PROGRAMMATIC_TOUCH.y,
      );
    }, 500);

    return () => clearTimeout(timeout);
  }, [state]);

  const handleProgrammaticTouch = () => {
    setLastAction("chart ref");
    state.isActive.value = true;
    chartRef.current?.actions.handleTouch(
      state,
      PROGRAMMATIC_TOUCH.x,
      PROGRAMMATIC_TOUCH.y,
    );
  };

  const handleActionsRefTouch = () => {
    setLastAction("actions ref");
    state.isActive.value = true;
    actionRef.current?.handleTouch(
      state,
      PROGRAMMATIC_TOUCH.x,
      PROGRAMMATIC_TOUCH.y,
    );
  };

  const handleRedraw = () => {
    if (chartRef.current?.canvas) {
      chartRef.current.canvas.redraw();
    }
  };

  // Skia 3 exposes a synchronous CanvasRef snapshot API.
  const handleSnapshot = () => {
    const canvas = chartRef.current?.canvas;
    if (!canvas) return;
    try {
      const image = canvas.makeImageSnapshot();
      try {
        const encoded = image.encodeToBase64(ImageFormat.PNG, 100);
        setSnapshotUri(`data:image/png;base64,${encoded}`);
      } finally {
        image.dispose();
      }
    } catch (error) {
      console.error("Failed to take snapshot:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.chartContainer}>
        <CartesianChart
          actionsRef={actionRef}
          ref={chartRef}
          data={data}
          xKey="day"
          yKeys={["sales"]}
          axisOptions={{
            font,
            lineWidth: { grid: { x: 0, y: 2 }, frame: 0 },
            lineColor: {
              grid: {
                x: colors.xLine!,
                y: colors.yLine!,
              },
              frame: colors.frameLine!,
            },
          }}
          chartPressState={state}
        >
          {({ points }) => (
            <>
              <Line
                points={points.sales}
                color={colors.stroke}
                strokeWidth={2}
              />
              <ToolTip
                x={state.x.position}
                y={state.y.sales.position}
                color={colors.scatter}
              />
            </>
          )}
        </CartesianChart>
      </View>
      <ScrollView
        style={styles.optionsScrollView}
        contentContainerStyle={styles.options}
      >
        <View style={styles.dataActions}>
          <Button
            style={styles.flex1}
            onPress={() => setData((data) => DATA(data.length))}
            title="Shuffle Data"
          />
          <Button
            style={styles.flex1}
            onPress={() =>
              setData((data) => [
                ...data,
                {
                  day: data.length + 1,
                  sales: randomNumber(),
                },
              ])
            }
            title="Add Point"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={handleProgrammaticTouch} title="Trigger Touch" />
          <Button onPress={handleActionsRefTouch} title="Actions Ref Touch" />
          <Button onPress={handleRedraw} title="Redraw" />
          <Button onPress={handleSnapshot} title="Take Snapshot" />
        </View>
        <Text style={styles.debugLabel}>
          Last action: {lastAction} | matchedIndex: {matchedIndex}
        </Text>

        {snapshotUri && (
          <View style={styles.snapshotContainer}>
            <Image
              source={{ uri: snapshotUri }}
              style={styles.snapshot}
              resizeMode="contain"
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
