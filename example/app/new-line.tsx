import React from "react";
import { LineChart } from "victory-native-skia";
import { Circle, Path } from "@shopify/react-native-skia";
import { TextInput, View } from "react-native";
import Reanimated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const AnimatedText = Reanimated.createAnimatedComponent(TextInput);

export default function NewLinePage() {
  const activeX = useSharedValue(0);
  const activeProfit = useSharedValue(0);
  const [isActive, setIsActive] = React.useState(false);

  const textProps = useAnimatedProps(() => {
    return {
      text: isActive
        ? `${activeX.value.toFixed(2)}, ${activeProfit.value.toFixed(2)}`
        : "",
    };
  });

  return (
    <View>
      <AnimatedText
        editable={false}
        animatedProps={textProps}
        style={{ fontSize: 24, padding: 12 }}
      />
      <View style={{ height: 400 }}>
        <LineChart
          data={DATA}
          xKey="month"
          yKeys={["revenue", "profit"]}
          padding={20}
          curve="natural"
          onPressActiveChange={setIsActive}
          activePressX={{ value: activeX }}
          activePressY={{ profit: { value: activeProfit } }}
        >
          {({ paths, isPressActive, activePressX, activePressY }) => (
            <>
              <Path
                path={paths.profit}
                style="stroke"
                color="black"
                strokeWidth={4}
              />
              <Path
                path={paths.revenue}
                style="stroke"
                color="blue"
                strokeWidth={4}
              />
              {isPressActive && (
                <>
                  <Circle
                    cx={activePressX.position}
                    cy={activePressY.profit.position}
                    r={5}
                    color="red"
                  />
                  <Circle
                    cx={activePressX.position}
                    cy={activePressY.revenue.position}
                    r={5}
                    color="red"
                  />
                </>
              )}
            </>
          )}
        </LineChart>
      </View>
    </View>
  );
}

const DATA = Array.from({ length: 20 }).map((_, i) => ({
  month: i,
  revenue: 1500 + Math.random() * 1000,
  profit: 500 + 500 * Math.random(),
}));
