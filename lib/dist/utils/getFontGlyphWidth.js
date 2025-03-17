"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFontGlyphWidth = void 0;
const getFontGlyphWidth = (text, font) => {
    var _a;
    return (_a = font === null || font === void 0 ? void 0 : font.getGlyphWidths(font.getGlyphIDs(text)).reduce((sum, value) => sum + value, 0)) !== null && _a !== void 0 ? _a : 0;
};
exports.getFontGlyphWidth = getFontGlyphWidth;
