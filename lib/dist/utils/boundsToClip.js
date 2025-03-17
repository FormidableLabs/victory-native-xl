"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.boundsToClip = void 0;
const react_native_skia_1 = require("@shopify/react-native-skia");
const boundsToClip = (bounds) => (0, react_native_skia_1.rect)(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top);
exports.boundsToClip = boundsToClip;
