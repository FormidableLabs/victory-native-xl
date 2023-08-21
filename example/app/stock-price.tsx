import React from "react";
import data from "../data/stockprice/tesla_stock.json";
import { type ChartBounds, LineChart } from "victory-native-skia";
import {
  Circle,
  Group,
  Line,
  LinearGradient,
  Path,
  Skia,
  Text as SkiaText,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import { View } from "react-native";
import inter from "../assets/inter-medium.ttf";
import { format } from "date-fns";
import {
  type SharedValue,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AnimatedText } from "../components/AnimatedText";
import * as Haptics from "expo-haptics";

const DATA = data.map((d) => ({ ...d, date: new Date(d.date).valueOf() }));

export default function StockPriceScreen() {
  const font = useFont(inter, 12);
  const [isPressActive, setIsPressActive] = React.useState(false);
  const activeDateMS = useSharedValue(0);
  const activeHigh = useSharedValue(0);

  const activeDate = useDerivedValue(() => {
    if (!isPressActive) return "";

    const date = new Date(activeDateMS.value);
    const M = MONTHS[date.getMonth()];
    const D = date.getDate();
    const Y = date.getFullYear();
    return `${M} ${D}, ${Y}`;
  });
  const activeHighDisplay = useDerivedValue(() =>
    isPressActive ? activeHigh.value.toFixed(2) : "",
  );

  return (
    <View>
      <View style={{ padding: 12, alignItems: "center" }}>
        <AnimatedText
          text={activeDate}
          style={{ fontSize: 16, color: "gray" }}
        />
        <AnimatedText text={activeHighDisplay} style={{ fontSize: 24 }} />
      </View>
      <View style={{ height: 300 }}>
        <LineChart
          data={DATA}
          xKey="date"
          yKeys={["high"]}
          // padding={{ left: 10, right: 10 }}
          curve="linear"
          activePressX={{ value: activeDateMS }}
          activePressY={{ high: { value: activeHigh } }}
          onPressActiveChange={setIsPressActive}
          onPressActiveStart={() => Haptics.selectionAsync()}
          gridOptions={{
            font,
            xTicks: 5,
            yTicks: 5,
            xLabelOffset: 12,
            xAxisPosition: "bottom",
            xLabelPosition: "outset",
            yLabelOffset: 8,
            yAxisPosition: "left",
            yLabelPosition: "inset",
            formatXLabel: (ms) => format(new Date(ms), "MM-dd"),
          }}
          renderOutside={({
            isPressActive,
            activePressX,
            activePressY,
            chartBounds,
          }) =>
            isPressActive && (
              <>
                <ActiveValueIndicator
                  xPosition={activePressX.position}
                  yPosition={activePressY.high.position}
                  bottom={chartBounds.bottom}
                  top={chartBounds.top}
                  activeValue={activePressY.high.value}
                />
              </>
            )
          }
        >
          {({
            paths,
            isPressActive,
            activePressX,
            activePressY,
            chartBounds,
          }) => (
            <>
              <StockArea
                // TODO: Remove optional chain, accessing this shouldn't crash stuff
                xPosition={activePressX?.position}
                path={paths["high.area"]}
                isPressActive={isPressActive}
                {...chartBounds}
              />
              <Path
                path={paths["high.line"]}
                style="stroke"
                color="blue"
                strokeWidth={2}
              />
            </>
          )}
        </LineChart>
      </View>
    </View>
  );
}

const StockArea = ({
  path,
  xPosition,
  isPressActive,
  left,
  right,
  bottom,
  top,
}: {
  path: string;
  xPosition: SharedValue<number>;
  isPressActive: boolean;
} & ChartBounds) => {
  const clipRectRight = useSharedValue(right);
  React.useEffect(() => {
    clipRectRight.value = right;
  }, [right]);

  React.useEffect(() => {
    if (!isPressActive) {
      clipRectRight.value = xPosition.value;
      clipRectRight.value = withTiming(right, { duration: 200 });
    }
  }, [isPressActive]);

  const leftRect = useDerivedValue(() => {
    const path = Skia.Path.Make();
    path.addRect(
      Skia.XYWHRect(
        left,
        top,
        (isPressActive ? xPosition.value : clipRectRight.value) - left,
        bottom - top,
      ),
    );

    return path;
  });

  return (
    <Group clip={leftRect}>
      <Path path={path} style="fill">
        <LinearGradient
          start={vec(0, 0)}
          end={vec(top, bottom)}
          colors={["blue", "#0000ff33"]}
        />
      </Path>
    </Group>
  );
};

const ActiveValueIndicator = ({
  xPosition,
  yPosition,
  top,
  bottom,
  activeValue,
}: {
  xPosition: SharedValue<number>;
  yPosition: SharedValue<number>;
  activeValue: SharedValue<number>;
  bottom: number;
  top: number;
}) => {
  const FONT_SIZE = 16;
  const font = useFont(inter, FONT_SIZE);
  const start = useDerivedValue(() => vec(xPosition.value, bottom));
  const end = useDerivedValue(() =>
    vec(xPosition.value, top + 1.5 * FONT_SIZE),
  );
  // Text label
  const activeValueDisplay = useDerivedValue(() =>
    activeValue.value.toFixed(2),
  );
  const activeValueWidth = useDerivedValue(
    () => font?.getTextWidth(activeValueDisplay.value) || 0,
  );
  const activeValueX = useDerivedValue(
    () => xPosition.value - activeValueWidth.value / 2,
  );

  return (
    <>
      <Line p1={start} p2={end} />
      <Circle cx={xPosition} cy={yPosition} r={10} color="black" />
      <Circle cx={xPosition} cy={yPosition} r={8} color="blue" />
      <SkiaText
        font={font}
        text={activeValueDisplay}
        x={activeValueX}
        y={top + FONT_SIZE}
      />
    </>
  );
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
