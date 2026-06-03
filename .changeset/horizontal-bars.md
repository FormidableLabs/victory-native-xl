---
"victory-native": minor
---

Add horizontal Cartesian bar chart support through `CartesianChart orientation="horizontal"` and the new `HorizontalBar` and `HorizontalBarGroup` components.

Horizontal chart axis formatter types now match the runtime axis roles: `xAxis.formatXLabel` receives numeric value ticks, while `yAxis.formatYLabel` receives `xKey` category values.
