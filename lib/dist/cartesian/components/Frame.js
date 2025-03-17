"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrameDefaults = exports.Frame = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_skia_1 = require("@shopify/react-native-skia");
const Frame = ({ xScale, yScale, lineColor, lineWidth, linePathEffect, }) => {
    const [x1 = 0, x2 = 0] = xScale.domain();
    const [y1 = 0, y2 = 0] = yScale.domain();
    const boundingFrame = react_1.default.useMemo(() => {
        const framePath = react_native_skia_1.Skia.Path.Make();
        if (typeof lineWidth === "number") {
            framePath.addRect(react_native_skia_1.Skia.XYWHRect(xScale(x1), yScale(y1), xScale(x2) - xScale(x1), yScale(y2) - yScale(y1)));
            return <react_native_skia_1.Path key="full-frame" path={framePath} strokeWidth={lineWidth}/>;
        }
        else {
            const lines = [];
            const _lineWidth = Object.assign({ top: react_native_1.StyleSheet.hairlineWidth, right: react_native_1.StyleSheet.hairlineWidth, bottom: react_native_1.StyleSheet.hairlineWidth, left: react_native_1.StyleSheet.hairlineWidth }, lineWidth);
            if (_lineWidth.top > 0) {
                lines.push(<react_native_skia_1.Line key="frame-top" p1={(0, react_native_skia_1.vec)(xScale(x1), yScale(y1))} p2={(0, react_native_skia_1.vec)(xScale(x2), yScale(y1))} strokeWidth={lineWidth.top}/>);
            }
            if (_lineWidth.right > 0) {
                lines.push(<react_native_skia_1.Line key="frame-right" p1={(0, react_native_skia_1.vec)(xScale(x2), yScale(y1))} p2={(0, react_native_skia_1.vec)(xScale(x2), yScale(y2))} strokeWidth={lineWidth.right}/>);
            }
            if (_lineWidth.bottom > 0) {
                lines.push(<react_native_skia_1.Line key="frame-bottom" p1={(0, react_native_skia_1.vec)(xScale(x2), yScale(y2))} p2={(0, react_native_skia_1.vec)(xScale(x1), yScale(y2))} strokeWidth={lineWidth.bottom}/>);
            }
            if (_lineWidth.left > 0) {
                lines.push(<react_native_skia_1.Line key="frame-left" p1={(0, react_native_skia_1.vec)(xScale(x1), yScale(y2))} p2={(0, react_native_skia_1.vec)(xScale(x1), yScale(y1))} strokeWidth={lineWidth.left}/>);
            }
            return lines;
        }
    }, [x1, x2, xScale, y1, y2, yScale, lineWidth]);
    if (typeof lineWidth === "number" && lineWidth <= 0) {
        return null;
    }
    return (<react_native_skia_1.Group color={lineColor} style="stroke">
      {linePathEffect}
      {boundingFrame}
    </react_native_skia_1.Group>);
};
exports.Frame = Frame;
exports.FrameDefaults = {
    lineColor: "hsla(0, 0%, 0%, 0.25)",
    lineWidth: react_native_1.StyleSheet.hairlineWidth,
};
