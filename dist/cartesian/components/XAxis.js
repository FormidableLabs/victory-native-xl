"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XAxisDefaults = exports.XAxis = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_skia_1 = require("@shopify/react-native-skia");
const getOffsetFromAngle_1 = require("../../utils/getOffsetFromAngle");
const boundsToClip_1 = require("../../utils/boundsToClip");
const tickHelpers_1 = require("../../utils/tickHelpers");
const XAxis = ({ xScale: xScaleProp, yScale, axisSide = "bottom", yAxisSide = "left", labelPosition = "outset", labelRotate, tickCount = tickHelpers_1.DEFAULT_TICK_COUNT, tickValues, labelOffset = 2, labelColor = "#000000", lineWidth = react_native_1.StyleSheet.hairlineWidth, lineColor = "hsla(0, 0%, 0%, 0.25)", font, formatXLabel = (label) => String(label), ix = [], isNumericalData, linePathEffect, chartBounds, enableRescaling, zoom, }) => {
    var _a;
    const xScale = zoom ? zoom.rescaleX(xScaleProp) : xScaleProp;
    const [y1 = 0, y2 = 0] = yScale.domain();
    const fontSize = (_a = font === null || font === void 0 ? void 0 : font.getSize()) !== null && _a !== void 0 ? _a : 0;
    const xTicksNormalized = tickValues
        ? (0, tickHelpers_1.downsampleTicks)(tickValues, tickCount)
        : enableRescaling
            ? xScale.ticks(tickCount)
            : xScaleProp.ticks(tickCount);
    const xAxisNodes = xTicksNormalized.map((tick) => {
        var _a, _b;
        const p1 = (0, react_native_skia_1.vec)(xScale(tick), yScale(y2));
        const p2 = (0, react_native_skia_1.vec)(xScale(tick), yScale(y1));
        const val = isNumericalData ? tick : ix[tick];
        const contentX = formatXLabel(val);
        const labelWidth = (_b = (_a = font === null || font === void 0 ? void 0 : font.getGlyphWidths) === null || _a === void 0 ? void 0 : _a.call(font, font.getGlyphIDs(contentX)).reduce((sum, value) => sum + value, 0)) !== null && _b !== void 0 ? _b : 0;
        const labelX = xScale(tick) - (labelWidth !== null && labelWidth !== void 0 ? labelWidth : 0) / 2;
        const canFitLabelContent = xScale(tick) >= chartBounds.left &&
            xScale(tick) <= chartBounds.right &&
            (yAxisSide === "left"
                ? labelX + labelWidth < chartBounds.right
                : chartBounds.left < labelX);
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
        {lineWidth > 0 ? (<react_native_skia_1.Group clip={(0, boundsToClip_1.boundsToClip)(chartBounds)}>
            <react_native_skia_1.Line p1={p1} p2={p2} color={lineColor} strokeWidth={lineWidth}>
              {linePathEffect ? linePathEffect : null}
            </react_native_skia_1.Line>
          </react_native_skia_1.Group>) : null}
        {font && labelWidth && canFitLabelContent ? (<react_native_skia_1.Group transform={[{ translateY: rotateOffset }]}>
            <react_native_skia_1.Text transform={[
                    {
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
