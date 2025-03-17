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
exports.CartesianAxisDefaultProps = exports.CartesianAxis = void 0;
const react_1 = __importStar(require("react"));
const react_native_skia_1 = require("@shopify/react-native-skia");
const react_native_1 = require("react-native");
const getFontGlyphWidth_1 = require("../../utils/getFontGlyphWidth");
const tickHelpers_1 = require("../../utils/tickHelpers");
/**
 * @deprecated This component will eventually be replaced by the new, separate x/y/frame components.
 */
const CartesianAxis = ({ tickCount = tickHelpers_1.DEFAULT_TICK_COUNT, xTicksNormalized, yTicksNormalized, labelPosition = "outset", labelOffset = { x: 2, y: 4 }, axisSide = { x: "bottom", y: "left" }, lineColor = "hsla(0, 0%, 0%, 0.25)", lineWidth = react_native_1.StyleSheet.hairlineWidth, labelColor = "#000000", formatYLabel = (label) => String(label), formatXLabel = (label) => String(label), yScale, xScale, font, isNumericalData = false, ix = [], }) => {
    var _a;
    const axisConfiguration = (0, react_1.useMemo)(() => {
        return {
            xTicks: typeof tickCount === "number" ? tickCount : tickCount.x,
            yTicks: typeof tickCount === "number" ? tickCount : tickCount.y,
            xLabelOffset: typeof labelOffset === "number" ? labelOffset : labelOffset.x,
            yLabelOffset: typeof labelOffset === "number" ? labelOffset : labelOffset.y,
            xAxisPosition: axisSide.x,
            yAxisPosition: axisSide.y,
            xLabelPosition: typeof labelPosition === "string" ? labelPosition : labelPosition.x,
            yLabelPosition: typeof labelPosition === "string" ? labelPosition : labelPosition.y,
            gridXLineColor: (typeof lineColor === "object" && "grid" in lineColor
                ? typeof lineColor.grid === "object" && "x" in lineColor.grid
                    ? lineColor.grid.x
                    : lineColor.grid
                : lineColor),
            gridYLineColor: (typeof lineColor === "object" && "grid" in lineColor
                ? typeof lineColor.grid === "object" && "y" in lineColor.grid
                    ? lineColor.grid.y
                    : lineColor.grid
                : lineColor),
            gridFrameLineColor: (typeof lineColor === "object" && "frame" in lineColor
                ? lineColor.frame
                : lineColor),
            gridXLineWidth: typeof lineWidth === "object" && "grid" in lineWidth
                ? typeof lineWidth.grid === "object" && "x" in lineWidth.grid
                    ? lineWidth.grid.x
                    : lineWidth.grid
                : lineWidth,
            gridYLineWidth: typeof lineWidth === "object" && "grid" in lineWidth
                ? typeof lineWidth.grid === "object" && "y" in lineWidth.grid
                    ? lineWidth.grid.y
                    : lineWidth.grid
                : lineWidth,
            gridFrameLineWidth: typeof lineWidth === "object" && "frame" in lineWidth
                ? lineWidth.frame
                : lineWidth,
        };
    }, [
        tickCount,
        labelOffset,
        axisSide.x,
        axisSide.y,
        labelPosition,
        lineColor,
        lineWidth,
    ]);
    const { xTicks, yTicks, xAxisPosition, yAxisPosition, xLabelPosition, yLabelPosition, xLabelOffset, yLabelOffset, gridXLineColor, gridYLineColor, gridFrameLineColor, gridXLineWidth, gridYLineWidth, gridFrameLineWidth, } = axisConfiguration;
    const [x1 = 0, x2 = 0] = xScale.domain();
    const [y1 = 0, y2 = 0] = yScale.domain();
    const [x1r = 0, x2r = 0] = xScale.range();
    const fontSize = (_a = font === null || font === void 0 ? void 0 : font.getSize()) !== null && _a !== void 0 ? _a : 0;
    const yAxisNodes = yTicksNormalized.map((tick) => {
        const contentY = formatYLabel(tick);
        const labelWidth = (0, getFontGlyphWidth_1.getFontGlyphWidth)(contentY, font);
        const labelY = yScale(tick) + fontSize / 3;
        const labelX = (() => {
            // left, outset
            if (yAxisPosition === "left" && yLabelPosition === "outset") {
                return xScale(x1) - (labelWidth + yLabelOffset);
            }
            // left, inset
            if (yAxisPosition === "left" && yLabelPosition === "inset") {
                return xScale(x1) + yLabelOffset;
            }
            // right, outset
            if (yAxisPosition === "right" && yLabelPosition === "outset") {
                return xScale(x2) + yLabelOffset;
            }
            // right, inset
            return xScale(x2) - (labelWidth + yLabelOffset);
        })();
        const canFitLabelContent = labelY > fontSize && labelY < yScale(y2);
        return (<react_1.default.Fragment key={`y-tick-${tick}`}>
        {gridYLineWidth > 0 ? (<react_native_skia_1.Line p1={(0, react_native_skia_1.vec)(xScale(x1), yScale(tick))} p2={(0, react_native_skia_1.vec)(xScale(x2), yScale(tick))} color={gridYLineColor} strokeWidth={gridYLineWidth}/>) : null}
        {font
                ? canFitLabelContent && (<react_native_skia_1.Text color={typeof labelColor === "string" ? labelColor : labelColor.y} text={contentY} font={font} y={labelY} x={labelX}/>)
                : null}
      </react_1.default.Fragment>);
    });
    const xAxisNodes = xTicksNormalized.map((tick) => {
        const val = isNumericalData ? tick : ix[tick];
        const contentX = formatXLabel(val);
        const labelWidth = (0, getFontGlyphWidth_1.getFontGlyphWidth)(contentX, font);
        const labelX = xScale(tick) - (labelWidth !== null && labelWidth !== void 0 ? labelWidth : 0) / 2;
        const canFitLabelContent = yAxisPosition === "left" ? labelX + labelWidth < x2r : x1r < labelX;
        const labelY = (() => {
            // bottom, outset
            if (xAxisPosition === "bottom" && xLabelPosition === "outset") {
                return yScale(y2) + xLabelOffset + fontSize;
            }
            // bottom, inset
            if (xAxisPosition === "bottom" && xLabelPosition === "inset") {
                return yScale(y2) - xLabelOffset;
            }
            // top, outset
            if (xAxisPosition === "top" && xLabelPosition === "outset") {
                return yScale(y1) - xLabelOffset;
            }
            // top, inset
            return yScale(y1) + fontSize + xLabelOffset;
        })();
        return (<react_1.default.Fragment key={`x-tick-${tick}`}>
        {gridXLineWidth > 0 ? (<react_native_skia_1.Line p1={(0, react_native_skia_1.vec)(xScale(tick), yScale(y2))} p2={(0, react_native_skia_1.vec)(xScale(tick), yScale(y1))} color={gridXLineColor} strokeWidth={gridXLineWidth}/>) : null}
        {font && labelWidth && canFitLabelContent ? (<react_native_skia_1.Text color={typeof labelColor === "string" ? labelColor : labelColor.x} text={contentX} font={font} y={labelY} x={labelX}/>) : null}
      </react_1.default.Fragment>);
    });
    const boundingFrame = react_1.default.useMemo(() => {
        const framePath = react_native_skia_1.Skia.Path.Make();
        framePath.addRect(react_native_skia_1.Skia.XYWHRect(xScale(x1), yScale(y1), xScale(x2) - xScale(x1), yScale(y2) - yScale(y1)));
        return framePath;
    }, [x1, x2, xScale, y1, y2, yScale]);
    return (<>
      {xTicks > 0 ? xAxisNodes : null}
      {yTicks > 0 ? yAxisNodes : null}
      <react_native_skia_1.Path path={boundingFrame} strokeWidth={gridFrameLineWidth} style="stroke" color={gridFrameLineColor}/>
    </>);
};
exports.CartesianAxis = CartesianAxis;
exports.CartesianAxisDefaultProps = {
    lineColor: "hsla(0, 0%, 0%, 0.25)",
    lineWidth: react_native_1.StyleSheet.hairlineWidth,
    tickCount: 5,
    labelOffset: { x: 2, y: 4 },
    axisSide: { x: "bottom", y: "left" },
    labelPosition: "outset",
    formatXLabel: (label) => String(label),
    formatYLabel: (label) => String(label),
    labelColor: "#000000",
    ix: [],
    domain: null,
};
