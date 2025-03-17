import { type Color, type SkFont } from "@shopify/react-native-skia";
import React, { type ReactNode } from "react";
type LabelPostion = {
    x: number;
    y: number;
    midAngle: number;
};
export type PieLabelProps = {
    font?: SkFont | null;
    radiusOffset?: number;
    color?: Color;
    text?: string;
    children?: (position: LabelPostion) => ReactNode;
};
declare const PieLabel: ({ font, radiusOffset, color, text, children, }: PieLabelProps) => string | number | boolean | React.JSX.Element | Iterable<React.ReactNode> | null | undefined;
export default PieLabel;
