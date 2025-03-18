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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartAxis = useChartAxis;
const React = __importStar(require("react"));
const d3_zoom_1 = require("d3-zoom");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const useFunctionRef_1 = require("../hooks/useFunctionRef");
const XAxisScroll_1 = require("./components/XAxisScroll");
const YAxis_1 = require("./components/YAxis");
const useBuildChartAxis_1 = require("./hooks/useBuildChartAxis");
const CartesianTransformContext_1 = require("./contexts/CartesianTransformContext");
const tickHelpers_1 = require("../utils/tickHelpers");
const normalizeYAxisTicks_1 = require("../utils/normalizeYAxisTicks");
function useChartAxis({ yKeys, axisOptions, onScaleChange, xAxis, yAxis, frame, xScale, primaryYScale, chartBounds, yAxes, isNumericalData, _tData, hasMeasuredLayoutSize, scrollX, ignoreClip, }) {
    var _a;
    const xScaleRef = React.useRef(undefined);
    const yScaleRef = React.useRef(undefined);
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
    const YAxisComponents = hasMeasuredLayoutSize && (axisOptions || yAxes)
        ? (_a = normalizedAxisProps.yAxes) === null || _a === void 0 ? void 0 : _a.map((axis, index) => {
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
    const XAxisComponents = hasMeasuredLayoutSize && (axisOptions || xAxis) ? (<XAxisScroll_1.XAxis {...normalizedAxisProps.xAxis} scrollX={scrollX} xScale={xScale} yScale={zoomY.rescaleY(primaryYScale)} ix={_tData.ix} isNumericalData={isNumericalData} chartBounds={chartBounds} zoom={zoomX} ignoreClip={ignoreClip}/>) : null;
    // Memoize the body content
    const chartBody = React.useMemo(() => {
        return {
            YAxisComponents,
            XAxisComponents,
        };
    }, [YAxisComponents, XAxisComponents]);
    return chartBody;
}
