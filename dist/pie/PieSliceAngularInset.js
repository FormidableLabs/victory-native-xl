"use strict";
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
exports.PieSliceAngularInset = void 0;
const react_1 = __importDefault(require("react"));
const react_native_skia_1 = require("@shopify/react-native-skia");
const useSliceAngularInsetPath_1 = require("./hooks/useSliceAngularInsetPath");
const PieSliceContext_1 = require("./contexts/PieSliceContext");
const AnimatedPath_1 = require("../cartesian/components/AnimatedPath");
const PieSliceAngularInset = (props) => {
    const { angularInset, children, animate } = props, rest = __rest(props, ["angularInset", "children", "animate"]);
    const { slice } = (0, PieSliceContext_1.usePieSliceContext)();
    const [path, insetPaint] = (0, useSliceAngularInsetPath_1.useSliceAngularInsetPath)({ slice, angularInset });
    // If the path is empty, don't render anything
    if (path.toSVGString() === "M0 0L0 0M0 0L0 0") {
        return null;
    }
    if (angularInset.angularStrokeWidth === 0) {
        return null;
    }
    const Component = animate ? AnimatedPath_1.AnimatedPath : react_native_skia_1.Path;
    return (<Component path={path} paint={insetPaint} animate={animate} {...rest}>
      {children}
    </Component>);
};
exports.PieSliceAngularInset = PieSliceAngularInset;
