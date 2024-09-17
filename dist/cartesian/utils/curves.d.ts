/**
 * Exposed curves from d3-shape.
 */
export declare const CURVES: {
    readonly linear: import("d3-shape").CurveFactory;
    readonly natural: import("d3-shape").CurveFactory;
    readonly bumpX: import("d3-shape").CurveFactory;
    readonly bumpY: import("d3-shape").CurveFactory;
    readonly cardinal: import("d3-shape").CurveCardinalFactory;
    readonly cardinal50: import("d3-shape").CurveCardinalFactory;
    readonly catmullRom: import("d3-shape").CurveCatmullRomFactory;
    readonly catmullRom0: import("d3-shape").CurveCatmullRomFactory;
    readonly catmullRom100: import("d3-shape").CurveCatmullRomFactory;
    readonly monotoneX: import("d3-shape").CurveFactory;
    readonly step: import("d3-shape").CurveFactory;
};
export type CurveType = keyof typeof CURVES;
