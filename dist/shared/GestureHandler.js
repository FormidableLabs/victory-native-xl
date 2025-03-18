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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GestureHandler = void 0;
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const React = __importStar(require("react"));
const transform_1 = require("../utils/transform");
// Create worklet for transform calculations
const calculateTransforms = (matrix) => {
    "worklet";
    const decomposed = (0, transform_1.getTransformComponents)(matrix);
    return [
        { translateX: decomposed.translateX },
        { translateY: decomposed.translateY },
        { scaleX: decomposed.scaleX },
        { scaleY: decomposed.scaleY },
    ];
};
const GestureHandler = ({ gesture, dimensions, transformState, derivedScrollX, debug = false, }) => {
    const { x, y, width, height } = dimensions;
    // Memoize static transforms
    const staticTransforms = React.useMemo(() => [
        { translateX: -width / 2 - x },
        { translateY: -height / 2 },
        { translateX: x + width / 2 },
        { translateY: height / 2 },
    ], [width, height, x, y]);
    // Derive dynamic transforms using worklet
    const dynamicTransforms = (0, react_native_reanimated_1.useDerivedValue)(() => {
        "worklet";
        if (!(transformState === null || transformState === void 0 ? void 0 : transformState.matrix.value))
            return [];
        return calculateTransforms(transformState.matrix.value);
    }, [transformState === null || transformState === void 0 ? void 0 : transformState.matrix]);
    // Optimize style calculation with worklet
    const style = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        "worklet";
        return {
            position: "absolute",
            backgroundColor: debug ? "rgba(100, 200, 300, 0.4)" : "transparent",
            left: x,
            top: y,
            width,
            height,
            transform: [
                staticTransforms[0],
                staticTransforms[1],
                ...dynamicTransforms.value,
                staticTransforms[2],
                staticTransforms[3],
            ],
        };
    }, [staticTransforms]);
    return (<react_native_gesture_handler_1.GestureDetector gesture={gesture}>
      <react_native_reanimated_1.default.View style={style}/>
    </react_native_gesture_handler_1.GestureDetector>);
};
exports.GestureHandler = GestureHandler;
