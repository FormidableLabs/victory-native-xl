"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartTransformState = void 0;
const react_native_reanimated_1 = require("react-native-reanimated");
const react_native_skia_1 = require("@shopify/react-native-skia");
const react_1 = require("react");
const transform_1 = require("../../utils/transform");
const useChartTransformState = (config) => {
    const origin = (0, react_native_reanimated_1.useSharedValue)({ x: 0, y: 0 });
    const matrix = (0, react_native_reanimated_1.useSharedValue)(transform_1.identity4);
    const offset = (0, react_native_reanimated_1.useSharedValue)(transform_1.identity4);
    // This is done in a useEffect to prevent Reanimated warning
    // about setting shared value in the render phase
    (0, react_1.useEffect)(() => {
        var _a, _b;
        matrix.value = (0, react_native_skia_1.scale)((_a = config === null || config === void 0 ? void 0 : config.scaleX) !== null && _a !== void 0 ? _a : 1, (_b = config === null || config === void 0 ? void 0 : config.scaleY) !== null && _b !== void 0 ? _b : 1);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return {
        state: {
            panActive: (0, react_native_reanimated_1.makeMutable)(false),
            zoomActive: (0, react_native_reanimated_1.makeMutable)(false),
            origin,
            matrix,
            offset,
        },
    };
};
exports.useChartTransformState = useChartTransformState;
