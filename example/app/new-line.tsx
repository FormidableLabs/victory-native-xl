import React from "react";
import { LineChart } from "victory-native-skia";
import { Circle, Path } from "@shopify/react-native-skia";
import { View } from "react-native";

export default function NewLinePage() {
  return (
    <View style={{ height: 400 }}>
      <LineChart
        data={DATA}
        xKey="month"
        yKeys={["revenue", "profit"]}
        padding={20}
        curve="natural"
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
  );
}

const DATA = Array.from({ length: 10 }).map((_, i) => ({
  month: i,
  revenue: 1500 + Math.random() * 1000,
  profit: 500 + 500 * Math.random(),
}));
