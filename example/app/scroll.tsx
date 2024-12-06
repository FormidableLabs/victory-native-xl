export const PanZoom = () => {};
import * as React from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import {
  CartesianChart,
  Line,
  useChartTransformState,
  type ChartBounds,
  type Viewport,
} from "victory-native";
import {
  mapPoint3d,
  Matrix4,
  Rect,
  scale,
  useFont,
} from "@shopify/react-native-skia";
import {
  interpolate,
  useDerivedValue,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import { appColors } from "../consts/colors";
import inter from "../assets/inter-medium.ttf";

const det3x3 = (
  a00: number,
  a01: number,
  a02: number,
  a10: number,
  a11: number,
  a12: number,
  a20: number,
  a21: number,
  a22: number,
): number => {
  "worklet";
  return (
    a00 * (a11 * a22 - a12 * a21) +
    a01 * (a12 * a20 - a10 * a22) +
    a02 * (a10 * a21 - a11 * a20)
  );
};

/**
 * Inverts a 4x4 matrix
 * @worklet
 * @returns The inverted matrix, or the identity matrix if the input is not invertible
 */
export const invert4 = (m: Matrix4): Matrix4 => {
  "worklet";

  const a00 = m[0],
    a01 = m[1],
    a02 = m[2],
    a03 = m[3];
  const a10 = m[4],
    a11 = m[5],
    a12 = m[6],
    a13 = m[7];
  const a20 = m[8],
    a21 = m[9],
    a22 = m[10],
    a23 = m[11];
  const a30 = m[12],
    a31 = m[13],
    a32 = m[14],
    a33 = m[15];

  // Calculate cofactors
  const b00 = det3x3(a11, a12, a13, a21, a22, a23, a31, a32, a33);
  const b01 = -det3x3(a10, a12, a13, a20, a22, a23, a30, a32, a33);
  const b02 = det3x3(a10, a11, a13, a20, a21, a23, a30, a31, a33);
  const b03 = -det3x3(a10, a11, a12, a20, a21, a22, a30, a31, a32);

  const b10 = -det3x3(a01, a02, a03, a21, a22, a23, a31, a32, a33);
  const b11 = det3x3(a00, a02, a03, a20, a22, a23, a30, a32, a33);
  const b12 = -det3x3(a00, a01, a03, a20, a21, a23, a30, a31, a33);
  const b13 = det3x3(a00, a01, a02, a20, a21, a22, a30, a31, a32);

  const b20 = det3x3(a01, a02, a03, a11, a12, a13, a31, a32, a33);
  const b21 = -det3x3(a00, a02, a03, a10, a12, a13, a30, a32, a33);
  const b22 = det3x3(a00, a01, a03, a10, a11, a13, a30, a31, a33);
  const b23 = -det3x3(a00, a01, a02, a10, a11, a12, a30, a31, a32);

  const b30 = -det3x3(a01, a02, a03, a11, a12, a13, a21, a22, a23);
  const b31 = det3x3(a00, a02, a03, a10, a12, a13, a20, a22, a23);
  const b32 = -det3x3(a00, a01, a03, a10, a11, a13, a20, a21, a23);
  const b33 = det3x3(a00, a01, a02, a10, a11, a12, a20, a21, a22);

  // Calculate determinant
  const det = a00 * b00 + a01 * b01 + a02 * b02 + a03 * b03;

  // Check if matrix is invertible
  if (Math.abs(det) < 1e-8) {
    // Return identity matrix if not invertible
    return Matrix4();
  }

  const invDet = 1.0 / det;

  // Calculate inverse matrix
  return [
    b00 * invDet,
    b10 * invDet,
    b20 * invDet,
    b30 * invDet,
    b01 * invDet,
    b11 * invDet,
    b21 * invDet,
    b31 * invDet,
    b02 * invDet,
    b12 * invDet,
    b22 * invDet,
    b32 * invDet,
    b03 * invDet,
    b13 * invDet,
    b23 * invDet,
    b33 * invDet,
  ] as Matrix4;
};

export default function HorizontalScrollPage() {
  const font = useFont(inter, 12);
  const { state } = useChartTransformState({});
  const viewport: Viewport = {
    x: [5, 15],
    y: [60, 50],
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={{ flex: 1, maxHeight: 400, padding: 32 }}>
        <CartesianChart
          data={DATA}
          viewport={viewport}
          xKey="day"
          yKeys={["highTmp"]}
          yAxis={[
            {
              font: font,
            },
          ]}
          xAxis={{
            font: font,
          }}
          transformState={state}
          transformConfig={{
            pan: {
              dimensions: ["x", "y"],
            },
            pinch: {
              enabled: false,
            },
          }}
        >
          {({ points }) => {
            return (
              <>
                <Line points={points.highTmp} color="red" strokeWidth={3} />
              </>
            );
          }}
        </CartesianChart>
      </View>
      <Hightlighted viewport={viewport} matrix={state.matrix} />
    </SafeAreaView>
  );
}

type HightlightedProps = {
  viewport: Viewport;
  matrix: SharedValue<Matrix4>;
};
const Hightlighted = ({ viewport, matrix }: HightlightedProps) => {
  const font = useFont(inter, 12);
  const [chartBounds, setChartBounds] = React.useState<ChartBounds>({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });
  const domainX = useSharedValue<[number, number]>([0, 0]);
  const domainY = useSharedValue<[number, number]>([0, 0]);
  const box = useDerivedValue(() => {
    const vp: Required<Viewport> = { ...{ x: [0, 0], y: [0, 0] }, ...viewport };
    const kx = (domainX.value[1] - domainX.value[0]) / (vp.x[1] - vp.x[0]) || 1;
    const ky = (domainY.value[1] - domainY.value[0]) / (vp.y[1] - vp.y[0]) || 1;

    const boundsX = [0, (chartBounds.right - chartBounds.left) * kx];
    const boundsY = [0, (chartBounds.bottom - chartBounds.top) * ky];
    const x1z = interpolate(vp.x[0], domainX.value, boundsX);
    const x2z = interpolate(vp.x[1], domainX.value, boundsX);
    const y1z = interpolate(vp.y[0], domainY.value, boundsY);
    const y2z = interpolate(vp.y[1], domainY.value, boundsY);

    const tl = mapPoint3d(invert4(matrix.value), [x1z, y1z, 1]);
    const br = mapPoint3d(invert4(matrix.value), [x2z, y2z, 1]);

    const m = scale(kx, ky, 1);
    const x1 = mapPoint3d(invert4(m), tl)[0];
    const x2 = mapPoint3d(invert4(m), br)[0];
    const y1 = mapPoint3d(invert4(m), tl)[1];
    const y2 = mapPoint3d(invert4(m), br)[1];

    return { x: [x1, x2], y: [y1, y2] };
  });
  const x = useDerivedValue(() => {
    return box.value.x[0]! + chartBounds.left;
  });
  const w = useDerivedValue(() => {
    return box.value.x[1]! - box.value.x[0]!;
  });
  const y = useDerivedValue(() => {
    return box.value.y[0]! + chartBounds.top;
  });
  const h = useDerivedValue(() => {
    return box.value.y[1]! - box.value.y[0]!;
  });

  return (
    <View style={{ flex: 1, maxHeight: 400, padding: 32 }}>
      <CartesianChart
        data={DATA}
        xKey="day"
        yKeys={["highTmp"]}
        yAxis={[
          {
            font: font,
          },
        ]}
        xAxis={{
          font: font,
        }}
        onChartBoundsChange={(_chartBounds) => {
          setChartBounds(() => _chartBounds);
        }}
        onScaleChange={(_xScale, _yScale) => {
          domainX.value = _xScale.domain() as [number, number];
          domainY.value = _yScale.domain() as [number, number];
        }}
      >
        {({ points }) => {
          return (
            <>
              <Line points={points.highTmp} color="red" strokeWidth={3} />
              <Rect
                x={x}
                y={y}
                width={w}
                height={h}
                color="green"
                opacity={0.3}
              />
            </>
          );
        }}
      </CartesianChart>
    </View>
  );
};

const DATA = [
  { day: 0, highTmp: 59.30624201725173 },
  { day: 1, highTmp: 44.25635578608018 },
  { day: 2, highTmp: 68.19738539273173 },
  { day: 3, highTmp: 47.62255457719107 },
  { day: 4, highTmp: 69.36936311145384 },
  { day: 5, highTmp: 50.341333269749946 },
  { day: 6, highTmp: 54.73478765663331 },
  { day: 7, highTmp: 59.65742044241456 },
  { day: 8, highTmp: 48.221495620289595 },
  { day: 9, highTmp: 58.65209092238778 },
  { day: 10, highTmp: 41.03429979716762 },
  { day: 11, highTmp: 41.10630442396717 },
  { day: 12, highTmp: 45.47205847354351 },
  { day: 13, highTmp: 57.634709409230446 },
  { day: 14, highTmp: 65.87827901279721 },
  { day: 15, highTmp: 47.99811346139486 },
  { day: 16, highTmp: 43.29378262397241 },
  { day: 17, highTmp: 65.0593421561084 },
  { day: 18, highTmp: 56.312569508928775 },
  { day: 19, highTmp: 67.7442403533759 },
  { day: 20, highTmp: 62.84831567105093 },
  { day: 21, highTmp: 53.629213794422405 },
  { day: 22, highTmp: 45.06696838558802 },
  { day: 23, highTmp: 47.95068037187096 },
  { day: 24, highTmp: 45.93743256152696 },
  { day: 25, highTmp: 54.075911101211815 },
  { day: 26, highTmp: 43.777537229307036 },
  { day: 27, highTmp: 49.19553019689158 },
  { day: 28, highTmp: 46.771688955924674 },
  { day: 29, highTmp: 47.74835132388989 },
  { day: 30, highTmp: 40.1617262863485 },
];

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: appColors.viewBackground.light,
    $dark: {
      backgroundColor: appColors.viewBackground.dark,
    },
  },
});
