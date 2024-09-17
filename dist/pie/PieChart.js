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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PieChart = void 0;
const React = __importStar(require("react"));
const react_native_skia_1 = require("@shopify/react-native-skia");
const PieSlice_1 = require("./PieSlice");
const innerRadius_1 = require("./utils/innerRadius");
const PieSliceContext_1 = require("./contexts/PieSliceContext");
const PolarChartContext_1 = require("../polar/contexts/PolarChartContext");
const CIRCLE_SWEEP_DEGREES = 360;
const PieChart = (props) => {
    const { innerRadius = 0, circleSweepDegrees = CIRCLE_SWEEP_DEGREES, startAngle: _startAngle = 0, children, } = props;
    const { canvasSize, data: _data, labelKey, valueKey, colorKey, } = (0, PolarChartContext_1.usePolarChartContext)();
    // The sum all the slices' values
    const totalCircleValue = _data.reduce((sum, entry) => sum + Number(entry[valueKey]), 0);
    const { width, height } = canvasSize; // Get the dynamic canvas size
    const radius = Math.min(width, height) / 2; // Calculate the radius based on canvas size
    const center = (0, react_native_skia_1.vec)(width / 2, height / 2);
    const data = React.useMemo(() => {
        let startAngle = _startAngle; // Initialize the start angle for the first slice
        const enhanced = _data.map((datum) => {
            const sliceValue = datum[valueKey];
            const sliceLabel = datum[labelKey];
            const sliceColor = datum[colorKey];
            const initialStartAngle = startAngle; // grab the initial start angle
            const sweepAngle = (sliceValue / totalCircleValue) * circleSweepDegrees; // Calculate the sweep angle for the slice as a part of the entire pie
            const endAngle = initialStartAngle + sweepAngle; // the sum of sweep + start
            startAngle += sweepAngle; // the next startAngle is the accumulation of each sweep
            return {
                value: sliceValue,
                label: sliceLabel,
                color: sliceColor,
                innerRadius: (0, innerRadius_1.handleTranslateInnerRadius)(innerRadius, radius),
                startAngle: initialStartAngle,
                endAngle: endAngle,
                sweepAngle,
                sliceIsEntireCircle: sweepAngle === CIRCLE_SWEEP_DEGREES || _data.length === 1,
                radius,
                center,
            };
        });
        return enhanced;
    }, [
        valueKey,
        _data,
        totalCircleValue,
        colorKey,
        labelKey,
        radius,
        center,
        innerRadius,
        circleSweepDegrees,
        _startAngle,
    ]);
    return data.map((slice, index) => {
        return (<PieSliceContext_1.PieSliceProvider key={index} slice={slice}>
        {children ? children({ slice }) : <PieSlice_1.PieSlice />}
      </PieSliceContext_1.PieSliceProvider>);
    });
};
exports.PieChart = PieChart;
