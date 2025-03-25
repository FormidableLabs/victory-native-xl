import * as React from "react";
import { Canvas, Group } from "@shopify/react-native-skia";
import { useDerivedValue, useSharedValue, } from "react-native-reanimated";
import { Gesture, GestureHandlerRootView, } from "react-native-gesture-handler";
import isEqual from "react-fast-compare";
import { transformInputData } from "./utils/transformInputData";
import { findClosestPoint } from "../utils/findClosestPoint";
import { valueFromSidedNumber } from "../utils/valueFromSidedNumber";
import { asNumber } from "../utils/asNumber";
import { useFunctionRef } from "../hooks/useFunctionRef";
import { CartesianChartProvider } from "./contexts/CartesianChartContext";
import { Frame } from "./components/Frame";
import { useBuildChartAxis } from "./hooks/useBuildChartAxis";
import { panTransformGesture, pinchTransformGesture, scrollTransformGesture, } from "./utils/transformGestures";
import { CartesianTransformProvider } from "./contexts/CartesianTransformContext";
import { GestureHandler } from "../shared/GestureHandler";
import { boundsToClip } from "../utils/boundsToClip";
import { useChartAxis } from "./CartesianAxis";
export function CartesianChartScroll({ transformState, children, ...rest }) {
    return (React.createElement(CartesianChartContent, { ...rest, transformState }, children));
}
function CartesianChartContent({ data, xKey, yKeys, padding, domainPadding, children, renderOutside = () => null, axisOptions, domain, chartPressState, chartPressConfig, onChartBoundsChange, onScaleChange, gestureLongPressDelay = 100, xAxis, yAxis, frame, transformState, transformConfig, customGestures, actionsRef, viewport, scrollState, onScroll, }) {
    const [size, setSize] = React.useState({ width: 0, height: 0 });
    const chartBoundsRef = React.useRef(undefined);
    const [hasMeasuredLayoutSize, setHasMeasuredLayoutSize] = React.useState(false);
    const onLayout = React.useCallback(({ nativeEvent: { layout } }) => {
        setHasMeasuredLayoutSize(true);
        setSize(layout);
    }, []);
    const normalizedAxisProps = useBuildChartAxis({
        xAxis,
        yAxis,
        frame,
        yKeys,
        axisOptions,
    });
    const tData = useSharedValue({
        ix: [],
        ox: [],
        y: yKeys.reduce((acc, key) => {
            acc[key] = { i: [], o: [] };
            return acc;
        }, {}),
    });
    const { yAxes, xScale, chartBounds, isNumericalData, xTicksNormalized, _tData, } = React.useMemo(() => {
        const { xScale, yAxes, isNumericalData, xTicksNormalized, ..._tData } = transformInputData({
            data,
            xKey,
            yKeys,
            outputWindow: {
                xMin: valueFromSidedNumber(padding, "left"),
                xMax: size.width - valueFromSidedNumber(padding, "right"),
                yMin: valueFromSidedNumber(padding, "top"),
                yMax: size.height - valueFromSidedNumber(padding, "bottom"),
            },
            domain,
            domainPadding,
            xAxis: normalizedAxisProps.xAxis,
            yAxes: normalizedAxisProps.yAxes,
            viewport,
            labelRotate: normalizedAxisProps.xAxis.labelRotate,
        });
        const primaryYAxis = yAxes[0];
        const primaryYScale = primaryYAxis.yScale;
        const chartBounds = {
            left: xScale(viewport?.x?.[0] ?? xScale.domain().at(0) ?? 0),
            right: xScale(viewport?.x?.[1] ?? xScale.domain().at(-1) ?? 0),
            top: primaryYScale(viewport?.y?.[1] ?? (primaryYScale.domain().at(0) || 0)),
            bottom: primaryYScale(viewport?.y?.[0] ?? (primaryYScale.domain().at(-1) || 0)),
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
    // scroll state
    const dimensions = React.useMemo(() => {
        const totalContentWidth = _tData.ox.length > 0
            ? Math.max(..._tData.ox) - Math.min(..._tData.ox)
            : 0;
        return {
            x: Math.min(xScale.range()[0] ?? 0, 0),
            y: Math.min(primaryYScale.range()[0] ?? 0, 0),
            width: (xScale.range()[1] ?? 0) - (xScale.range()[0] ?? 0),
            height: (primaryYScale.range()[1] ?? 0) - (primaryYScale.range()[0] ?? 0),
            totalContentWidth,
        };
    }, [xScale, primaryYScale, _tData.ox]);
    // dont love this, but it works for now
    const scrollX = useSharedValue(dimensions.totalContentWidth);
    const prevTranslateX = useSharedValue(dimensions.totalContentWidth);
    React.useEffect(() => {
        scrollX.value = dimensions.totalContentWidth - dimensions.width + 20;
        prevTranslateX.value = dimensions.totalContentWidth - dimensions.width;
    }, [dimensions.totalContentWidth, dimensions.width, scrollX, prevTranslateX]);
    /**
     * Pan gesture handling
     */
    const lastIdx = useSharedValue(null);
    /**
     * Take a "press value" and an x-value and update the shared values accordingly.
     */
    const handleTouch = (v, x, y) => {
        "worklet";
        // Adjust x position for scroll in a single place
        const adjustedX = x + scrollX.value;
        const idx = findClosestPoint(tData.value.ox, adjustedX);
        if (typeof idx !== "number")
            return;
        const isInYs = (yk) => yKeys.includes(yk);
        // begin stacked bar handling:
        // store the heights of each bar segment
        const barHeights = [];
        for (const yk in v.y) {
            if (isInYs(yk)) {
                const height = asNumber(tData.value.y[yk].i[idx]);
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
                v.x.position.value = asNumber(tData.value.ox[idx]) - scrollX.value;
                for (const yk in v.y) {
                    if (isInYs(yk)) {
                        v.y[yk].value.value = asNumber(tData.value.y[yk].i[idx]);
                        v.y[yk].position.value = asNumber(tData.value.y[yk].o[idx]);
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
    const touchMap = useSharedValue({});
    const activePressSharedValues = Array.isArray(chartPressState)
        ? chartPressState
        : [chartPressState];
    const gestureState = useSharedValue({
        isGestureActive: false,
        bootstrap: [],
    });
    const panGesture = Gesture.Pan()
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
            const touchId = touch?.id;
            const idx = typeof touchId === "number" && touchMap.value[touchId];
            const v = typeof idx === "number" && vals?.[idx];
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
            const touchId = touch?.id;
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
    if (!chartPressConfig?.pan) {
        /**
         * Activate after a long press, which helps with preventing all touch hijacking.
         * This is important if this chart is inside of some sort of scrollable container.
         */
        panGesture.activateAfterLongPress(gestureLongPressDelay);
    }
    if (chartPressConfig?.pan?.activateAfterLongPress) {
        panGesture.activateAfterLongPress(chartPressConfig.pan?.activateAfterLongPress);
    }
    if (chartPressConfig?.pan?.activeOffsetX) {
        panGesture.activeOffsetX(chartPressConfig.pan.activeOffsetX);
    }
    if (chartPressConfig?.pan?.activeOffsetY) {
        panGesture.activeOffsetX(chartPressConfig.pan.activeOffsetY);
    }
    if (chartPressConfig?.pan?.failOffsetX) {
        panGesture.failOffsetX(chartPressConfig.pan.failOffsetX);
    }
    if (chartPressConfig?.pan?.failOffsetY) {
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
                    x: asNumber(_tData.ox[i]),
                    xValue: x,
                    y: _tData.y[key].o[i],
                    yValue: _tData.y[key].i[i],
                }));
                return cache[key];
            },
        });
    }, [_tData, yKeys]);
    // On bounds change, emit
    const onChartBoundsRef = useFunctionRef(onChartBoundsChange);
    React.useEffect(() => {
        if (!isEqual(chartBounds, chartBoundsRef.current)) {
            chartBoundsRef.current = chartBounds;
            onChartBoundsRef.current?.(chartBounds);
        }
    }, [chartBounds, onChartBoundsRef]);
    const renderArg = {
        xScale,
        xTicks: xTicksNormalized,
        yScale: primaryYScale,
        yTicks: primaryYAxis.yTicksNormalized,
        chartBounds,
        canvasSize: size,
        points,
        scrollX,
    };
    const clipRect = boundsToClip(chartBounds);
    const FrameComponent = hasMeasuredLayoutSize && (axisOptions || frame) ? (React.createElement(Frame, { ...normalizedAxisProps.frame, xScale: xScale
            .copy()
            .range([chartBounds?.left + 1 || 25, size.width])
            .domain([0, size.width]), yScale: primaryYScale })) : null;
    // Memoize the composed gesture
    const composedGesture = React.useMemo(() => {
        let composed = customGestures ?? Gesture.Race();
        if (transformState && !scrollState) {
            if (transformConfig?.pinch?.enabled ?? true) {
                composed = Gesture.Race(composed, pinchTransformGesture(transformState, transformConfig?.pinch));
            }
            if (transformConfig?.pan?.enabled ?? true) {
                composed = Gesture.Race(composed, panTransformGesture(transformState, transformConfig?.pan));
            }
        }
        else if (scrollState) {
            composed = Gesture.Race(composed, scrollTransformGesture({
                scrollX,
                prevTranslateX,
                viewportWidth: size.width,
                length: _tData.ix.length,
                dimensions,
                onScroll,
            }));
        }
        if (chartPressState) {
            composed = Gesture.Race(composed, panGesture);
        }
        return composed;
    }, [
        size.width,
        dimensions,
        _tData.ix.length,
        panGesture,
        chartPressState,
        transformState,
        scrollState,
        transformConfig,
        customGestures,
        prevTranslateX,
        scrollX,
    ]);
    return (React.createElement(GestureHandlerRootView, { style: { flex: 1, overflow: "hidden" } },
        React.createElement(ChartBody, { onLayout: onLayout, FrameComponent: FrameComponent, primaryYScale: primaryYScale, xScale: xScale, clipRect: clipRect, transformState: transformState, hasMeasuredLayoutSize: hasMeasuredLayoutSize, renderArg: renderArg, renderOutside: renderOutside, yKeys: yKeys, axisOptions: axisOptions, onScaleChange: onScaleChange, xAxis: xAxis, yAxis: yAxis, frame: frame, chartBounds: chartBounds, yAxes: yAxes, isNumericalData: isNumericalData, _tData: _tData, scrollX: scrollX }, children),
        React.createElement(GestureHandler, { gesture: composedGesture, transformState: transformState, dimensions: dimensions, derivedScrollX: scrollX })));
}
const ChartBody = React.memo((propList) => {
    const { onLayout, FrameComponent, primaryYScale, xScale, clipRect, hasMeasuredLayoutSize, renderArg, scrollX, children, renderOutside, transformState, } = propList;
    const transform = useDerivedValue(() => {
        return [{ translateX: -scrollX.value }];
    });
    const AxisComponents = (React.createElement(CartesianTransformProvider, { transformState: transformState },
        React.createElement(AxisComponent, { ...propList })));
    return (React.createElement(Canvas, { style: { flex: 1 }, onLayout: onLayout },
        FrameComponent,
        AxisComponents,
        React.createElement(Group, null,
            React.createElement(CartesianChartProvider, { yScale: primaryYScale, xScale: xScale },
                React.createElement(Group, { clip: clipRect },
                    React.createElement(Group, { transform: transform }, hasMeasuredLayoutSize && children(renderArg))))),
        hasMeasuredLayoutSize && renderOutside?.(renderArg)));
});
function AxisComponent(props) {
    const xAxisClipRect = boundsToClip({
        bottom: props.chartBounds.bottom + 20,
        left: props.chartBounds.left,
        right: props.chartBounds.right,
        top: props.chartBounds.top,
    });
    const axis = useChartAxis(props);
    return (React.createElement(React.Fragment, null,
        axis.YAxisComponents,
        React.createElement(Group, { clip: xAxisClipRect }, axis.XAxisComponents)));
}
