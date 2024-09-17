"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformInputData = void 0;
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
const transformInputData = ({ data: _data, xKey, yKeys, outputWindow, axisOptions, domain, domainPadding, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    const data = [..._data];
    const tickValues = axisOptions === null || axisOptions === void 0 ? void 0 : axisOptions.tickValues;
    const tickCount = (_a = axisOptions === null || axisOptions === void 0 ? void 0 : axisOptions.tickCount) !== null && _a !== void 0 ? _a : tickHelpers_1.DEFAULT_TICK_COUNT;
    const xTickValues = tickValues && typeof tickValues === "object" && "x" in tickValues
        ? tickValues.x
        : tickValues;
    const yTickValues = tickValues && typeof tickValues === "object" && "y" in tickValues
        ? tickValues.y
        : tickValues;
    const xTicks = typeof tickCount === "number" ? tickCount : tickCount.x;
    const yTicks = typeof tickCount === "number" ? tickCount : tickCount.y;
    const tickDomainsX = (0, tickHelpers_1.getDomainFromTicks)(xTickValues);
    const tickDomainsY = (0, tickHelpers_1.getDomainFromTicks)(yTickValues);
    const isNumericalData = data.every((datum) => typeof datum[xKey] === "number");
    if (isNumericalData) {
        data.sort((a, b) => +a[xKey] - +b[xKey]);
    }
    // Input x is just extracting the xKey from each datum
    const ix = data.map((datum) => datum[xKey]);
    const ixNum = ix.map((val, i) => (isNumericalData ? val : i));
    // If user provides a domain, use that as our min / max
    // Else if, tickValues are provided, we use that instead
    // Else, we find min / max of y values across all yKeys, and use that for y range instead.
    const yMin = (_d = (_c = (_b = domain === null || domain === void 0 ? void 0 : domain.y) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : tickDomainsY === null || tickDomainsY === void 0 ? void 0 : tickDomainsY[0]) !== null && _d !== void 0 ? _d : Math.min(...yKeys.map((key) => {
        return data.reduce((min, curr) => {
            if (typeof curr[key] !== "number")
                return min;
            return Math.min(min, curr[key]);
        }, Infinity);
    }));
    const yMax = (_g = (_f = (_e = domain === null || domain === void 0 ? void 0 : domain.y) === null || _e === void 0 ? void 0 : _e[1]) !== null && _f !== void 0 ? _f : tickDomainsY === null || tickDomainsY === void 0 ? void 0 : tickDomainsY[1]) !== null && _g !== void 0 ? _g : Math.max(...yKeys.map((key) => {
        return data.reduce((max, curr) => {
            if (typeof curr[key] !== "number")
                return max;
            return Math.max(max, curr[key]);
        }, -Infinity);
    }));
    // Set up our y-output data structure
    const y = yKeys.reduce((acc, k) => {
        acc[k] = { i: [], o: [] };
        return acc;
    }, {});
    // Set up our y-scale, notice how domain is "flipped" because
    //  we're moving from cartesian to canvas coordinates
    // Also, if single data point, manually add upper & lower bounds so chart renders properly
    const yScaleDomain = (yMax === yMin ? [yMax + 1, yMin - 1] : [yMax, yMin]);
    const fontHeight = (_k = (_j = (_h = axisOptions === null || axisOptions === void 0 ? void 0 : axisOptions.font) === null || _h === void 0 ? void 0 : _h.getSize) === null || _j === void 0 ? void 0 : _j.call(_h)) !== null && _k !== void 0 ? _k : 0;
    // Our yScaleRange is impacted by our grid options
    const yScaleRange = (() => {
        var _a, _b, _c, _d, _e, _f;
        const xTickCount = (_b = (typeof (axisOptions === null || axisOptions === void 0 ? void 0 : axisOptions.tickCount) === "number"
            ? axisOptions === null || axisOptions === void 0 ? void 0 : axisOptions.tickCount
            : (_a = axisOptions === null || axisOptions === void 0 ? void 0 : axisOptions.tickCount) === null || _a === void 0 ? void 0 : _a.x)) !== null && _b !== void 0 ? _b : 0;
        const yLabelPosition = typeof (axisOptions === null || axisOptions === void 0 ? void 0 : axisOptions.labelPosition) === "string"
            ? axisOptions.labelPosition
            : (_c = axisOptions === null || axisOptions === void 0 ? void 0 : axisOptions.labelPosition) === null || _c === void 0 ? void 0 : _c.x;
        const xAxisSide = (_d = axisOptions === null || axisOptions === void 0 ? void 0 : axisOptions.axisSide) === null || _d === void 0 ? void 0 : _d.x;
        const yLabelOffset = (_f = (typeof (axisOptions === null || axisOptions === void 0 ? void 0 : axisOptions.labelOffset) === "number"
            ? axisOptions.labelOffset
            : (_e = axisOptions === null || axisOptions === void 0 ? void 0 : axisOptions.labelOffset) === null || _e === void 0 ? void 0 : _e.y)) !== null && _f !== void 0 ? _f : 0;
        // bottom, outset
        if (xAxisSide === "bottom" && yLabelPosition === "outset") {
            return [
                outputWindow.yMin,
                outputWindow.yMax +
                    (xTickCount > 0 ? -fontHeight - yLabelOffset * 2 : 0),
            ];
        }
        // Top outset
        if (xAxisSide === "top" && yLabelPosition === "outset") {
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
        isNice: true,
        padEnd: typeof domainPadding === "number" ? domainPadding : domainPadding === null || domainPadding === void 0 ? void 0 : domainPadding.bottom,
        padStart: typeof domainPadding === "number" ? domainPadding : domainPadding === null || domainPadding === void 0 ? void 0 : domainPadding.top,
    });
    yKeys.forEach((yKey) => {
        y[yKey].i = data.map((datum) => datum[yKey]);
        y[yKey].o = data.map((datum) => (typeof datum[yKey] === "number"
            ? yScale(datum[yKey])
            : datum[yKey]));
    });
    // Normalize yTicks values either via the d3 scaleLinear ticks() function or our custom downSample function
    // Awkward doing this in the transformInputData function but must be done due to x-scale needing this data
    const yTicksNormalized = yTickValues
        ? (0, tickHelpers_1.downsampleTicks)(yTickValues, yTicks)
        : yScale.ticks(yTicks);
    // Calculate all yTicks we're displaying, so we can properly compensate for it in our x-scale
    const maxYLabel = Math.max(...yTicksNormalized.map((yTick) => {
        var _a, _b, _c, _d;
        return (_d = (_b = (_a = axisOptions === null || axisOptions === void 0 ? void 0 : axisOptions.font) === null || _a === void 0 ? void 0 : _a.getGlyphWidths) === null || _b === void 0 ? void 0 : _b.call(_a, axisOptions.font.getGlyphIDs(((_c = axisOptions === null || axisOptions === void 0 ? void 0 : axisOptions.formatYLabel) === null || _c === void 0 ? void 0 : _c.call(axisOptions, yTick)) ||
            String(yTick))).reduce((sum, value) => sum + value, 0)) !== null && _d !== void 0 ? _d : 0;
    }));
    // Generate our x-scale
    // If user provides a domain, use that as our min / max
    // Else if, tickValues are provided, we use that instead
    // Else, we find min / max of y values across all yKeys, and use that for y range instead.
    const ixMin = (0, asNumber_1.asNumber)((_o = (_m = (_l = domain === null || domain === void 0 ? void 0 : domain.x) === null || _l === void 0 ? void 0 : _l[0]) !== null && _m !== void 0 ? _m : tickDomainsX === null || tickDomainsX === void 0 ? void 0 : tickDomainsX[0]) !== null && _o !== void 0 ? _o : ixNum.at(0)), ixMax = (0, asNumber_1.asNumber)((_r = (_q = (_p = domain === null || domain === void 0 ? void 0 : domain.x) === null || _p === void 0 ? void 0 : _p[1]) !== null && _q !== void 0 ? _q : tickDomainsX === null || tickDomainsX === void 0 ? void 0 : tickDomainsX[1]) !== null && _r !== void 0 ? _r : ixNum.at(-1));
    const topYLabelWidth = maxYLabel;
    // Determine our x-output range based on yAxis/label options
    const oRange = (() => {
        var _a, _b, _c, _d, _e, _f;
        const yTickCount = (_b = (typeof (axisOptions === null || axisOptions === void 0 ? void 0 : axisOptions.tickCount) === "number"
            ? axisOptions === null || axisOptions === void 0 ? void 0 : axisOptions.tickCount
            : (_a = axisOptions === null || axisOptions === void 0 ? void 0 : axisOptions.tickCount) === null || _a === void 0 ? void 0 : _a.y)) !== null && _b !== void 0 ? _b : 0;
        const yLabelPosition = typeof (axisOptions === null || axisOptions === void 0 ? void 0 : axisOptions.labelPosition) === "string"
            ? axisOptions.labelPosition
            : (_c = axisOptions === null || axisOptions === void 0 ? void 0 : axisOptions.labelPosition) === null || _c === void 0 ? void 0 : _c.y;
        const yAxisSide = (_d = axisOptions === null || axisOptions === void 0 ? void 0 : axisOptions.axisSide) === null || _d === void 0 ? void 0 : _d.y;
        const yLabelOffset = (_f = (typeof (axisOptions === null || axisOptions === void 0 ? void 0 : axisOptions.labelOffset) === "number"
            ? axisOptions.labelOffset
            : (_e = axisOptions === null || axisOptions === void 0 ? void 0 : axisOptions.labelOffset) === null || _e === void 0 ? void 0 : _e.y)) !== null && _f !== void 0 ? _f : 0;
        // Left axes, outset label
        if (yAxisSide === "left" && yLabelPosition === "outset") {
            return [
                outputWindow.xMin +
                    (yTickCount > 0 ? topYLabelWidth + yLabelOffset : 0),
                outputWindow.xMax,
            ];
        }
        // Right axes, outset label
        if (yAxisSide === "right" && yLabelPosition === "outset") {
            return [
                outputWindow.xMin,
                outputWindow.xMax +
                    (yTickCount > 0 ? -topYLabelWidth - yLabelOffset : 0),
            ];
        }
        // Inset labels don't need added offsets
        return [outputWindow.xMin, outputWindow.xMax];
    })();
    const xScale = (0, makeScale_1.makeScale)({
        // if single data point, manually add upper & lower bounds so chart renders properly
        inputBounds: ixMin === ixMax ? [ixMin - 1, ixMax + 1] : [ixMin, ixMax],
        outputBounds: oRange,
        padStart: typeof domainPadding === "number" ? domainPadding : domainPadding === null || domainPadding === void 0 ? void 0 : domainPadding.left,
        padEnd: typeof domainPadding === "number" ? domainPadding : domainPadding === null || domainPadding === void 0 ? void 0 : domainPadding.right,
    });
    // Normalize xTicks values either via the d3 scaleLinear ticks() function or our custom downSample function
    // For consistency we do it here, so we have both y and x ticks to pass to the axis generator
    const xTicksNormalized = xTickValues
        ? (0, tickHelpers_1.downsampleTicks)(xTickValues, xTicks)
        : xScale.ticks(xTicks);
    const ox = ixNum.map((x) => xScale(x));
    return {
        ix,
        ox,
        y,
        xScale,
        yScale,
        isNumericalData,
        xTicksNormalized,
        yTicksNormalized,
    };
};
exports.transformInputData = transformInputData;
