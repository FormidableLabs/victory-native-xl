import React, { useState } from "react";
import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
// import ColorPicker from "react-native-wheel-color-picker";
import { useChartOptionsContext } from "example/components/OptionsProvider";
import { useRoute } from "@react-navigation/native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import Slider from "@react-native-community/slider";
import type { RouteProp, ParamListBase } from "@react-navigation/core";

export default function ChartOptionsModal() {
  const { params } =
    useRoute<RouteProp<ParamListBase, "chart-options-modal">>();
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState<number>(0);
  const yKeys = (params as Record<"yKeys", string[]>).yKeys;
  const segments = ["Metrics", "Colors"];
  const { state, dispatch } = useChartOptionsContext();

  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 10, flex: 1 }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <StatusBar style="light" />
        <View style={{ flex: 1, flexDirection: "column" }}>
          <View>
            <SegmentedControl
              values={segments}
              selectedIndex={selectedSegmentIndex}
              onChange={(event) => {
                setSelectedSegmentIndex(event.nativeEvent.selectedSegmentIndex);
              }}
            />
          </View>

          {selectedSegmentIndex === 0 && (
            <View
              style={{
                flex: 1,
                paddingVertical: 20,
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <Text>Stroke Width: {state.strokeWidth}</Text>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={1}
                maximumValue={32}
                step={1}
                value={state.strokeWidth}
                onValueChange={(value) =>
                  dispatch({ type: "SET_STROKE_WIDTH", payload: value })
                }
              />

              <Text>Font Size: {state.fontSize}</Text>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={8}
                maximumValue={24}
                step={1}
                value={state.fontSize}
                onValueChange={(value) =>
                  dispatch({ type: "SET_FONT_SIZE", payload: value })
                }
              />

              <Text>Label Offset X: {state.labelOffsetX}</Text>
              <Slider
                style={{ width: "100%", height: 40 }}
                step={1}
                minimumValue={0}
                maximumValue={25}
                value={state.labelOffsetX}
                onValueChange={(value) =>
                  dispatch({ type: "SET_LABEL_OFFSET_X", payload: value })
                }
              />

              <Text>Label Offset Y: {state.labelOffsetY}</Text>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={0}
                step={1}
                maximumValue={25}
                value={state.labelOffsetY}
                onValueChange={(value) =>
                  dispatch({ type: "SET_LABEL_OFFSET_Y", payload: value })
                }
              />

              <Text>Tick Count X: {state.ticksCountX}</Text>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={0}
                maximumValue={50}
                step={5}
                value={state.ticksCountX}
                onValueChange={(value) =>
                  dispatch({ type: "SET_TICKS_COUNT_X", payload: value })
                }
              />

              <Text>Tick Count Y: {state.ticksCountY}</Text>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={0}
                maximumValue={50}
                step={5}
                value={state.ticksCountY}
                onValueChange={(value) =>
                  dispatch({ type: "SET_TICKS_COUNT_Y", payload: value })
                }
              />
            </View>
          )}
          {selectedSegmentIndex === 1 && (
            <View
              style={{
                flex: 1,
                paddingVertical: 20,
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <Text>Not implemented yet</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
