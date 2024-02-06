import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { PieChart, PieSlice, PieSliceInset } from "victory-native";
import { InfoCard } from "example/components/InfoCard";
import { Button } from "example/components/Button";
import { InputSlider } from "example/components/InputSlider";
import { InputColor } from "example/components/InputColor";
import { appColors } from "./consts/colors";
import { descriptionForRoute } from "./consts/routes";

const randomNumber = () => Math.floor(Math.random() * (50 - 25 + 1)) + 25;
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
    label: index % 2 ? "Even Label" : "Odd Label",
  }));

export default function PieChartPlayground(props: { segment: string }) {
  const description = descriptionForRoute(props.segment);
  const [data, setData] = useState(DATA(5));
  const [insetWidth, setInsetWidth] = useState(4);
  const [insetColor, setInsetColor] = useState<string>("#fafafa");

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView>
        <View style={styles.chart}>
          <PieChart
            data={data}
            labelKey={"label"}
            valueKey={"value"}
            colorKey={"color"}
          >
            {({ slice, size }) => {
              return (
                <>
                  <PieSlice slice={slice} size={size} />
                  <PieSliceInset
                    size={size}
                    slice={slice}
                    inset={{ width: insetWidth, color: insetColor }}
                  />
                </>
              );
            }}
          </PieChart>
        </View>

        <ScrollView
          style={styles.optionsScrollView}
          contentContainerStyle={styles.options}
        >
          <InfoCard style={{ marginBottom: 16 }}>{description}</InfoCard>
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
            maxValue={8}
            minValue={3}
            step={1}
            value={insetWidth}
            onChange={setInsetWidth}
          />
          <InputColor
            label="Inset color"
            color={insetColor}
            onChange={setInsetColor}
          />
        </ScrollView>
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
  chart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  optionsScrollView: {
    flex: 1,
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
