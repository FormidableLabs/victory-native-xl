"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YAxisDefaults = exports.YAxis = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_skia_1 = require("@shopify/react-native-skia");
const boundsToClip_1 = require("../../utils/boundsToClip");
const YAxis = ({ xScale, yScale, yTicksNormalized, axisSide, labelPosition, labelOffset, labelColor, lineWidth, lineColor, font, formatYLabel = (label) => String(label), linePathEffect, chartBounds, }) => {
    var _a;
    const [x1 = 0, x2 = 0] = xScale.domain();
    const [_ = 0, y2 = 0] = yScale.domain();
    const fontSize = (_a = font === null || font === void 0 ? void 0 : font.getSize()) !== null && _a !== void 0 ? _a : 0;
    const yAxisNodes = yTicksNormalized.map((tick) => {
        var _a, _b;
        const contentY = formatYLabel(tick);
        const labelWidth = (_b = (_a = font === null || font === void 0 ? void 0 : font.getGlyphWidths) === null || _a === void 0 ? void 0 : _a.call(font, font.getGlyphIDs(contentY)).reduce((sum, value) => sum + value, 0)) !== null && _b !== void 0 ? _b : 0;
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
        return (<react_1.default.Fragment key={`y-tick-${tick}`}>
        {lineWidth > 0 ? (<react_native_skia_1.Group clip={(0, boundsToClip_1.boundsToClip)(chartBounds)}>
            <react_native_skia_1.Line p1={(0, react_native_skia_1.vec)(xScale(x1), yScale(tick))} p2={(0, react_native_skia_1.vec)(xScale(x2), yScale(tick))} color={lineColor} strokeWidth={lineWidth}>
              {linePathEffect ? linePathEffect : null}
            </react_native_skia_1.Line>
          </react_native_skia_1.Group>) : null}
        {font ? canFitLabelContent && <react_native_skia_1.Text color={labelColor} text={contentY} font={font} y={labelY} x={labelX}/> : null}
      </react_1.default.Fragment>);
    });
    return yAxisNodes;
};
exports.YAxis = YAxis;
exports.YAxisDefaults = {
    lineColor: "hsla(0, 0%, 0%, 0.25)",
    lineWidth: react_native_1.StyleSheet.hairlineWidth,
    tickCount: 5,
    labelOffset: 4,
    axisSide: "left",
    labelPosition: "outset",
    formatYLabel: (label) => String(label),
    labelColor: "#000000",
    yKeys: [],
    domain: null,
};
