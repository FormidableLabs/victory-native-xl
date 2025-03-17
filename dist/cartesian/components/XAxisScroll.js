"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XAxisDefaults = exports.XAxis = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_skia_1 = require("@shopify/react-native-skia");
const getOffsetFromAngle_1 = require("../../utils/getOffsetFromAngle");
const boundsToClip_1 = require("../../utils/boundsToClip");
const tickHelpers_1 = require("../../utils/tickHelpers");
const react_native_reanimated_1 = require("react-native-reanimated");
const XAxis = ({ xScale: xScaleProp, ignoreClip, yScale, axisSide = "bottom", yAxisSide = "left", labelPosition = "outset", labelRotate, tickCount = tickHelpers_1.DEFAULT_TICK_COUNT, tickValues, labelOffset = 2, labelColor = "#000000", lineWidth = react_native_1.StyleSheet.hairlineWidth, lineColor = "hsla(0, 0%, 0%, 0.25)", font, formatXLabel = (label) => String(label), ix = [], isNumericalData, linePathEffect, chartBounds, enableRescaling, zoom, scrollX, }) => {
    var _a;
    const transformX = (0, react_native_reanimated_1.useDerivedValue)(() => {
        return [{ translateX: -scrollX.value }];
    }, [scrollX]);
    // Create a mapping of unique values to their first occurrence index
    const uniqueValueIndices = (0, react_1.useMemo)(() => {
        return ix.reduce((acc, val, index) => {
            if (!acc.has(String(val))) {
                acc.set(String(val), index);
            }
            return acc;
        }, new Map());
    }, [ix]);
    const xScale = zoom ? zoom.rescaleX(xScaleProp) : xScaleProp;
    const [y1 = 0, y2 = 0] = yScale.domain();
    const fontSize = (_a = font === null || font === void 0 ? void 0 : font.getSize()) !== null && _a !== void 0 ? _a : 0;
    // Use tickValues if provided, otherwise generate ticks
    const xTicksNormalized = tickValues
        ? (0, tickHelpers_1.downsampleTicks)(tickValues, tickCount)
        : enableRescaling
            ? xScale.ticks(tickCount)
            : xScaleProp.ticks(tickCount);
    const xAxisNodes = xTicksNormalized.map((tick, index) => {
        var _a, _b, _c;
        // Use the first occurrence index for positioning if available
        const indexPosition = (_a = uniqueValueIndices.get(String(tick))) !== null && _a !== void 0 ? _a : tick;
        const p1 = (0, react_native_skia_1.vec)(xScale(indexPosition), yScale(y2));
        const p2 = (0, react_native_skia_1.vec)(xScale(indexPosition), yScale(y1));
        const val = isNumericalData ? tick : ix[indexPosition];
        const contentX = formatXLabel(val);
        const labelWidth = (_c = (_b = font === null || font === void 0 ? void 0 : font.getGlyphWidths) === null || _b === void 0 ? void 0 : _b.call(font, font.getGlyphIDs(contentX)).reduce((sum, value) => sum + value, 0)) !== null && _c !== void 0 ? _c : 0;
        const labelX = xScale(indexPosition) - (labelWidth !== null && labelWidth !== void 0 ? labelWidth : 0) / 2;
        const canFitLabelContent = true;
        const labelY = (() => {
            // bottom, outset
            if (axisSide === "bottom" && labelPosition === "outset") {
                return chartBounds.bottom + labelOffset + fontSize;
            }
            // bottom, inset
            if (axisSide === "bottom" && labelPosition === "inset") {
                return yScale(y2) - labelOffset;
            }
            // top, outset
            if (axisSide === "top" && labelPosition === "outset") {
                return yScale(y1) - labelOffset;
            }
            // top, inset
            return yScale(y1) + fontSize + labelOffset;
        })();
        // Calculate origin and translate for label rotation
        const { origin, rotateOffset } = (() => {
            let rotateOffset = 0;
            let origin;
            // return defaults if no labelRotate is provided
            if (!labelRotate)
                return { origin, rotateOffset };
            if (axisSide === "bottom" && labelPosition === "outset") {
                // bottom, outset
                origin = (0, react_native_skia_1.vec)(labelX + labelWidth / 2, labelY);
                rotateOffset = Math.abs((labelWidth / 2) * (0, getOffsetFromAngle_1.getOffsetFromAngle)(labelRotate));
            }
            else if (axisSide === "bottom" && labelPosition === "inset") {
                // bottom, inset
                origin = (0, react_native_skia_1.vec)(labelX + labelWidth / 2, labelY);
                rotateOffset = -Math.abs((labelWidth / 2) * (0, getOffsetFromAngle_1.getOffsetFromAngle)(labelRotate));
            }
            else if (axisSide === "top" && labelPosition === "inset") {
                // top, inset
                origin = (0, react_native_skia_1.vec)(labelX + labelWidth / 2, labelY - fontSize / 4);
                rotateOffset = Math.abs((labelWidth / 2) * (0, getOffsetFromAngle_1.getOffsetFromAngle)(labelRotate));
            }
            else {
                // top, outset
                origin = (0, react_native_skia_1.vec)(labelX + labelWidth / 2, labelY - fontSize / 4);
                rotateOffset = -Math.abs((labelWidth / 2) * (0, getOffsetFromAngle_1.getOffsetFromAngle)(labelRotate));
            }
            return { origin, rotateOffset };
        })();
        return (<react_1.default.Fragment key={`x-tick-${tick}`}>
        {lineWidth > 0 ? (<react_native_skia_1.Group transform={transformX} clip={ignoreClip ? (0, boundsToClip_1.boundsToClip)(chartBounds) : undefined}>
            <react_native_skia_1.Line p1={p1} p2={p2} color={lineColor} strokeWidth={lineWidth}>
              {linePathEffect ? linePathEffect : null}
            </react_native_skia_1.Line>
          </react_native_skia_1.Group>) : null}
        {font && labelWidth && canFitLabelContent ? (<react_native_skia_1.Group transform={transformX}>
            <react_native_skia_1.Text transform={[
                    {
                        translateX: index === 0 ? 10 : 0,
                        rotate: (Math.PI / 180) * (labelRotate !== null && labelRotate !== void 0 ? labelRotate : 0),
                    },
                ]} origin={origin} color={labelColor} text={contentX} font={font} y={labelY} x={labelX}/>
          </react_native_skia_1.Group>) : null}
        <></>
      </react_1.default.Fragment>);
    });
    return xAxisNodes;
};
exports.XAxis = XAxis;
exports.XAxisDefaults = {
    lineColor: "hsla(0, 0%, 0%, 0.25)",
    lineWidth: react_native_1.StyleSheet.hairlineWidth,
    tickCount: 5,
    labelOffset: 2,
    axisSide: "bottom",
    yAxisSide: "left",
    labelPosition: "outset",
    formatXLabel: (label) => String(label),
    labelColor: "#000000",
    labelRotate: 0,
};
