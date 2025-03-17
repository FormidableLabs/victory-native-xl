"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarGraphLabels = void 0;
const react_1 = __importDefault(require("react"));
const react_native_skia_1 = require("@shopify/react-native-skia");
const getFontGlyphWidth_1 = require("../../utils/getFontGlyphWidth");
// Arbitrary offset so that the label is not touching the bar
const LABEL_OFFSET_FROM_POSITION = 5;
const BarGraphLabels = ({ points, chartBounds, barWidth = 0, options, }) => {
    const { position, font, color } = options;
    // Loop over the data points and position each label
    return points.map(({ x, y = 0, yValue }) => {
        var _a;
        const yText = (_a = yValue === null || yValue === void 0 ? void 0 : yValue.toString()) !== null && _a !== void 0 ? _a : "";
        const labelWidth = (0, getFontGlyphWidth_1.getFontGlyphWidth)(yText, font);
        let xOffset;
        let yOffset;
        // Bar Edges
        const barInnerLeftEdge = x - barWidth / 2;
        const barOuterRightEdge = x + barWidth / 2;
        // Chart Edges
        const { top: chartInnerTopEdge, bottom: chartInnerBottomEdge } = chartBounds;
        // Bar Midpoints
        const barVerticalMidpoint = (chartInnerTopEdge + chartInnerBottomEdge + Number(y)) / 2;
        const barHorizontalMidpoint = x - labelWidth / 2;
        switch (position) {
            case "top": {
                // Position the label above the bar
                // Move the label left by half its width to properly center the text over the bar
                xOffset = barHorizontalMidpoint;
                yOffset = Number(y) - LABEL_OFFSET_FROM_POSITION;
                break;
            }
            case "bottom": {
                // Position the label at the bottom of the bar
                xOffset = barHorizontalMidpoint;
                // Use the chartBounds here so that the label isn't rendered under the graph
                yOffset = chartInnerBottomEdge - LABEL_OFFSET_FROM_POSITION;
                break;
            }
            case "left": {
                // Position the label to the left of the bar
                // Move the label to the inner left edge then by the labels full width so
                // that the label is not render inside the bar
                xOffset = barInnerLeftEdge - labelWidth - LABEL_OFFSET_FROM_POSITION;
                yOffset = barVerticalMidpoint;
                break;
            }
            case "right": {
                // Position the label to the right of the bar
                // Move the label to the outer right edge of the bar
                xOffset = barOuterRightEdge + LABEL_OFFSET_FROM_POSITION;
                yOffset = barVerticalMidpoint;
                break;
            }
            default: {
                xOffset = x;
                yOffset = Number(y);
            }
        }
        return (<react_native_skia_1.Text key={`${xOffset}-${yOffset}-${yText}`} x={xOffset} y={yOffset} text={yText} font={font} color={color}/>);
    });
};
exports.BarGraphLabels = BarGraphLabels;
