"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CURVES = void 0;
const d3_shape_1 = require("d3-shape");
/**
 * Exposed curves from d3-shape.
 */
exports.CURVES = {
    linear: d3_shape_1.curveLinear,
    natural: d3_shape_1.curveNatural,
    bumpX: d3_shape_1.curveBumpX,
    bumpY: d3_shape_1.curveBumpY,
    cardinal: d3_shape_1.curveCardinal,
    cardinal50: d3_shape_1.curveCardinal.tension(0.5),
    catmullRom: d3_shape_1.curveCatmullRom,
    catmullRom0: d3_shape_1.curveCatmullRom.alpha(0),
    catmullRom100: d3_shape_1.curveCatmullRom.alpha(1),
    monotoneX: d3_shape_1.curveMonotoneX,
    step: d3_shape_1.curveStep,
};
