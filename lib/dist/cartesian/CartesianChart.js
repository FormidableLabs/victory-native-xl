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
exports.CartesianChart = void 0;
const React = __importStar(require("react"));
const react_native_skia_1 = require("@shopify/react-native-skia");
const react_native_reanimated_1 = require("react-native-reanimated");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const d3_zoom_1 = require("d3-zoom");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const transformInputData_1 = require("./utils/transformInputData");
const findClosestPoint_1 = require("../utils/findClosestPoint");
const valueFromSidedNumber_1 = require("../utils/valueFromSidedNumber");
const asNumber_1 = require("../utils/asNumber");
const useFunctionRef_1 = require("../hooks/useFunctionRef");
const CartesianChartContext_1 = require("./contexts/CartesianChartContext");
const XAxis_1 = require("./components/XAxis");
const YAxis_1 = require("./components/YAxis");
const Frame_1 = require("./components/Frame");
const useBuildChartAxis_1 = require("./hooks/useBuildChartAxis");
const transformGestures_1 = require("./utils/transformGestures");
const CartesianTransformContext_1 = require("./contexts/CartesianTransformContext");
const tickHelpers_1 = require("../utils/tickHelpers");
const GestureHandler_1 = require("../shared/GestureHandler");
const boundsToClip_1 = require("../utils/boundsToClip");
const normalizeYAxisTicks_1 = require("../utils/normalizeYAxisTicks");
function CartesianChart(_a) {
    var { transformState, children } = _a, rest = __rest(_a, ["transformState", "children"]);
    return (<CartesianTransformContext_1.CartesianTransformProvider transformState={transformState}>
      <CartesianChartContent {...Object.assign(Object.assign({}, rest), { transformState })}>
        {children}
      </CartesianChartContent>
    </CartesianTransformContext_1.CartesianTransformProvider>);
}
exports.CartesianChart = CartesianChart;
function CartesianChartContent({ data, xKey, yKeys, padding, domainPadding, children, renderOutside = () => null, axisOptions, domain, chartPressState, chartPressConfig, onChartBoundsChange, onScaleChange, gestureLongPressDelay = 100, xAxis, yAxis, frame, transformState, transformConfig, customGestures, actionsRef, viewport, }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const [size, setSize] = React.useState({ width: 0, height: 0 });
    const chartBoundsRef = React.useRef(undefined);
    const xScaleRef = React.useRef(undefined);
    const yScaleRef = React.useRef(undefined);
    const [hasMeasuredLayoutSize, setHasMeasuredLayoutSize] = React.useState(false);
    const onLayout = React.useCallback(({ nativeEvent: { layout } }) => {
        setHasMeasuredLayoutSize(true);
        setSize(layout);
    }, []);
    const normalizedAxisProps = (0, useBuildChartAxis_1.useBuildChartAxis)({
        xAxis,
        yAxis,
        frame,
        yKeys,
        axisOptions,
    });
    // create a d3-zoom transform object based on the current transform state. This
    // is used for rescaling the X and Y axes.
    const transform = (0, CartesianTransformContext_1.useCartesianTransformContext)();
    const zoomX = React.useMemo(() => new d3_zoom_1.ZoomTransform(transform.k, transform.tx, transform.ty), [transform.k, transform.tx, transform.ty]);
    const zoomY = React.useMemo(() => new d3_zoom_1.ZoomTransform(transform.ky, transform.tx, transform.ty), [transform.ky, transform.tx, transform.ty]);
    const tData = (0, react_native_reanimated_1.useSharedValue)({
        ix: [],
        ox: [],
        y: yKeys.reduce((acc, key) => {
            acc[key] = { i: [], o: [] };
            return acc;
        }, {}),
    });
    const { yAxes, xScale, chartBounds, isNumericalData, xTicksNormalized, _tData, } = React.useMemo(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const _l = (0, transformInputData_1.transformInputData)({
            data,
            xKey,
            yKeys,
            outputWindow: {
                xMin: (0, valueFromSidedNumber_1.valueFromSidedNumber)(padding, "left"),
                xMax: size.width - (0, valueFromSidedNumber_1.valueFromSidedNumber)(padding, "right"),
                yMin: (0, valueFromSidedNumber_1.valueFromSidedNumber)(padding, "top"),
                yMax: size.height - (0, valueFromSidedNumber_1.valueFromSidedNumber)(padding, "bottom"),
            },
            domain,
            domainPadding,
            xAxis: normalizedAxisProps.xAxis,
            yAxes: normalizedAxisProps.yAxes,
            viewport,
            labelRotate: normalizedAxisProps.xAxis.labelRotate,
        }), { xScale, yAxes, isNumericalData, xTicksNormalized } = _l, _tData = __rest(_l, ["xScale", "yAxes", "isNumericalData", "xTicksNormalized"]);
        const primaryYAxis = yAxes[0];
        const primaryYScale = primaryYAxis.yScale;
        const chartBounds = {
            left: xScale((_c = (_b = (_a = viewport === null || viewport === void 0 ? void 0 : viewport.x) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : xScale.domain().at(0)) !== null && _c !== void 0 ? _c : 0),
            right: xScale((_f = (_e = (_d = viewport === null || viewport === void 0 ? void 0 : viewport.x) === null || _d === void 0 ? void 0 : _d[1]) !== null && _e !== void 0 ? _e : xScale.domain().at(-1)) !== null && _f !== void 0 ? _f : 0),
            top: primaryYScale((_h = (_g = viewport === null || viewport === void 0 ? void 0 : viewport.y) === null || _g === void 0 ? void 0 : _g[1]) !== null && _h !== void 0 ? _h : (primaryYScale.domain().at(0) || 0)),
            bottom: primaryYScale((_k = (_j = viewport === null || viewport === void 0 ? void 0 : viewport.y) === null || _j === void 0 ? void 0 : _j[0]) !== null && _k !== void 0 ? _k : (primaryYScale.domain().at(-1) || 0)),
        };
        return {
            xTicksNormalized,
            yAxes,
            xScale,
            chartBounds,
            isNumericalData,
            _tData,
        };
    }, [
        data,
        xKey,
        yKeys,
        padding,
        size.width,
        size.height,
        domain,
        domainPadding,
        normalizedAxisProps,
        viewport,
    ]);
    React.useEffect(() => {
        tData.value = _tData;
    }, [_tData, tData]);
    const primaryYAxis = yAxes[0];
    const primaryYScale = primaryYAxis.yScale;
    // stacked bar values
    const chartHeight = chartBounds.bottom;
    const yScaleTop = primaryYAxis.yScale.domain().at(0);
    const yScaleBottom = primaryYAxis.yScale.domain().at(-1);
    // end stacked bar values
    /**
     * Pan gesture handling
     */
    const lastIdx = (0, react_native_reanimated_1.useSharedValue)(null);
    /**
     * Take a "press value" and an x-value and update the shared values accordingly.
     */
    const handleTouch = (v, x, y) => {
        "worklet";
        const idx = (0, findClosestPoint_1.findClosestPoint)(tData.value.ox, x);
        if (typeof idx !== "number")
            return;
        const isInYs = (yk) => yKeys.includes(yk);
        // begin stacked bar handling:
        // store the heights of each bar segment
        const barHeights = [];
        for (const yk in v.y) {
            if (isInYs(yk)) {
                const height = (0, asNumber_1.asNumber)(tData.value.y[yk].i[idx]);
                barHeights.push(height);
            }
        }
        const chartYPressed = chartHeight - y; // Invert y-coordinate, since RNGH gives us the absolute Y, and we want to know where in the chart they clicked
        // Calculate the actual yValue of the touch within the domain of the yScale
        const yDomainValue = (chartYPressed / chartHeight) * (yScaleTop - yScaleBottom);
        // track the cumulative height and the y-index of the touched segment
        let cumulativeHeight = 0;
        let yIndex = -1;
        // loop through the bar heights to find which bar was touched
        for (let i = 0; i < barHeights.length; i++) {
            // Accumulate the height as we go along
            cumulativeHeight += barHeights[i];
            // Check if the y-value touched falls within the current segment
            if (yDomainValue <= cumulativeHeight) {
                // If it does, set yIndex to the current segment index and break
                yIndex = i;
                break;
            }
        }
        // Update the yIndex value in the state or context
        v.yIndex.value = yIndex;
        // end stacked bar handling
        if (v) {
            try {
                v.matchedIndex.value = idx;
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
    if (actionsRef) {
        actionsRef.current = {
            handleTouch,
        };
    }
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
                handleTouch(v, touch.x, touch.y);
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
            handleTouch(v, touch.x, touch.y);
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
            handleTouch(v, touch.x, touch.y);
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
    });
    if (!(chartPressConfig === null || chartPressConfig === void 0 ? void 0 : chartPressConfig.pan)) {
        /**
         * Activate after a long press, which helps with preventing all touch hijacking.
         * This is important if this chart is inside of some sort of scrollable container.
         */
        panGesture.activateAfterLongPress(gestureLongPressDelay);
    }
    if ((_a = chartPressConfig === null || chartPressConfig === void 0 ? void 0 : chartPressConfig.pan) === null || _a === void 0 ? void 0 : _a.activateAfterLongPress) {
        panGesture.activateAfterLongPress((_b = chartPressConfig.pan) === null || _b === void 0 ? void 0 : _b.activateAfterLongPress);
    }
    if ((_c = chartPressConfig === null || chartPressConfig === void 0 ? void 0 : chartPressConfig.pan) === null || _c === void 0 ? void 0 : _c.activeOffsetX) {
        panGesture.activeOffsetX(chartPressConfig.pan.activeOffsetX);
    }
    if ((_d = chartPressConfig === null || chartPressConfig === void 0 ? void 0 : chartPressConfig.pan) === null || _d === void 0 ? void 0 : _d.activeOffsetY) {
        panGesture.activeOffsetX(chartPressConfig.pan.activeOffsetY);
    }
    if ((_e = chartPressConfig === null || chartPressConfig === void 0 ? void 0 : chartPressConfig.pan) === null || _e === void 0 ? void 0 : _e.failOffsetX) {
        panGesture.failOffsetX(chartPressConfig.pan.failOffsetX);
    }
    if ((_f = chartPressConfig === null || chartPressConfig === void 0 ? void 0 : chartPressConfig.pan) === null || _f === void 0 ? void 0 : _f.failOffsetY) {
        panGesture.failOffsetX(chartPressConfig.pan.failOffsetY);
    }
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
        if (!(0, react_fast_compare_1.default)(chartBounds, chartBoundsRef.current)) {
            chartBoundsRef.current = chartBounds;
            (_a = onChartBoundsRef.current) === null || _a === void 0 ? void 0 : _a.call(onChartBoundsRef, chartBounds);
        }
    }, [chartBounds, onChartBoundsRef]);
    const onScaleRef = (0, useFunctionRef_1.useFunctionRef)(onScaleChange);
    React.useEffect(() => {
        var _a, _b, _c, _d, _e;
        const rescaledX = zoomX.rescaleX(xScale);
        const rescaledY = zoomY.rescaleY(primaryYScale);
        if (!(0, react_fast_compare_1.default)((_a = xScaleRef.current) === null || _a === void 0 ? void 0 : _a.domain(), rescaledX.domain()) ||
            !(0, react_fast_compare_1.default)((_b = yScaleRef.current) === null || _b === void 0 ? void 0 : _b.domain(), rescaledY.domain()) ||
            !(0, react_fast_compare_1.default)((_c = xScaleRef.current) === null || _c === void 0 ? void 0 : _c.range(), rescaledX.range()) ||
            !(0, react_fast_compare_1.default)((_d = yScaleRef.current) === null || _d === void 0 ? void 0 : _d.range(), rescaledY.range())) {
            xScaleRef.current = xScale;
            yScaleRef.current = primaryYScale;
            (_e = onScaleRef.current) === null || _e === void 0 ? void 0 : _e.call(onScaleRef, rescaledX, rescaledY);
        }
    }, [onScaleChange, onScaleRef, xScale, zoomX, zoomY, primaryYScale]);
    const renderArg = {
        xScale,
        xTicks: xTicksNormalized,
        yScale: primaryYScale,
        yTicks: primaryYAxis.yTicksNormalized,
        chartBounds,
        canvasSize: size,
        points,
    };
    const clipRect = (0, boundsToClip_1.boundsToClip)(chartBounds);
    const YAxisComponents = hasMeasuredLayoutSize && (axisOptions || yAxes)
        ? (_g = normalizedAxisProps.yAxes) === null || _g === void 0 ? void 0 : _g.map((axis, index) => {
            const yAxis = yAxes[index];
            if (!yAxis)
                return null;
            const primaryAxisProps = normalizedAxisProps.yAxes[0];
            const primaryRescaled = zoomY.rescaleY(primaryYScale);
            const rescaled = zoomY.rescaleY(yAxis.yScale);
            const rescaledTicks = axis.tickValues
                ? (0, tickHelpers_1.downsampleTicks)(axis.tickValues, axis.tickCount)
                : axis.enableRescaling
                    ? rescaled.ticks(axis.tickCount)
                    : yAxis.yScale.ticks(axis.tickCount);
            const primaryTicksRescaled = primaryAxisProps.tickValues
                ? (0, tickHelpers_1.downsampleTicks)(primaryAxisProps.tickValues, primaryAxisProps.tickCount)
                : primaryAxisProps.enableRescaling
                    ? primaryRescaled.ticks(primaryAxisProps.tickCount)
                    : primaryYScale.ticks(primaryAxisProps.tickCount);
            return (<YAxis_1.YAxis key={index} {...axis} xScale={zoomX.rescaleX(xScale)} yScale={rescaled} yTicksNormalized={index > 0 && !axis.tickValues
                    ? (0, normalizeYAxisTicks_1.normalizeYAxisTicks)(primaryTicksRescaled, primaryRescaled, rescaled)
                    : rescaledTicks} chartBounds={chartBounds}/>);
        })
        : null;
    const XAxisComponents = hasMeasuredLayoutSize && (axisOptions || xAxis) ? (<XAxis_1.XAxis {...normalizedAxisProps.xAxis} xScale={xScale} yScale={zoomY.rescaleY(primaryYScale)} ix={_tData.ix} isNumericalData={isNumericalData} chartBounds={chartBounds} zoom={zoomX}/>) : null;
    const FrameComponent = hasMeasuredLayoutSize && (axisOptions || frame) ? (<Frame_1.Frame {...normalizedAxisProps.frame} xScale={xScale} yScale={primaryYScale}/>) : null;
    // Body of the chart.
    const body = (<react_native_skia_1.Canvas style={{ flex: 1 }} onLayout={onLayout}>
      {YAxisComponents}
      {XAxisComponents}
      {FrameComponent}
      <CartesianChartContext_1.CartesianChartProvider yScale={primaryYScale} xScale={xScale}>
        <react_native_skia_1.Group clip={clipRect}>
          <react_native_skia_1.Group matrix={transformState === null || transformState === void 0 ? void 0 : transformState.matrix}>
            {hasMeasuredLayoutSize && children(renderArg)}
          </react_native_skia_1.Group>
        </react_native_skia_1.Group>
      </CartesianChartContext_1.CartesianChartProvider>
      {hasMeasuredLayoutSize && (renderOutside === null || renderOutside === void 0 ? void 0 : renderOutside(renderArg))}
    </react_native_skia_1.Canvas>);
    let composed = customGestures !== null && customGestures !== void 0 ? customGestures : react_native_gesture_handler_1.Gesture.Race();
    if (transformState) {
        if ((_j = (_h = transformConfig === null || transformConfig === void 0 ? void 0 : transformConfig.pinch) === null || _h === void 0 ? void 0 : _h.enabled) !== null && _j !== void 0 ? _j : true) {
            composed = react_native_gesture_handler_1.Gesture.Race(composed, (0, transformGestures_1.pinchTransformGesture)(transformState, transformConfig === null || transformConfig === void 0 ? void 0 : transformConfig.pinch));
        }
        if ((_l = (_k = transformConfig === null || transformConfig === void 0 ? void 0 : transformConfig.pan) === null || _k === void 0 ? void 0 : _k.enabled) !== null && _l !== void 0 ? _l : true) {
            composed = react_native_gesture_handler_1.Gesture.Race(composed, (0, transformGestures_1.panTransformGesture)(transformState, transformConfig === null || transformConfig === void 0 ? void 0 : transformConfig.pan));
        }
    }
    if (chartPressState) {
        composed = react_native_gesture_handler_1.Gesture.Race(composed, panGesture);
    }
    return (<react_native_gesture_handler_1.GestureHandlerRootView style={{ flex: 1, overflow: "hidden" }}>
      {body}
      <GestureHandler_1.GestureHandler gesture={composed} transformState={transformState} dimensions={{
            x: Math.min(xScale.range()[0], 0),
            y: Math.min(primaryYScale.range()[0], 0),
            width: xScale.range()[1] - Math.min(xScale.range()[0], 0),
            height: primaryYScale.range()[1] - Math.min(primaryYScale.range()[0], 0),
        }}/>
    </react_native_gesture_handler_1.GestureHandlerRootView>);
}
