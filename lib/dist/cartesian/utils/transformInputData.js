"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformInputData = void 0;
const getOffsetFromAngle_1 = require("../../utils/getOffsetFromAngle");
const tickHelpers_1 = require("../../utils/tickHelpers");
const asNumber_1 = require("../../utils/asNumber");
const makeScale_1 = require("./makeScale");
/**
 * This is a fatty. Takes raw user input data, and transforms it into a format
 *  that's easier for us to consume. End result looks something like:
 *  {
 *    ix: [1, 2, 3], // input x values
 *    ox: [10, 20, 30], // canvas x values
 *    y: {
 *      high: { i: [3, 4, 5], o: [30, 40, 50] },
 *      low: { ... }
 *    }
 *  }
 *  This form allows us to easily e.g. do a binary search to find closest output x index
 *   and then map that into each of the other value lists.
 */
const transformInputData = ({ data: _data, xKey, yKeys, outputWindow, domain, domainPadding, xAxis, yAxes, viewport, labelRotate, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const data = [..._data];
    // Determine if xKey data is numerical
    const isNumericalData = data.every((datum) => typeof datum[xKey] === "number");
    // and sort if it is
    if (isNumericalData) {
        data.sort((a, b) => +a[xKey] - +b[xKey]);
    }
    // // Set up our y-output data structure
    const y = yKeys.reduce((acc, k) => {
        acc[k] = { i: [], o: [] };
        return acc;
    }, {});
    // 1. Set up our y axes first...
    // Transform data for each y-axis configuration
    const yAxesTransformed = (_a = (yAxes !== null && yAxes !== void 0 ? yAxes : [{}])) === null || _a === void 0 ? void 0 : _a.map((yAxis) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const fontHeight = (_c = (_b = (_a = yAxis.font) === null || _a === void 0 ? void 0 : _a.getSize) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : 0;
        const yTickValues = yAxis.tickValues;
        const yTicks = yAxis.tickCount;
        const tickDomainsY = yAxis.domain
            ? yAxis.domain
            : (0, tickHelpers_1.getDomainFromTicks)(yAxis.tickValues);
        const yKeysForAxis = (_d = yAxis.yKeys) !== null && _d !== void 0 ? _d : yKeys;
        const yMin = (_g = (_f = (_e = domain === null || domain === void 0 ? void 0 : domain.y) === null || _e === void 0 ? void 0 : _e[0]) !== null && _f !== void 0 ? _f : tickDomainsY === null || tickDomainsY === void 0 ? void 0 : tickDomainsY[0]) !== null && _g !== void 0 ? _g : Math.min(...yKeysForAxis.map((key) => {
            return data.reduce((min, curr) => {
                if (typeof curr[key] !== "number")
                    return min;
                return Math.min(min, curr[key]);
            }, Infinity);
        }));
        const yMax = (_k = (_j = (_h = domain === null || domain === void 0 ? void 0 : domain.y) === null || _h === void 0 ? void 0 : _h[1]) !== null && _j !== void 0 ? _j : tickDomainsY === null || tickDomainsY === void 0 ? void 0 : tickDomainsY[1]) !== null && _k !== void 0 ? _k : Math.max(...yKeysForAxis.map((key) => {
            return data.reduce((max, curr) => {
                if (typeof curr[key] !== "number")
                    return max;
                return Math.max(max, curr[key]);
            }, -Infinity);
        }));
        // Set up our y-scale, notice how domain is "flipped" because
        //  we're moving from cartesian to canvas coordinates
        // Also, if single data point, manually add upper & lower bounds so chart renders properly
        const yScaleDomain = (yMax === yMin ? [yMax + 1, yMin - 1] : [yMax, yMin]);
        const yScaleRange = (() => {
            var _a, _b;
            const xTickCount = (_a = (typeof (yAxis === null || yAxis === void 0 ? void 0 : yAxis.tickCount) === "number"
                ? yAxis === null || yAxis === void 0 ? void 0 : yAxis.tickCount
                : xAxis === null || xAxis === void 0 ? void 0 : xAxis.tickCount)) !== null && _a !== void 0 ? _a : 0;
            const yLabelOffset = (_b = yAxis.labelOffset) !== null && _b !== void 0 ? _b : 0;
            const xAxisSide = xAxis === null || xAxis === void 0 ? void 0 : xAxis.axisSide;
            const xLabelPosition = xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelPosition;
            // bottom, outset
            if (xAxisSide === "bottom" && xLabelPosition === "outset") {
                return [
                    outputWindow.yMin,
                    outputWindow.yMax +
                        (xTickCount > 0 ? -fontHeight - yLabelOffset * 2 : 0),
                ];
            }
            // Top outset
            if (xAxisSide === "top" && xLabelPosition === "outset") {
                return [
                    outputWindow.yMin +
                        (xTickCount > 0 ? fontHeight + yLabelOffset * 2 : 0),
                    outputWindow.yMax,
                ];
            }
            // Inset labels don't need added offsets
            return [outputWindow.yMin, outputWindow.yMax];
        })();
        const yScale = (0, makeScale_1.makeScale)({
            inputBounds: yScaleDomain,
            outputBounds: yScaleRange,
            // Reverse viewport y values since canvas coordinates increase downward
            viewport: (viewport === null || viewport === void 0 ? void 0 : viewport.y) ? [viewport.y[1], viewport.y[0]] : yScaleDomain,
            isNice: true,
            padEnd: typeof domainPadding === "number"
                ? domainPadding
                : domainPadding === null || domainPadding === void 0 ? void 0 : domainPadding.bottom,
            padStart: typeof domainPadding === "number" ? domainPadding : domainPadding === null || domainPadding === void 0 ? void 0 : domainPadding.top,
        });
        const yData = yKeysForAxis.reduce((acc, key) => {
            acc[key] = {
                i: data.map((datum) => datum[key]),
                o: data.map((datum) => typeof datum[key] === "number"
                    ? yScale(datum[key])
                    : datum[key]),
            };
            return acc;
        }, {});
        const yTicksNormalized = yTickValues
            ? (0, tickHelpers_1.downsampleTicks)(yTickValues, yTicks)
            : yScale.ticks(yTicks);
        yKeys.forEach((yKey) => {
            if (yKeysForAxis.includes(yKey)) {
                y[yKey].i = data.map((datum) => datum[yKey]);
                y[yKey].o = data.map((datum) => (typeof datum[yKey] === "number"
                    ? yScale(datum[yKey])
                    : datum[yKey]));
            }
        });
        const maxYLabel = Math.max(...yTicksNormalized.map((yTick) => {
            var _a, _b, _c, _d;
            return (_d = (_b = (_a = yAxis === null || yAxis === void 0 ? void 0 : yAxis.font) === null || _a === void 0 ? void 0 : _a.getGlyphWidths) === null || _b === void 0 ? void 0 : _b.call(_a, yAxis.font.getGlyphIDs(((_c = yAxis === null || yAxis === void 0 ? void 0 : yAxis.formatYLabel) === null || _c === void 0 ? void 0 : _c.call(yAxis, yTick)) || String(yTick))).reduce((sum, value) => sum + value, 0)) !== null && _d !== void 0 ? _d : 0;
        }));
        return {
            yScale,
            yTicksNormalized,
            yData,
            maxYLabel,
        };
    });
    // 2. Then set up our x axis...
    // Determine the x-output range based on yAxes/label options
    const oRange = (() => {
        let xMinAdjustment = 0;
        let xMaxAdjustment = 0;
        yAxes === null || yAxes === void 0 ? void 0 : yAxes.forEach((axis, index) => {
            var _a, _b;
            const yTickCount = axis.tickCount;
            const yLabelPosition = axis.labelPosition;
            const yAxisSide = axis.axisSide;
            const yLabelOffset = axis.labelOffset;
            // Calculate label width for this axis
            const labelWidth = (_b = (_a = yAxesTransformed[index]) === null || _a === void 0 ? void 0 : _a.maxYLabel) !== null && _b !== void 0 ? _b : 0;
            // Adjust xMin or xMax based on the axis side and label position
            if (yAxisSide === "left" && yLabelPosition === "outset") {
                xMinAdjustment += yTickCount > 0 ? labelWidth + yLabelOffset : 0;
            }
            else if (yAxisSide === "right" && yLabelPosition === "outset") {
                xMaxAdjustment += yTickCount > 0 ? -labelWidth - yLabelOffset : 0;
            }
        });
        // Return the adjusted output range
        return [
            outputWindow.xMin + xMinAdjustment,
            outputWindow.xMax + xMaxAdjustment,
        ];
    })();
    const xTickValues = xAxis === null || xAxis === void 0 ? void 0 : xAxis.tickValues;
    // The user can specify either:
    // custom X tick values
    // OR
    // custom X tick count
    const xTicks = xAxis === null || xAxis === void 0 ? void 0 : xAxis.tickCount;
    // x tick domain of [number, number]
    const tickDomainsX = (0, tickHelpers_1.getDomainFromTicks)(xTickValues);
    // Input x is just extracting the xKey from each datum
    const ix = data.map((datum) => datum[xKey]);
    const ixNum = ix.map((val, i) => (isNumericalData ? val : i));
    // Generate our x-scale
    // If user provides a domain, use that as our min / max
    // Else if, tickValues are provided, we use that instead
    // Else, we find min / max of y values across all yKeys, and use that for y range instead.
    const ixMin = (0, asNumber_1.asNumber)((_d = (_c = (_b = domain === null || domain === void 0 ? void 0 : domain.x) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : tickDomainsX === null || tickDomainsX === void 0 ? void 0 : tickDomainsX[0]) !== null && _d !== void 0 ? _d : ixNum.at(0)), ixMax = (0, asNumber_1.asNumber)((_g = (_f = (_e = domain === null || domain === void 0 ? void 0 : domain.x) === null || _e === void 0 ? void 0 : _e[1]) !== null && _f !== void 0 ? _f : tickDomainsX === null || tickDomainsX === void 0 ? void 0 : tickDomainsX[1]) !== null && _g !== void 0 ? _g : ixNum.at(-1));
    const xInputBounds = ixMin === ixMax ? [ixMin - 1, ixMax + 1] : [ixMin, ixMax];
    const xScale = (0, makeScale_1.makeScale)({
        // if single data point, manually add upper & lower bounds so chart renders properly
        inputBounds: xInputBounds,
        outputBounds: oRange,
        viewport: (_h = viewport === null || viewport === void 0 ? void 0 : viewport.x) !== null && _h !== void 0 ? _h : xInputBounds,
        padStart: typeof domainPadding === "number" ? domainPadding : domainPadding === null || domainPadding === void 0 ? void 0 : domainPadding.left,
        padEnd: typeof domainPadding === "number" ? domainPadding : domainPadding === null || domainPadding === void 0 ? void 0 : domainPadding.right,
    });
    // Normalize xTicks values either via the d3 scaleLinear ticks() function or our custom downSample function
    // For consistency we do it here, so we have both y and x ticks to pass to the axis generator
    const xTicksNormalized = xTickValues
        ? (0, tickHelpers_1.downsampleTicks)(xTickValues, xTicks)
        : xScale.ticks(xTicks);
    // If labelRotate is true, dynamically adjust yScale range to accommodate the maximum X label width
    if (labelRotate) {
        const maxXLabel = Math.max(...xTicksNormalized.map((xTick) => {
            var _a, _b, _c, _d;
            return (_d = (_b = (_a = xAxis === null || xAxis === void 0 ? void 0 : xAxis.font) === null || _a === void 0 ? void 0 : _a.getGlyphWidths) === null || _b === void 0 ? void 0 : _b.call(_a, xAxis.font.getGlyphIDs(((_c = xAxis === null || xAxis === void 0 ? void 0 : xAxis.formatXLabel) === null || _c === void 0 ? void 0 : _c.call(xAxis, xTick)) || String(xTick))).reduce((sum, value) => sum + value, 0)) !== null && _d !== void 0 ? _d : 0;
        }));
        // First, we pass labelRotate as radian to Math.sin to get labelOffset multiplier based on maxLabel width
        // We then use this multiplier to calculate labelOffset for rotated labels
        const rotateLabelOffset = Math.abs(maxXLabel * (0, getOffsetFromAngle_1.getOffsetFromAngle)(labelRotate));
        const yScaleRange0 = (_j = yAxesTransformed[0]) === null || _j === void 0 ? void 0 : _j.yScale.range().at(0);
        const yScaleRange1 = (_k = yAxesTransformed[0]) === null || _k === void 0 ? void 0 : _k.yScale.range().at(-1);
        // bottom, outset
        if ((xAxis === null || xAxis === void 0 ? void 0 : xAxis.axisSide) === "bottom" && (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelPosition) === "outset") {
            (_l = yAxesTransformed[0]) === null || _l === void 0 ? void 0 : _l.yScale.range([
                yScaleRange0,
                yScaleRange1 - rotateLabelOffset,
            ]);
        }
        // top, outset
        if ((xAxis === null || xAxis === void 0 ? void 0 : xAxis.axisSide) === "top" && (xAxis === null || xAxis === void 0 ? void 0 : xAxis.labelPosition) === "outset") {
            (_m = yAxesTransformed[0]) === null || _m === void 0 ? void 0 : _m.yScale.range([
                yScaleRange0 + rotateLabelOffset,
                yScaleRange1,
            ]);
        }
    }
    const ox = ixNum.map((x) => xScale(x));
    return {
        ix,
        y,
        isNumericalData,
        ox,
        xScale,
        xTicksNormalized,
        // conform to type NonEmptyArray<T>
        yAxes: [yAxesTransformed[0], ...yAxesTransformed.slice(1)],
    };
};
exports.transformInputData = transformInputData;
