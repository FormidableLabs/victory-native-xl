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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimatedPath = void 0;
const React = __importStar(require("react"));
const react_native_skia_1 = require("@shopify/react-native-skia");
const react_native_reanimated_1 = require("react-native-reanimated");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const usePrevious_1 = require("../../utils/usePrevious");
const useAnimatedPath_1 = require("../../hooks/useAnimatedPath");
/**
 * IMPORTANT!
 * For some reason, Skia doesn't like mixing shared and non-shared values?
 * Things seem to crash if you mix a derived value for the path with e.g. strings for color.
 * We do a little bit of gymnastics to make sure that all props are shared values.
 */
function AnimatedPath(_a) {
    var { path, animate, children } = _a, rest = __rest(_a, ["path", "animate", "children"]);
    const p = (0, useAnimatedPath_1.useAnimatedPath)(path, animate);
    const animProps = React.useMemo(() => {
        const vals = {};
        syncPropsToSharedValues(rest, vals);
        return vals;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const prevRest = (0, usePrevious_1.usePrevious)(rest);
    // Sync props to shared values when values change
    React.useEffect(() => {
        if (!(0, react_fast_compare_1.default)(rest, prevRest)) {
            syncPropsToSharedValues(rest, animProps);
        }
    }, [rest, prevRest, animProps]);
    return (<react_native_skia_1.Path path={p} {...animProps}>
      {children}
    </react_native_skia_1.Path>);
}
exports.AnimatedPath = AnimatedPath;
/**
 * Sync prop values to a map of prop -> shared values
 */
const syncPropsToSharedValues = (props, sharedValues) => {
    const keysToRemove = new Set(Object.keys(sharedValues));
    for (const key in props) {
        keysToRemove.delete(key);
        const propVal = props[key];
        const sharVal = sharedValues[key];
        // Shared value missing, create it
        if (!sharVal) {
            sharedValues[key] = (0, react_native_reanimated_1.isSharedValue)(propVal)
                ? propVal
                : (0, react_native_reanimated_1.makeMutable)(propVal);
        }
        // Shared value exists, update it if not already a shared value
        else if (!(0, react_native_reanimated_1.isSharedValue)(propVal)) {
            sharVal.value = propVal;
        }
    }
    // Remove keys that didn't get passed in props
    keysToRemove.forEach((key) => {
        delete sharedValues[key];
    });
};
