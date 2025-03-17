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
exports.useCartesianTransformContext = exports.CartesianTransformProvider = void 0;
const react_1 = __importStar(require("react"));
const react_native_reanimated_1 = require("react-native-reanimated");
const transform_1 = require("../../utils/transform");
const CartesianTransformContext = (0, react_1.createContext)(undefined);
const CartesianTransformProvider = ({ transformState, children }) => {
    const [transform, setTransform] = (0, react_1.useState)(() => {
        const components = (0, transform_1.getTransformComponents)(undefined);
        return {
            k: components.scaleX,
            kx: components.scaleX,
            ky: components.scaleY,
            tx: components.translateX,
            ty: components.translateY,
        };
    });
    // This is done in a useEffect to prevent Reanimated warning
    // about setting shared value in the render phase
    (0, react_1.useEffect)(() => {
        if (transformState) {
            setTransform(() => {
                const components = (0, transform_1.getTransformComponents)(transformState.matrix.value);
                return {
                    k: components.scaleX,
                    kx: components.scaleX,
                    ky: components.scaleY,
                    tx: components.translateX,
                    ty: components.translateY,
                };
            });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    (0, react_native_reanimated_1.useAnimatedReaction)(() => {
        return (0, transform_1.getTransformComponents)(transformState === null || transformState === void 0 ? void 0 : transformState.matrix.value);
    }, (cv, pv) => {
        if (cv.scaleX !== (pv === null || pv === void 0 ? void 0 : pv.scaleX) || cv.scaleY !== pv.scaleY || cv.translateX !== pv.translateX || cv.translateY !== pv.translateY) {
            (0, react_native_reanimated_1.runOnJS)(setTransform)({
                k: cv.scaleX,
                kx: cv.scaleX,
                ky: cv.scaleY,
                tx: cv.translateX,
                ty: cv.translateY,
            });
        }
    });
    return <CartesianTransformContext.Provider value={Object.assign({}, transform)}>{children}</CartesianTransformContext.Provider>;
};
exports.CartesianTransformProvider = CartesianTransformProvider;
const useCartesianTransformContext = () => {
    const context = (0, react_1.useContext)(CartesianTransformContext);
    if (context === undefined) {
        throw new Error("useCartesianTransformContext must be used within a CartesianTransformProvider");
    }
    return context;
};
exports.useCartesianTransformContext = useCartesianTransformContext;
