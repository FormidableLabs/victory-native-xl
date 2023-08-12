import React, { useState } from "react";
import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import ColorPicker from "react-native-wheel-color-picker";
import { useChartOptionsContext } from "example/components/OptionsProvider";
import { useRoute } from "@react-navigation/native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import Slider from "@react-native-community/slider";
import type { RouteProp, ParamListBase } from "@react-navigation/core";

export default function ChartOptionsModal() {
  const { params } =
    useRoute<RouteProp<ParamListBase, "chart-options-modal">>();
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState<number>(0);
  const type = (params as Record<string, "stroke" | "fill">).type ?? "stroke";
  const segments =
    type === "fill" ? ["Color 1", "Color 2"] : ["Stroke Color", "Stroke Width"];
  const { state, dispatch } = useChartOptionsContext();
  const showColorOne = selectedSegmentIndex === 0;
  const showColorTwo = selectedSegmentIndex === 1 && type === "fill";
  const showStrokeWidth = selectedSegmentIndex === 1 && type === "stroke";

  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <StatusBar style="light" />
        <View style={{ flex: 1, flexDirection: "column" }}>
          <SegmentedControl
            values={segments}
            selectedIndex={selectedSegmentIndex}
            onChange={(event) => {
              setSelectedSegmentIndex(event.nativeEvent.selectedSegmentIndex);
            }}
          />
          {(showColorOne || showColorTwo) && (
            <ColorPicker
              color={showColorOne ? state.color1 : state.color2}
              onColorChange={(color) =>
                showColorOne
                  ? dispatch({ type: "SET_COLOR1", color1: color })
                  : dispatch({ type: "SET_COLOR2", color2: color })
              }
            />
          )}
          {showStrokeWidth && (
            <View style={{ flex: 1, alignItems: "center" }}>
              <Slider
                style={{ width: 300, height: 40, margin: 20 }}
                minimumValue={1}
                value={state.strokeWidth}
                onValueChange={(value) =>
                  dispatch({ type: "SET_STROKE_WIDTH", strokeWidth: value })
                }
                maximumValue={20}
              />
              <Text
                style={{
                  fontSize: 20,
                  color: "black",
                  textAlign: "center",
                  fontWeight: "bold",
                  width: 300,
                  height: 20,
                }}
              >
                {state.strokeWidth.toFixed(0)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
