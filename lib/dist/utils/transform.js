"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invert4 = exports.setTranslate = exports.setScale = exports.getTransformComponents = exports.identity4 = void 0;
const react_native_skia_1 = require("@shopify/react-native-skia");
exports.identity4 = [
    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
];
var MatrixValues;
(function (MatrixValues) {
    MatrixValues[MatrixValues["ScaleX"] = 0] = "ScaleX";
    MatrixValues[MatrixValues["ScaleY"] = 5] = "ScaleY";
    MatrixValues[MatrixValues["TranslateX"] = 3] = "TranslateX";
    MatrixValues[MatrixValues["TranslateY"] = 7] = "TranslateY";
})(MatrixValues || (MatrixValues = {}));
const getTransformComponents = (m) => {
    "worklet";
    return {
        scaleX: (m === null || m === void 0 ? void 0 : m[MatrixValues.ScaleX]) || 1,
        scaleY: (m === null || m === void 0 ? void 0 : m[MatrixValues.ScaleY]) || 1,
        translateX: (m === null || m === void 0 ? void 0 : m[MatrixValues.TranslateX]) || 0,
        translateY: (m === null || m === void 0 ? void 0 : m[MatrixValues.TranslateY]) || 0,
    };
};
exports.getTransformComponents = getTransformComponents;
const setScale = (matrix, kx, ky) => {
    "worklet";
    const m = matrix.slice(0);
    m[MatrixValues.ScaleX] = kx;
    m[MatrixValues.ScaleY] = ky !== null && ky !== void 0 ? ky : kx;
    return m;
};
exports.setScale = setScale;
const setTranslate = (matrix, tx, ty) => {
    "worklet";
    const m = matrix.slice(0);
    m[MatrixValues.TranslateX] = tx;
    m[MatrixValues.TranslateY] = ty;
    return m;
};
exports.setTranslate = setTranslate;
/** taken from https://github.com/Shopify/react-native-skia/blob/main/packages/skia/src/skia/types/Matrix4.ts#L378 which was very recently added.
 *  This is a temporary workaround until the new version of react-native-skia is released and widely used.
 */
const det3x3 = (a00, a01, a02, a10, a11, a12, a20, a21, a22) => {
    "worklet";
    return (a00 * (a11 * a22 - a12 * a21) +
        a01 * (a12 * a20 - a10 * a22) +
        a02 * (a10 * a21 - a11 * a20));
};
/** taken from https://github.com/Shopify/react-native-skia/blob/main/packages/skia/src/skia/types/Matrix4.ts#L402 which was very recently added.
 *  This is a temporary workaround until the new version of react-native-skia is released and widely used.
 */
const invert4 = (m) => {
    "worklet";
    const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
    const a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
    const a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
    const a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];
    // Calculate cofactors
    const b00 = det3x3(a11, a12, a13, a21, a22, a23, a31, a32, a33);
    const b01 = -det3x3(a10, a12, a13, a20, a22, a23, a30, a32, a33);
    const b02 = det3x3(a10, a11, a13, a20, a21, a23, a30, a31, a33);
    const b03 = -det3x3(a10, a11, a12, a20, a21, a22, a30, a31, a32);
    const b10 = -det3x3(a01, a02, a03, a21, a22, a23, a31, a32, a33);
    const b11 = det3x3(a00, a02, a03, a20, a22, a23, a30, a32, a33);
    const b12 = -det3x3(a00, a01, a03, a20, a21, a23, a30, a31, a33);
    const b13 = det3x3(a00, a01, a02, a20, a21, a22, a30, a31, a32);
    const b20 = det3x3(a01, a02, a03, a11, a12, a13, a31, a32, a33);
    const b21 = -det3x3(a00, a02, a03, a10, a12, a13, a30, a32, a33);
    const b22 = det3x3(a00, a01, a03, a10, a11, a13, a30, a31, a33);
    const b23 = -det3x3(a00, a01, a02, a10, a11, a12, a30, a31, a32);
    const b30 = -det3x3(a01, a02, a03, a11, a12, a13, a21, a22, a23);
    const b31 = det3x3(a00, a02, a03, a10, a12, a13, a20, a22, a23);
    const b32 = -det3x3(a00, a01, a03, a10, a11, a13, a20, a21, a23);
    const b33 = det3x3(a00, a01, a02, a10, a11, a12, a20, a21, a22);
    // Calculate determinant
    const det = a00 * b00 + a01 * b01 + a02 * b02 + a03 * b03;
    // Check if matrix is invertible
    if (Math.abs(det) < 1e-8) {
        // Return identity matrix if not invertible
        return (0, react_native_skia_1.Matrix4)();
    }
    const invDet = 1.0 / det;
    // Calculate inverse matrix
    return [
        b00 * invDet,
        b10 * invDet,
        b20 * invDet,
        b30 * invDet,
        b01 * invDet,
        b11 * invDet,
        b21 * invDet,
        b31 * invDet,
        b02 * invDet,
        b12 * invDet,
        b22 * invDet,
        b32 * invDet,
        b03 * invDet,
        b13 * invDet,
        b23 * invDet,
        b33 * invDet,
    ];
};
exports.invert4 = invert4;
