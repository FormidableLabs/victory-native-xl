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
exports.CartesianChart = void 0;
const React = __importStar(require("react"));
const react_native_skia_1 = require("@shopify/react-native-skia");
const react_native_reanimated_1 = require("react-native-reanimated");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const transformInputData_1 = require("./utils/transformInputData");
const findClosestPoint_1 = require("../utils/findClosestPoint");
const valueFromSidedNumber_1 = require("../utils/valueFromSidedNumber");
const CartesianAxis_1 = require("./components/CartesianAxis");
const asNumber_1 = require("../utils/asNumber");
const useFunctionRef_1 = require("../hooks/useFunctionRef");
const CartesianChartContext_1 = require("./contexts/CartesianChartContext");
function CartesianChart({ data, xKey, yKeys, padding, domainPadding, children, renderOutside = () => null, axisOptions, domain, chartPressState, onChartBoundsChange, gestureLongPressDelay = 100, }) {
    const [size, setSize] = React.useState({ width: 0, height: 0 });
    const [hasMeasuredLayoutSize, setHasMeasuredLayoutSize] = React.useState(false);
    const onLayout = React.useCallback(({ nativeEvent: { layout } }) => {
        setHasMeasuredLayoutSize(true);
        setSize(layout);
    }, []);
    const tData = (0, react_native_reanimated_1.useSharedValue)({
        ix: [],
        ox: [],
        y: yKeys.reduce((acc, key) => {
            acc[key] = { i: [], o: [] };
            return acc;
        }, {}),
    });
    const { xTicksNormalized, yTicksNormalized, xScale, yScale, chartBounds, isNumericalData, _tData, } = React.useMemo(() => {
        const _a = (0, transformInputData_1.transformInputData)({
            data,
            xKey,
            yKeys,
            axisOptions: axisOptions
                ? Object.assign({}, CartesianAxis_1.CartesianAxisDefaultProps, axisOptions)
                : undefined,
            outputWindow: {
                xMin: (0, valueFromSidedNumber_1.valueFromSidedNumber)(padding, "left"),
                xMax: size.width - (0, valueFromSidedNumber_1.valueFromSidedNumber)(padding, "right"),
                yMin: (0, valueFromSidedNumber_1.valueFromSidedNumber)(padding, "top"),
                yMax: size.height - (0, valueFromSidedNumber_1.valueFromSidedNumber)(padding, "bottom"),
            },
            domain,
            domainPadding,
        }), { xScale, yScale, isNumericalData, xTicksNormalized, yTicksNormalized } = _a, _tData = __rest(_a, ["xScale", "yScale", "isNumericalData", "xTicksNormalized", "yTicksNormalized"]);
        tData.value = _tData;
        const chartBounds = {
            left: xScale(xScale.domain().at(0) || 0),
            right: xScale(xScale.domain().at(-1) || 0),
            top: yScale(yScale.domain().at(0) || 0),
            bottom: yScale(yScale.domain().at(-1) || 0),
        };
        return {
            xTicksNormalized,
            yTicksNormalized,
            tData,
            xScale,
            yScale,
            chartBounds,
            isNumericalData,
            _tData,
        };
    }, [
        data,
        xKey,
        yKeys,
        axisOptions,
        padding,
        size.width,
        size.height,
        domain,
        domainPadding,
        tData,
    ]);
    /**
     * Pan gesture handling
     */
    const lastIdx = (0, react_native_reanimated_1.useSharedValue)(null);
    /**
     * Take a "press value" and an x-value and update the shared values accordingly.
     */
    const handleTouch = (v, x) => {
        "worklet";
        const idx = (0, findClosestPoint_1.findClosestPoint)(tData.value.ox, x);
        if (typeof idx !== "number")
            return;
        const isInYs = (yk) => yKeys.includes(yk);
        // Shared value
        if (v) {
            try {
                v.x.value.value = tData.value.ix[idx];
                v.x.position.value = (0, asNumber_1.asNumber)(tData.value.ox[idx]);
                for (const yk in v.y) {
                    if (isInYs(yk)) {
                        v.y[yk].value.value = (0, asNumber_1.asNumber)(tData.value.y[yk].i[idx]);
                        v.y[yk].position.value = (0, asNumber_1.asNumber)(tData.value.y[yk].o[idx]);
                    }
                }
            }
            catch (err) {
                // no-op
            }
        }
        lastIdx.value = idx;
    };
    /**
     * Touch gesture is a modified Pan gesture handler that allows for multiple presses:
     * - Using Pan Gesture handler effectively _just_ for the .activateAfterLongPress functionality.
     * - Tracking the finger is handled with .onTouchesMove instead of .onUpdate, because
     *    .onTouchesMove gives us access to each individual finger.
     * - The activation gets a bit complicated because we want to wait til "start" state before updating Press Value
     *    which gives time for the gesture to get cancelled before we start updating the shared values.
     *    Therefore we use gestureState.bootstrap to store some "bootstrap" information if gesture isn't active when finger goes down.
     */
    // touch ID -> value index mapping to keep track of which finger updates which value
    const touchMap = (0, react_native_reanimated_1.useSharedValue)({});
    const activePressSharedValues = Array.isArray(chartPressState)
        ? chartPressState
        : [chartPressState];
    const gestureState = (0, react_native_reanimated_1.useSharedValue)({
        isGestureActive: false,
        bootstrap: [],
    });
    const panGesture = react_native_gesture_handler_1.Gesture.Pan()
        /**
         * When a finger goes down, either update the state or store in the bootstrap array.
         */
        .onTouchesDown((e) => {
        const vals = activePressSharedValues || [];
        if (!vals.length || e.numberOfTouches === 0)
            return;
        for (let i = 0; i < Math.min(e.allTouches.length, vals.length); i++) {
            const touch = e.allTouches[i];
            const v = vals[i];
            if (!v || !touch)
                continue;
            if (gestureState.value.isGestureActive) {
                // Update the mapping
                if (typeof touchMap.value[touch.id] !== "number")
                    touchMap.value[touch.id] = i;
                v.isActive.value = true;
                handleTouch(v, touch.x);
            }
            else {
                gestureState.value.bootstrap.push([v, touch]);
            }
        }
    })
        /**
         * On start, check if we have any bootstraped updates we need to apply.
         */
        .onStart(() => {
        gestureState.value.isGestureActive = true;
        for (let i = 0; i < gestureState.value.bootstrap.length; i++) {
            const [v, touch] = gestureState.value.bootstrap[i];
            // Update the mapping
            if (typeof touchMap.value[touch.id] !== "number")
                touchMap.value[touch.id] = i;
            v.isActive.value = true;
            handleTouch(v, touch.x);
        }
    })
        /**
         * Clear gesture state on gesture end.
         */
        .onFinalize(() => {
        gestureState.value.isGestureActive = false;
        gestureState.value.bootstrap = [];
    })
        /**
         * As fingers move, update the shared values accordingly.
         */
        .onTouchesMove((e) => {
        const vals = activePressSharedValues || [];
        if (!vals.length || e.numberOfTouches === 0)
            return;
        for (let i = 0; i < Math.min(e.allTouches.length, vals.length); i++) {
            const touch = e.allTouches[i];
            const touchId = touch === null || touch === void 0 ? void 0 : touch.id;
            const idx = typeof touchId === "number" && touchMap.value[touchId];
            const v = typeof idx === "number" && (vals === null || vals === void 0 ? void 0 : vals[idx]);
            if (!v || !touch)
                continue;
            if (!v.isActive.value)
                v.isActive.value = true;
            handleTouch(v, touch.x);
        }
    })
        /**
         * On each finger up, start to update values and "free up" the touch map.
         */
        .onTouchesUp((e) => {
        for (const touch of e.changedTouches) {
            const vals = activePressSharedValues || [];
            // Set active state to false
            const touchId = touch === null || touch === void 0 ? void 0 : touch.id;
            const idx = typeof touchId === "number" && touchMap.value[touchId];
            const val = typeof idx === "number" && vals[idx];
            if (val) {
                val.isActive.value = false;
            }
            // Free up touch map for this touch
            touchMap.value[touch.id] = undefined;
        }
    })
        /**
         * Once the gesture ends, ensure all active values are falsified.
         */
        .onEnd(() => {
        const vals = activePressSharedValues || [];
        // Set active state to false for all vals
        for (const val of vals) {
            if (val) {
                val.isActive.value = false;
            }
        }
    })
        /**
         * Activate after a long press, which helps with preventing all touch hijacking.
         * This is important if this chart is inside of some sort of scrollable container.
         */
        .activateAfterLongPress(gestureLongPressDelay);
    const points = React.useMemo(() => {
        const cache = {};
        return new Proxy({}, {
            get(_, property) {
                const key = property;
                if (!yKeys.includes(key))
                    return undefined;
                if (cache[key])
                    return cache[key];
                cache[key] = _tData.ix.map((x, i) => ({
                    x: (0, asNumber_1.asNumber)(_tData.ox[i]),
                    xValue: x,
                    y: _tData.y[key].o[i],
                    yValue: _tData.y[key].i[i],
                }));
                return cache[key];
            },
        });
    }, [_tData, yKeys]);
    // On bounds change, emit
    const onChartBoundsRef = (0, useFunctionRef_1.useFunctionRef)(onChartBoundsChange);
    React.useEffect(() => {
        var _a;
        (_a = onChartBoundsRef.current) === null || _a === void 0 ? void 0 : _a.call(onChartBoundsRef, chartBounds);
    }, [chartBounds, onChartBoundsRef]);
    const renderArg = {
        xScale,
        yScale,
        chartBounds,
        canvasSize: size,
        points,
    };
    const clipRect = (0, react_native_skia_1.rect)(chartBounds.left, chartBounds.top, chartBounds.right - chartBounds.left, chartBounds.bottom - chartBounds.top);
    // Body of the chart.
    const body = (<react_native_skia_1.Canvas style={{ flex: 1 }} onLayout={onLayout}>
      {hasMeasuredLayoutSize && (<>
          {axisOptions ? (<CartesianAxis_1.CartesianAxis {...Object.assign(Object.assign({}, axisOptions), { xScale,
                yScale,
                isNumericalData,
                xTicksNormalized,
                yTicksNormalized, ix: _tData.ix })}/>) : null}
        </>)}
      <CartesianChartContext_1.CartesianChartProvider yScale={yScale} xScale={xScale}>
        <react_native_skia_1.Group clip={clipRect}>
          {hasMeasuredLayoutSize && children(renderArg)}
        </react_native_skia_1.Group>
      </CartesianChartContext_1.CartesianChartProvider>
      {hasMeasuredLayoutSize && (renderOutside === null || renderOutside === void 0 ? void 0 : renderOutside(renderArg))}
    </react_native_skia_1.Canvas>);
    // Conditionally wrap the body in gesture handler based on activePressSharedValue
    return chartPressState ? (<react_native_gesture_handler_1.GestureHandlerRootView style={{ flex: 1 }}>
      <react_native_gesture_handler_1.GestureDetector gesture={panGesture}>{body}</react_native_gesture_handler_1.GestureDetector>
    </react_native_gesture_handler_1.GestureHandlerRootView>) : (body);
}
exports.CartesianChart = CartesianChart;
