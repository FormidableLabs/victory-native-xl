import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Pie } from "victory-native";
import { InfoCard } from "example/components/InfoCard";
import { Button } from "example/components/Button";
import { InputSlider } from "example/components/InputSlider";
import { InputColor } from "example/components/InputColor";
import { appColors } from "./consts/colors";
import { descriptionForRoute } from "./consts/routes";

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
  const [data, setData] = useState(DATA(5));
  const [insetWidth, setInsetWidth] = useState(4);
  const [insetColor, setInsetColor] = useState<string>("#fafafa");

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView>
        <View
          style={{
            height: "45%",
          }}
        >
          <Pie.Chart
            data={data}
            labelKey={"label"}
            valueKey={"value"}
            colorKey={"color"}
            renderLegend={(data) => (
              <Pie.ChartLegend
                containerStyle={{ alignSelf: "center" }}
                position="bottom"
                data={data}
              >
                {({ slice }) => <Pie.ChartLegendItem slice={slice} />}
              </Pie.ChartLegend>
            )}
          >
            {({ slice }) => {
              return (
                <Pie.SliceProvider slice={slice}>
                  <Pie.Slice />
                  <Pie.SliceInset
                    inset={{ width: insetWidth, color: insetColor }}
                  />
                </Pie.SliceProvider>
              );
            }}
          </Pie.Chart>
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
