# Bar Charts Overview

Victory Native includes vertical and horizontal bar marks for single-series, grouped, and stacked Cartesian bar charts.

## Components

| Chart shape | Vertical component | Horizontal component |
| --- | --- | --- |
| Single series | [`Bar`](./bar.md) | [`HorizontalBar`](./horizontal-bar.md) |
| Grouped series | [`BarGroup`](./bar-group.md) | [`HorizontalBarGroup`](./horizontal-bar-group.md) |
| Stacked series | [`StackedBar`](./stacked-bar.md) | [`HorizontalStackedBar`](./horizontal-stacked-bar.md) |

Use `CartesianChart orientation="horizontal"` with the horizontal components. Horizontal bar charts keep the same data model as vertical bar charts: `xKey` identifies the category field, and `yKeys` identify numeric value fields. The chart renders categories on the vertical screen axis and numeric values on the horizontal screen axis.

## Interaction Support

`chartPressState` works with horizontal bar charts using data-semantic field names:

- `state.x.value.value` is the raw `xKey` category.
- `state.x.position.value` is the category's vertical screen position.
- `state.y[key].value.value` is the numeric series value.
- `state.y[key].position.value` is the value's horizontal screen position.
- For stacked bars, `state.yIndex.value` identifies the touched stack segment by series index.

The example app includes horizontal bar, horizontal grouped bar, and horizontal stacked bar routes with positive, negative, mixed, custom styling, and press/tooltip examples.

## Current Scope

Horizontal mode is intended for bar marks. Do not expect line, area, stacked area, or scatter marks to transpose just because the parent chart has `orientation="horizontal"`.

The current horizontal bar implementation is centered on linear value axes with a zero baseline. Log value scales, custom non-zero baselines, multi-axis horizontal value charts, and category viewport/windowing are later parity work.
