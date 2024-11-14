import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import {
  getTransformComponents,
  Pie,
  PolarChart,
  setScale,
  setTranslate,
  useChartTransformState,
} from "victory-native";
import { useFont } from "@shopify/react-native-skia";
import {
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { InfoCard } from "example/components/InfoCard";
import { Button } from "example/components/Button";
import { InputSlider } from "example/components/InputSlider";
import { InputColor } from "example/components/InputColor";
import { InputSegment } from "example/components/InputSegment";
import { appColors } from "../consts/colors";
import { descriptionForRoute } from "../consts/routes";
import inter from "../assets/inter-medium.ttf";
import { PieChartCustomLabel } from "./pie-chart-custom-label";

const randomNumber = () => Math.floor(Math.random() * (50 - 25 + 1)) + 125;
function generateRandomColor(): string {
  // Generating a random number between 0 and 0xFFFFFF
  const randomColor = Math.floor(Math.random() * 0xffffff);
  // Converting the number to a hexadecimal string and padding with zeros
  return `#${randomColor.toString(16).padStart(6, "0")}`;
}

const DATA = (numberPoints = 5) =>
  Array.from({ length: numberPoints }, (_, index) => ({
    value: randomNumber(),
    color: generateRandomColor(),
    label: `Label ${index + 1}`,
  }));

export default function PieChart(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const font = useFont(inter, 10);
  const [data, setData] = useState(DATA(5));
  const [insetWidth, setInsetWidth] = useState(4);
  const [insetColor, setInsetColor] = useState<string>("#fafafa");
  const [dataLabelSegment, setDataLabelSegment] = useState<
    "simple" | "custom" | "none"
  >("none");
  const { state } = useChartTransformState();

  const k = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  useAnimatedReaction(
    () => {
      return state.panActive.value || state.zoomActive.value;
    },
    (cv, pv) => {
      if (!cv && pv) {
        const vals = getTransformComponents(state.matrix.value);
        k.value = vals.scaleX;
        tx.value = vals.translateX;
        ty.value = vals.translateY;

        k.value = withTiming(1);
        tx.value = withTiming(0);
        ty.value = withTiming(0);
      }
    },
  );

  useAnimatedReaction(
    () => {
      return { k: k.value, tx: tx.value, ty: ty.value };
    },
    ({ k, tx, ty }) => {
      const m = setTranslate(state.matrix.value, tx, ty);
      state.matrix.value = setScale(m, k);
    },
  );

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView>
        <View
          style={{
            height: "45%",
          }}
        >
          <PolarChart
            transformState={state}
            data={data}
            colorKey={"color"}
            valueKey={"value"}
            labelKey={"label"}
          >
            <Pie.Chart>
              {({ slice }) => {
                return (
                  <>
                    <Pie.Slice>
                      {dataLabelSegment === "simple" && (
                        <Pie.Label font={font} color={"black"} />
                      )}
                      {dataLabelSegment === "custom" && (
                        <Pie.Label radiusOffset={0.6}>
                          {(position) => (
                            <PieChartCustomLabel
                              position={position}
                              slice={slice}
                              font={font}
                            />
                          )}
                        </Pie.Label>
                      )}
                    </Pie.Slice>

                    <Pie.SliceAngularInset
                      angularInset={{
                        angularStrokeWidth: insetWidth,
                        angularStrokeColor: insetColor,
                      }}
                    />
                  </>
                );
              }}
            </Pie.Chart>
          </PolarChart>
        </View>

        <View style={{ flexGrow: 1, padding: 15 }}>
          <InfoCard style={{ flex: 0, marginBottom: 16 }}>
            {description}
          </InfoCard>

          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginTop: 10,
              marginBottom: 16,
            }}
          >
            <Button
              style={{ flex: 1 }}
              onPress={() => setData((data) => DATA(data.length))}
              title="Shuffle Data"
            />
          </View>
          <InputSlider
            label="Inset width"
            maxValue={6}
            minValue={0}
            step={1}
            value={insetWidth}
            onChange={setInsetWidth}
          />
          <InputColor
            label="Inset color"
            color={insetColor}
            onChange={setInsetColor}
          />
          <InputSegment<"none" | "simple" | "custom">
            label="Data Labels"
            value="none"
            values={["none", "simple", "custom"]}
            onChange={setDataLabelSegment}
          />
        </View>
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
});
