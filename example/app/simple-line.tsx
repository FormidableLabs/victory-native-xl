import { Path, useFont } from "@shopify/react-native-skia";
import * as React from "react";
import { ScrollView, Text, View } from "react-native";
import { CartesianChart } from "victory-native";
import inter from "../assets/inter-medium.ttf";
import BottomSheet from "@gorhom/bottom-sheet";
import { InputSlider } from "example/components/InputSlider";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

export default function SimpleLinePage() {
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const [strokeWidth, setStrokeWidth] = React.useState(1);
  const [xLabelOffset, setXLabelOffset] = React.useState(4);
  const [yLabelOffset, setYLabelOffset] = React.useState(4);
  const [chartPadding, setChartPadding] = React.useState(4);
  const [fontSize, setFontSize] = React.useState(12);
  const [yTickCount, setYTickCount] = React.useState(10);
  const [xTickCount, setXTickCount] = React.useState(10);
  const [axisSide, setAxisSide] = React.useState<"left" | "right">("left");
  const font = useFont(inter, fontSize);

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.667 }}>
          <CartesianChart
            xKey="day"
            padding={chartPadding}
            yKeys={["sales"]}
            gridOptions={{
              font,
              yLabelOffset,
              xLabelOffset,
              yTicks: yTickCount,
              xTicks: xTickCount,
              yAxisPosition: axisSide,
              formatXLabel: (n) => String(n) + "!",
            }}
            data={[
              { sales: 5, day: 1 },
              { sales: 8, day: 2 },
              { sales: 4, day: 3 },
              { sales: 13, day: 4 },
              { sales: 7, day: 5 },
            ]}
          >
            {({ paths }) => {
              return (
                <Path
                  path={paths["sales.line"]}
                  style="stroke"
                  color="black"
                  strokeWidth={strokeWidth}
                />
              );
            }}
          </CartesianChart>
        </View>
        <BottomSheet ref={bottomSheetRef} index={1} snapPoints={["5%", "30%"]}>
          <ScrollView
            style={{
              flex: 1,
            }}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 15,
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <InputSlider
              label="Stroke Width"
              maxValue={32}
              minValue={1}
              step={1}
              value={strokeWidth}
              onChange={setStrokeWidth}
            />
            <InputSlider
              label="X-axis Label Offset"
              maxValue={12}
              minValue={0}
              step={1}
              value={xLabelOffset}
              onChange={setXLabelOffset}
            />
            <InputSlider
              label="Y-axis Label Offset"
              maxValue={12}
              minValue={0}
              step={1}
              value={yLabelOffset}
              onChange={setYLabelOffset}
            />
            <InputSlider
              label="Chart Padding"
              maxValue={20}
              minValue={0}
              step={1}
              value={chartPadding}
              onChange={setChartPadding}
            />
            <InputSlider
              label="Font Size"
              maxValue={24}
              minValue={8}
              step={1}
              value={fontSize}
              onChange={setFontSize}
            />
            <InputSlider
              label="Number of ticks on X axis"
              maxValue={15}
              minValue={0}
              step={5}
              value={xTickCount}
              onChange={setXTickCount}
            />
            <InputSlider
              label="Number of ticks on Y axis"
              maxValue={20}
              minValue={0}
              step={5}
              value={yTickCount}
              onChange={setYTickCount}
            />
            <View style={{ marginVertical: 10, width: "100%" }}>
              <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
                Axis Position
              </Text>
              <SegmentedControl
                style={{ width: "100%" }}
                selectedIndex={axisSide === "left" ? 0 : 1}
                values={["Left", "Right"]}
                onChange={(event) => {
                  const index = event.nativeEvent.selectedSegmentIndex;
                  setAxisSide(index === 0 ? "left" : "right");
                }}
              />
            </View>
          </ScrollView>
        </BottomSheet>
      </View>
    </>
  );
}
