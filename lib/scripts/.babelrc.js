module.exports = {
  presets: [["@babel/preset-env", { modules: false }]],
  plugins: [workletIfy],
};

function workletIfy({ types: t }) {
  return {
    visitor: {
      "FunctionDeclaration|ArrowFunctionExpression"(path) {
        const body = path.get("body");
        if (t.isBlockStatement(body)) {
          body.unshiftContainer(
            "directives",
            t.directive(t.directiveLiteral("worklet")),
          );
        } else {
          body.replaceWith(
            t.blockStatement(
              [t.returnStatement(body.node)],
              [t.directive(t.directiveLiteral("worklet"))],
            ),
          );
        }
      },

      ImportDeclaration(path, state) {
        const src = path.node.source.value;
        if (src.startsWith(".")) return;

        const fn = state.file.opts.filename;
        const relFn = fn.substring(fn.indexOf("src/") + 4);
        const levels = relFn.split("/").length;

        path.node.source.value =
          Array.from({ length: levels }).fill("..").join("/") + "/" + src;
      },
    },
  };
}
