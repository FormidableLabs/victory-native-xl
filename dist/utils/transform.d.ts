import { Matrix4 } from "@shopify/react-native-skia";
export declare const identity4: Matrix4;
export declare const getTransformComponents: (m: Matrix4 | undefined) => {
    scaleX: number;
    scaleY: number;
    translateX: number;
    translateY: number;
};
export declare const setScale: (matrix: Matrix4, kx: number, ky?: number) => Matrix4;
export declare const setTranslate: (matrix: Matrix4, tx: number, ty: number) => Matrix4;
/** taken from https://github.com/Shopify/react-native-skia/blob/main/packages/skia/src/skia/types/Matrix4.ts#L402 which was very recently added.
 *  This is a temporary workaround until the new version of react-native-skia is released and widely used.
 */
export declare const invert4: (m: Matrix4) => Matrix4;
