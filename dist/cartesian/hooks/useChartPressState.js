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
exports.useChartPressState = void 0;
const React = __importStar(require("react"));
const react_native_reanimated_1 = require("react-native-reanimated");
const useChartPressState = (initialValues) => {
    const keys = Object.keys(initialValues.y).join(",");
    const state = React.useMemo(() => {
        return {
            isActive: (0, react_native_reanimated_1.makeMutable)(false),
            matchedIndex: (0, react_native_reanimated_1.makeMutable)(-1),
            x: { value: (0, react_native_reanimated_1.makeMutable)(initialValues.x), position: (0, react_native_reanimated_1.makeMutable)(0) },
            y: Object.entries(initialValues.y).reduce((acc, [key, initVal]) => {
                acc[key] = {
                    value: (0, react_native_reanimated_1.makeMutable)(initVal),
                    position: (0, react_native_reanimated_1.makeMutable)(0),
                };
                return acc;
            }, {}),
            yIndex: (0, react_native_reanimated_1.makeMutable)(-1), // used for stacked bar charts
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keys]);
    const isActive = useIsPressActive(state);
    return { state, isActive };
};
exports.useChartPressState = useChartPressState;
const useIsPressActive = (value) => {
    const [isPressActive, setIsPressActive] = React.useState(() => value.isActive.value);
    (0, react_native_reanimated_1.useAnimatedReaction)(() => value.isActive.value, (val, oldVal) => {
        if (val !== oldVal)
            (0, react_native_reanimated_1.runOnJS)(setIsPressActive)(val);
    });
    return isPressActive;
};
