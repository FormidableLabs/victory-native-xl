import * as React from "react";
import { CartesianChart } from "victory-native";
import { Path, useFont } from "@shopify/react-native-skia";
import { SafeAreaView, View } from "react-native";
import inter from "../assets/inter-medium.ttf";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import { AnimatedText } from "../components/AnimatedText";

/**
 * Example of using oridinal data.
 * Just create a numerical field with datum index, use that for lookups.
 */
export default function OrdinalDataScreen() {
  const font = useFont(inter, 12);
  const activeX = useSharedValue(0);

  const day = useDerivedValue(() => {
    const v = DATA?.[activeX.value]?.day || "";
    return v;
  });

  return (
    <SafeAreaView>
      <View>
        <AnimatedText text={day} style={{ fontSize: 24 }} />
      </View>
      <View style={{ height: 400 }}>
        <CartesianChart
          data={DATA}
          xKey="x"
          yKeys={["high"]}
          gridOptions={{ font, formatXLabel: (i) => DATA?.[i]?.day || "" }}
          isPressEnabled
          activePressX={{ value: activeX }}
          domainPadding={{ left: 50, right: 50, top: 100, bottom: 100 }}
        >
          {({ paths }) => (
            <>
              <Path
                path={paths["high.line"]}
                style="stroke"
                color="red"
                strokeWidth={3}
              />
            </>
          )}
        </CartesianChart>
      </View>
    </SafeAreaView>
  );
}

const DATA = [
  { day: "Mon", high: 50 + 20 * Math.random() },
  { day: "Tue", high: 50 + 20 * Math.random() },
  { day: "Wed", high: 50 + 20 * Math.random() },
  { day: "Thu", high: 50 + 20 * Math.random() },
  { day: "Fri", high: 50 + 20 * Math.random() },
  { day: "Sat", high: 50 + 20 * Math.random() },
  { day: "Sun", high: 50 + 20 * Math.random() },
].map((dat, i) => ({ ...dat, x: i }));
