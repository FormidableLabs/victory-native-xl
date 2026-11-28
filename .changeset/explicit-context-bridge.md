---
"victory-native": major
---

Charts no longer forward every React context of your app into the Skia canvas. `CartesianChart` and `PolarChart` used `its-fine` to do so, which subscribed each chart to every context above it: any change to any of them rendered the chart's canvas again, whether or not the chart read that context.

The chart's own contexts (`useCartesianChartContext`, `useCartesianTransformContext`, the polar and pie contexts) work as before. To read one of your own contexts in a component rendered inside a chart, list it in the new `contexts` prop:

```tsx
<CartesianChart contexts={[ThemeContext]} {...props}>
  {({ points }) => <ThemedLine points={points.y} />}
</CartesianChart>
```

Without it, `useContext(ThemeContext)` inside the chart now returns the default value of the context. Headless charts are not affected. The `its-fine` dependency, and the global `console.error` wrapper it installed, are gone.
