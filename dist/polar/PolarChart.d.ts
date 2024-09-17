import * as React from "react";
import { type ViewStyle, type LayoutChangeEvent, type StyleProp } from "react-native";
import type { ColorFields, InputFields, NumericalFields, StringKeyOf } from "../types";
type PolarChartBaseProps = {
    onLayout: ({ nativeEvent: { layout } }: LayoutChangeEvent) => void;
    hasMeasuredLayoutSize: boolean;
    canvasSize: {
        width: number;
        height: number;
    };
    containerStyle?: StyleProp<ViewStyle>;
    canvasStyle?: StyleProp<ViewStyle>;
};
type PolarChartProps<RawData extends Record<string, unknown>, LabelKey extends StringKeyOf<InputFields<RawData>>, ValueKey extends StringKeyOf<NumericalFields<RawData>>, ColorKey extends StringKeyOf<ColorFields<RawData>>> = {
    data: RawData[];
    colorKey: ColorKey;
    labelKey: LabelKey;
    valueKey: ValueKey;
} & Omit<PolarChartBaseProps, "canvasSize" | "onLayout" | "hasMeasuredLayoutSize">;
export declare const PolarChart: <RawData extends Record<string, unknown>, LabelKey extends StringKeyOf<InputFields<RawData>>, ValueKey extends StringKeyOf<NumericalFields<RawData>>, ColorKey extends StringKeyOf<ColorFields<RawData>>>(props: React.PropsWithChildren<PolarChartProps<RawData, LabelKey, ValueKey, ColorKey>>) => React.JSX.Element;
export {};
