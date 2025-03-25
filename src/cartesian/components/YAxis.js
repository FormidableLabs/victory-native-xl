import React from "react";
import { StyleSheet } from "react-native";
import { Group, Line, Text, vec } from "@shopify/react-native-skia";
import { boundsToClip } from "../../utils/boundsToClip";
export const YAxis = ({ xScale, yScale, yTicksNormalized, axisSide, labelPosition, labelOffset, labelColor, lineWidth, lineColor, font, formatYLabel = (label) => String(label), linePathEffect, chartBounds, }) => {
    const [x1 = 0, x2 = 0] = xScale.domain();
    const [_ = 0, y2 = 0] = yScale.domain();
    const fontSize = font?.getSize() ?? 0;
    const yAxisNodes = yTicksNormalized.map((tick) => {
        const contentY = formatYLabel(tick);
        const labelWidth = font?.getGlyphWidths?.(font.getGlyphIDs(contentY)).reduce((sum, value) => sum + value, 0) ?? 0;
        const labelY = yScale(tick) + fontSize / 3;
        const labelX = (() => {
            // left, outset
            if (axisSide === "left" && labelPosition === "outset") {
                return chartBounds.left - (labelWidth + labelOffset);
            }
            // left, inset
            if (axisSide === "left" && labelPosition === "inset") {
                return chartBounds.left + labelOffset;
            }
            // right, outset
            if (axisSide === "right" && labelPosition === "outset") {
                return chartBounds.right + labelOffset;
            }
            // right, inset
            return chartBounds.right - (labelWidth + labelOffset);
        })();
        const canFitLabelContent = labelY > fontSize && labelY < yScale(y2);
        return (React.createElement(React.Fragment, { key: `y-tick-${tick}` },
            lineWidth > 0 ? (React.createElement(Group, { clip: boundsToClip(chartBounds) },
                React.createElement(Line, { p1: vec(xScale(x1), yScale(tick)), p2: vec(xScale(x2), yScale(tick)), color: lineColor, strokeWidth: lineWidth }, linePathEffect ? linePathEffect : null))) : null,
            font ? canFitLabelContent && React.createElement(Text, { color: labelColor, text: contentY, font: font, y: labelY, x: labelX }) : null));
    });
    return yAxisNodes;
};
export const YAxisDefaults = {
    lineColor: "hsla(0, 0%, 0%, 0.25)",
    lineWidth: StyleSheet.hairlineWidth,
    tickCount: 5,
    labelOffset: 4,
    axisSide: "left",
    labelPosition: "outset",
    formatYLabel: (label) => String(label),
    labelColor: "#000000",
    yKeys: [],
    domain: null,
};
