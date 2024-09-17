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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarGroup = void 0;
const React = __importStar(require("react"));
const react_native_skia_1 = require("@shopify/react-native-skia");
const AnimatedPath_1 = require("./AnimatedPath");
const useBarGroupPaths_1 = require("../hooks/useBarGroupPaths");
const useFunctionRef_1 = require("../../hooks/useFunctionRef");
function BarGroup({ betweenGroupPadding = 0.25, withinGroupPadding = 0.25, chartBounds, roundedCorners, children, onBarSizeChange, barWidth: customBarWidth, barCount, }) {
    // Collect the bar props
    const bars = [];
    React.Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
            if (child.type === BarGroupBar) {
                bars.push(child.props);
            }
        }
    });
    const { paths, barWidth, groupWidth, gapWidth } = (0, useBarGroupPaths_1.useBarGroupPaths)(bars.map((bar) => bar.points), chartBounds, betweenGroupPadding, withinGroupPadding, roundedCorners, customBarWidth, barCount);
    // Handle bar size change
    const onBarSizeChangeRef = (0, useFunctionRef_1.useFunctionRef)(onBarSizeChange);
    React.useEffect(() => {
        var _a;
        (_a = onBarSizeChangeRef.current) === null || _a === void 0 ? void 0 : _a.call(onBarSizeChangeRef, { barWidth, groupWidth, gapWidth });
    }, [barWidth, gapWidth, groupWidth, onBarSizeChangeRef]);
    // If no bars, short-circuit
    const firstBar = bars[0];
    if (!firstBar)
        return null;
    return bars.map((props, i) => React.createElement(BarGroupBar, Object.assign(Object.assign({}, props), { 
        // @ts-ignore
        __path: paths[i], key: i })));
}
exports.BarGroup = BarGroup;
BarGroup.Bar = BarGroupBar;
function BarGroupBar(props) {
    const { animate } = props, rest = __rest(props, ["animate"]);
    // Props that come from BarGroup but aren't exposed publicly.
    // @ts-ignore
    const path = props.__path;
    return React.createElement(animate ? AnimatedPath_1.AnimatedPath : react_native_skia_1.Path, Object.assign(Object.assign({ path, style: "fill", color: "red" }, rest), (Boolean(animate) && { animate })));
}
