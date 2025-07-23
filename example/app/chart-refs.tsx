import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  type CartesianActionsHandle,
  CartesianChart,
  Line,
  useChartPressState,
  type CartesianChartRef,
} from "victory-native";
import { Circle, useFont, ImageFormat } from "@shopify/react-native-skia";
import { type SharedValue } from "react-native-reanimated";
import { useDarkMode } from "react-native-dark";
import { Button } from "../components/Button";
import inter from "../assets/inter-medium.ttf";
import { appColors } from "../consts/colors";

const randomNumber = () => Math.floor(Math.random() * (50 - 25 + 1)) + 25;

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
  const actionRef = React.useRef<CartesianActionsHandle>(null);
  const [snapshotUri, setSnapshotUri] = React.useState<string | null>(null);

  const handleProgrammaticTouch = () => {
    if (chartRef.current) {
      const x = Math.floor(Math.random() * data.length);
      const y = randomNumber();
      chartRef.current.actions.handleTouch(state, x, y);
    }
  };

  const handleRedraw = () => {
    if (chartRef.current?.canvas) {
      chartRef.current.canvas.redraw();
    }
  };

  const handleSnapshot = async () => {
    if (chartRef.current?.canvas) {
      try {
        setSnapshotUri(null);
        const sKImage = await chartRef.current.canvas.makeImageSnapshot();
        const skData = sKImage.encodeToBase64(ImageFormat.PNG, 100);
        setSnapshotUri(`data:image/png;base64,${skData}`);
      } catch (err) {
        console.error("Failed to take snapshot:", err);
      }
    }
  };

  const handleAsyncSnapshot = () => {
    if (chartRef.current?.canvas) {
      setSnapshotUri(null);
      chartRef.current.canvas
        .makeImageSnapshotAsync()
        .then((sKImage) => {
          const skData = sKImage.encodeToBase64(ImageFormat.PNG, 100);
          setSnapshotUri(`data:image/png;base64,${skData}`);
        })
        .catch((err) => {
          console.error("Failed to take async snapshot:", err);
        });
    }
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={{ flex: 1, maxHeight: 400, padding: 0 }}>
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
              {true && (
                <ToolTip
                  x={state.x.position}
                  y={state.y.sales.position}
                  color={colors.scatter}
                />
              )}
            </>
          )}
        </CartesianChart>
      </View>
      <ScrollView
        style={styles.optionsScrollView}
        contentContainerStyle={styles.options}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginVertical: 16,
          }}
        >
          <Button
            style={{ flex: 1 }}
            onPress={() => setData((data) => DATA(data.length))}
            title="Shuffle Data"
          />
          <Button
            style={{ flex: 1 }}
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
          <Button onPress={handleRedraw} title="Redraw" />
          <Button onPress={handleSnapshot} title="Take Snapshot" />
          <Button onPress={handleAsyncSnapshot} title="Async Snapshot" />
        </View>

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

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 16,
    gap: 8,
  },
  snapshotContainer: {
    marginTop: 20,
    height: 300,
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
  },
  snapshot: {
    width: "100%",
    height: "100%",
  },
  optionsScrollView: {
    flex: 0.5,
    backgroundColor: appColors.cardBackground.light,
    $dark: {
      backgroundColor: appColors.cardBackground.dark,
    },
  },
  options: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});
