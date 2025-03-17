"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_skia_1 = require("@shopify/react-native-skia");
const react_1 = __importDefault(require("react"));
const PieSliceContext_1 = require("./contexts/PieSliceContext");
const getFontGlyphWidth_1 = require("../utils/getFontGlyphWidth");
const PieLabel = ({ font, radiusOffset = 0.5, color = "white", text, children, }) => {
    const { slice } = (0, PieSliceContext_1.usePieSliceContext)();
    const labelText = text !== null && text !== void 0 ? text : slice.label;
    const labelWidth = (0, getFontGlyphWidth_1.getFontGlyphWidth)(labelText, font);
    const RADIAN = Math.PI / 180;
    // Offset from the slice radius to help position the label
    const radius = slice.radius * radiusOffset;
    // Middle angle of the slice
    const midAngle = (slice.startAngle + slice.endAngle) / 2;
    // Center coordinates of slice
    const x = slice.center.x + radius * Math.cos(-midAngle * RADIAN);
    const y = slice.center.y + radius * Math.sin(midAngle * RADIAN);
    if (children)
        return children({ x, y, midAngle });
    return (font && (<react_native_skia_1.Text font={font} text={labelText} x={x - labelWidth / 2} y={y} color={color}/>));
};
exports.default = PieLabel;
