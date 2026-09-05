---
"victory-native": minor
---

Add time scale support to the Cartesian x axis. When every `xKey` value is a `Date`, the axis is treated as a time scale: points are positioned by elapsed time rather than by index, x ticks land on calendar boundaries via `d3-scale`'s `scaleTime`, and `formatXLabel` receives a `Date`. Data with mixed or non-`Date` x values keeps its existing numerical or categorical behavior.
