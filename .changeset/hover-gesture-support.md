---
"victory-native": minor
---

Add hover gesture support.

Hover is aimed at pointer devices (mouse/trackpad on web or desktop) and is **enabled by default on web**; `enableHover` opts in on other platforms and `enableHover={false}` opts out on web. The hover gesture is composed simultaneously with the press and transform gestures, so touch-only behavior is unchanged.

- `CartesianChart`: hover drives the `chartPressState` values exactly like a press (values and `isActive`), or a separate `chartHoverState` prop (`ChartPressState | ChartPressState[]`) to track hover and press independently. With no states passed at all, the chart maintains a built-in hover state exposed through the render functions' `hoverState` field (`isActive`, `x.value`/`x.position`, `y.<yKey>.value`/`position`), so hover readouts need zero setup — mirroring `PolarChart`.
- `PolarChart`: the hovered-slice index is tracked for you — read it in chart content with the new `usePieHoverState()` hook (`index` is the hovered slice, or `-1` over the donut hole, outside the pie, or off the chart). Pass `chartHoverState={{ index }}` — a Reanimated shared value — only to consume the index outside the chart.
- `chartHoverConfig` (both charts): supports `activeCursor` for cursor styling and `simultaneousWithExternalGesture` to compose the hover gesture with custom gestures built outside the chart.
