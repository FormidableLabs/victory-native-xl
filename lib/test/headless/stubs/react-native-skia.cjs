const path = require("path");

const skiaRoot = path.join(
  __dirname,
  "../../../../node_modules/@shopify/react-native-skia/lib/commonjs",
);

const components = require(path.join(
  skiaRoot,
  "renderer/components/index.js",
));
const { FillType } = require(path.join(skiaRoot, "skia/types/Path/Path.js"));
const { PaintStyle } = require(path.join(
  skiaRoot,
  "skia/types/Paint/Paint.js",
));
const matrix4 = require(path.join(skiaRoot, "skia/types/Matrix4.js"));

const vec = (x = 0, y) => global.SkiaApi.Point(x, y ?? x);
const rect = (x, y, width, height) =>
  global.SkiaApi.XYWHRect(x, y, width, height);

module.exports = {
  ...components,
  ...matrix4,
  FillType,
  PaintStyle,
  vec,
  point: vec,
  rect,
  get Skia() {
    return global.SkiaApi;
  },
};
