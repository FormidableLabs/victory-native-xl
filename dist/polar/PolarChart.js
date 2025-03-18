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
exports.PolarChart = void 0;
const React = __importStar(require("react"));
const react_native_skia_1 = require("@shopify/react-native-skia");
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const its_fine_1 = require("its-fine");
const PolarChartContext_1 = require("./contexts/PolarChartContext");
const transformGestures_1 = require("../cartesian/utils/transformGestures");
const GestureHandler_1 = require("../shared/GestureHandler");
const PolarChartBase = (props) => {
    const { containerStyle, canvasStyle, children, onLayout, hasMeasuredLayoutSize, canvasSize, transformState, } = props;
    const { width, height } = canvasSize;
    const Bridge = (0, its_fine_1.useContextBridge)();
    let composed = react_native_gesture_handler_1.Gesture.Race();
    if (transformState) {
        composed = react_native_gesture_handler_1.Gesture.Race(composed, (0, transformGestures_1.pinchTransformGesture)(transformState), (0, transformGestures_1.panTransformGesture)(transformState));
    }
    return (<react_native_1.View style={[styles.baseContainer, containerStyle]}>
      <react_native_gesture_handler_1.GestureHandlerRootView style={{ flex: 1, overflow: "hidden" }}>
        <react_native_skia_1.Canvas onLayout={onLayout} style={react_native_1.StyleSheet.flatten([
            styles.canvasContainer,
            hasMeasuredLayoutSize ? { width, height } : null,
            canvasStyle,
        ])}>
          <Bridge>
            <react_native_skia_1.Group matrix={transformState === null || transformState === void 0 ? void 0 : transformState.matrix}>{children}</react_native_skia_1.Group>
          </Bridge>
        </react_native_skia_1.Canvas>
        <GestureHandler_1.GestureHandler gesture={composed} dimensions={{ x: 0, y: 0, width: width, height: height }}/>
      </react_native_gesture_handler_1.GestureHandlerRootView>
    </react_native_1.View>);
};
const PolarChart = (props) => {
    const { data, labelKey, colorKey, valueKey } = props;
    const [canvasSize, setCanvasSize] = React.useState({ width: 0, height: 0 });
    const [hasMeasuredLayoutSize, setHasMeasuredLayoutSize] = React.useState(false);
    const onLayout = React.useCallback(({ nativeEvent: { layout } }) => {
        setHasMeasuredLayoutSize(true);
        setCanvasSize(layout);
    }, []);
    return (<its_fine_1.FiberProvider>
      <PolarChartContext_1.PolarChartProvider data={data} labelKey={labelKey.toString()} colorKey={colorKey.toString()} valueKey={valueKey.toString()} canvasSize={canvasSize}>
        <PolarChartBase {...props} onLayout={onLayout} hasMeasuredLayoutSize={hasMeasuredLayoutSize} canvasSize={canvasSize}/>
      </PolarChartContext_1.PolarChartProvider>
    </its_fine_1.FiberProvider>);
};
exports.PolarChart = PolarChart;
const styles = react_native_1.StyleSheet.create({
    baseContainer: {
        flex: 1,
    },
    canvasContainer: {
        flex: 1,
    },
});
