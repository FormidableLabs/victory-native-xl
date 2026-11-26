const path = require("path");
const React = require("react");

const skiaRoot = path.join(
  __dirname,
  "../../../../node_modules/react-native-skia/lib/commonjs",
);

const components = require(path.join(skiaRoot, "renderer/components/index.js"));
const { FillType } = require(path.join(skiaRoot, "skia/types/Path/Path.js"));
const { PaintStyle } = require(
  path.join(skiaRoot, "skia/types/Paint/Paint.js"),
);
const matrix4 = require(path.join(skiaRoot, "skia/types/Matrix4.js"));

const { SkiaSGRoot } = require(path.join(skiaRoot, "sksg/Reconciler.js"));

/**
 * Stands in for the real `Canvas`, which needs a native view. Like the real
 * one, it renders its children with Skia's own React renderer, so React
 * context does not flow from the tree that renders the `Canvas` into its
 * children.
 */
const Canvas = ({ children }) => {
  const root = React.useMemo(() => new SkiaSGRoot(global.SkiaApi), []);

  React.useLayoutEffect(() => {
    root.render(children);
  }, [children, root]);

  React.useEffect(
    () => () => {
      root.unmount();
    },
    [root],
  );

  return null;
};

const vec = (x = 0, y) => global.SkiaApi.Point(x, y ?? x);
const rect = (x, y, width, height) =>
  global.SkiaApi.XYWHRect(x, y, width, height);

module.exports = {
  ...components,
  ...matrix4,
  Canvas,
  FillType,
  PaintStyle,
  vec,
  point: vec,
  rect,
  get Skia() {
    return global.SkiaApi;
  },
};
