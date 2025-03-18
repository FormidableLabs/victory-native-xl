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
exports.Bar = void 0;
const React = __importStar(require("react"));
const react_native_skia_1 = require("@shopify/react-native-skia");
const AnimatedPath_1 = require("./AnimatedPath");
const useBarPath_1 = require("../hooks/useBarPath");
const BarGraphLabels_1 = require("./BarGraphLabels");
const BarGraph = (props) => {
    const { options } = props, pathProps = __rest(props, ["options"]);
    const PathComponent = pathProps.animate ? AnimatedPath_1.AnimatedPath : react_native_skia_1.Path;
    return <PathComponent style="fill" {...pathProps} {...options}/>;
};
const Bar = (_a) => {
    var { points, chartBounds, animate, innerPadding = 0.25, roundedCorners, barWidth, barCount, labels } = _a, ops = __rest(_a, ["points", "chartBounds", "animate", "innerPadding", "roundedCorners", "barWidth", "barCount", "labels"]);
    const { path, barWidth: bw } = (0, useBarPath_1.useBarPath)(points, chartBounds, innerPadding, roundedCorners, barWidth, barCount);
    return (<>
      {labels && (<BarGraphLabels_1.BarGraphLabels points={points} chartBounds={chartBounds} barWidth={barWidth !== null && barWidth !== void 0 ? barWidth : bw} options={labels}/>)}
      <BarGraph path={path} animate={animate} options={ops}/>
    </>);
};
exports.Bar = Bar;
