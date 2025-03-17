"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pie = void 0;
const PieChart_1 = require("./PieChart");
const PieLabel_1 = __importDefault(require("./PieLabel"));
const PieSlice_1 = require("./PieSlice");
const PieSliceAngularInset_1 = require("./PieSliceAngularInset");
const Pie = {
    Chart: PieChart_1.PieChart,
    Slice: PieSlice_1.PieSlice,
    Label: PieLabel_1.default,
    SliceAngularInset: PieSliceAngularInset_1.PieSliceAngularInset,
};
exports.Pie = Pie;
