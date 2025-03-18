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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scatter = Scatter;
const React = __importStar(require("react"));
const react_native_skia_1 = require("@shopify/react-native-skia");
const AnimatedPath_1 = require("./AnimatedPath");
function Scatter(_a) {
    var { points, animate, radius = 10, shape = "circle" } = _a, rest = __rest(_a, ["points", "animate", "radius", "shape"]);
    const path = React.useMemo(() => {
        const p = react_native_skia_1.Skia.Path.Make();
        points.forEach((pt) => {
            const { x, y } = pt;
            if (typeof y !== "number")
                return;
            const r = typeof radius === "function" ? radius(pt) : radius;
            if (shape === "circle")
                p.addCircle(x, y, r);
            else if (shape === "square")
                p.addRect(react_native_skia_1.Skia.XYWHRect(x - r, y - r, r * 2, r * 2));
            else if (shape === "star")
                p.addPath(calculateStarPath(x, y, r, 5));
        });
        return p;
    }, [points, radius, shape]);
    return React.createElement(animate ? AnimatedPath_1.AnimatedPath : react_native_skia_1.Path, Object.assign(Object.assign({ path }, rest), (Boolean(animate) && { animate })));
}
const calculateStarPath = (centerX, centerY, radius, points) => {
    const vectors = [];
    for (let i = 0; i <= 2 * points; i++) {
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (i % 2 === 0 ? radius : radius / 2);
        const y = centerY + Math.sin(angle) * (i % 2 === 0 ? radius : radius / 2);
        vectors.unshift([x, y]);
    }
    const path = react_native_skia_1.Skia.Path.Make();
    const firstVec = vectors[0];
    firstVec && path.moveTo(firstVec[0], firstVec[1]);
    for (const vec of vectors.slice(1)) {
        path.lineTo(vec[0], vec[1]);
    }
    path.close();
    return path;
};
