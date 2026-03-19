---
"victory-native": patch
---

Fix pan/zoom dead zones and incorrect tooltip position when chart is zoomed

**GestureHandler dead zones (relates to #515):** The gesture handler view was being
translated and scaled in sync with the chart's transform matrix. This caused its
hit-testable area to drift so that touches starting outside the original chart
viewport (e.g. after panning the chart) were silently ignored. The handler now
fills its parent container unconditionally; CartesianChart's `handleTouch` already
compensates for the current pan offset, so tooltip accuracy is unaffected.

**Tooltip snaps to wrong data point when zoomed:** `handleTouch` was computing the
canvas-space x coordinate as `touch.absoluteX - translateX`. This correctly cancels
the pan offset but does not account for the zoom scale, so at `scaleX > 1` the
computed position overshot into the far end of the data range. The fix switches to
view-relative `touch.x` / `touch.y` (which already accounts for the container
offset) and divides by the current scale to map back to original canvas coordinates:
`(touch.x - translateX) / scaleX`.
