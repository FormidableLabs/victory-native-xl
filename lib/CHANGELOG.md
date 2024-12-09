# victory-native

## 41.12.5

### Patch Changes

- Fix calculating y scale range based on label position configurations. ([#445](https://github.com/FormidableLabs/victory-native-xl/pull/445))

## 41.12.4

### Patch Changes

- add package 'its-fine' for polar chart shared contexts ([#440](https://github.com/FormidableLabs/victory-native-xl/pull/440))

## 41.12.3

### Patch Changes

- allow tickValues for multiple Y axes ([#438](https://github.com/FormidableLabs/victory-native-xl/pull/438))

## 41.12.2

### Patch Changes

- Fixes Reanimated warning ([#435](https://github.com/FormidableLabs/victory-native-xl/pull/435))

## 41.12.1

### Patch Changes

- Fix warnings associated with newer versions of Reanimated ([#423](https://github.com/FormidableLabs/victory-native-xl/pull/423))

## 41.12.0

### Minor Changes

- Add additional configuration options for pan gesture. ([#418](https://github.com/FormidableLabs/victory-native-xl/pull/418))

- Add ability to pass use custom gesture definitions. ([#417](https://github.com/FormidableLabs/victory-native-xl/pull/417))

## 41.11.0

### Minor Changes

- Add support for Pan/Zoom ([#425](https://github.com/FormidableLabs/victory-native-xl/pull/425))

## 41.10.0

### Minor Changes

- Add stacked area charts ([#387](https://github.com/FormidableLabs/victory-native-xl/pull/387))

## 41.9.0

### Minor Changes

- Expose chart xTick and yTick values ([#409](https://github.com/FormidableLabs/victory-native-xl/pull/409))

## 41.8.0

### Minor Changes

- Add `matchedIndex` to chart press state ([#405](https://github.com/FormidableLabs/victory-native-xl/pull/405))

## 41.7.0

### Minor Changes

- Updates the lineWidth prop for frame to allow for configuring the width per side. ([#397](https://github.com/FormidableLabs/victory-native-xl/pull/397))

### Patch Changes

- Fix determining stacked bar count from points structure ([#404](https://github.com/FormidableLabs/victory-native-xl/pull/404))

## 41.6.2

### Patch Changes

- Add pie size prop ([#392](https://github.com/FormidableLabs/victory-native-xl/pull/392))

## 41.6.1

### Patch Changes

- Fix stacked bar rounded corners for non-uniform datasets and add support for positive and negative values in the same column. ([#386](https://github.com/FormidableLabs/victory-native-xl/pull/386))

## 41.6.0

### Minor Changes

- Add dashed path effect option for X and Y axes ([#372](https://github.com/FormidableLabs/victory-native-xl/pull/372))

## 41.5.0

### Minor Changes

- Added domain property for multiple y axes ([#375](https://github.com/FormidableLabs/victory-native-xl/pull/375))

### Patch Changes

- Fix frame prop ([#379](https://github.com/FormidableLabs/victory-native-xl/pull/379))

## 41.4.0

### Minor Changes

- Add multiple y-axis support ([#352](https://github.com/FormidableLabs/victory-native-xl/pull/352))

## 41.3.0

### Minor Changes

- Added pie chart labels ([#362](https://github.com/FormidableLabs/victory-native-xl/pull/362))

## 41.2.0

### Minor Changes

- Added labels to bar charts. ([#353](https://github.com/FormidableLabs/victory-native-xl/pull/353))

## 41.1.2

### Patch Changes

- Add Stacked Bars support ([#315](https://github.com/FormidableLabs/victory-native-xl/pull/315))

## 41.1.1

### Patch Changes

- Add curve type `monotoneX` for lines ([#325](https://github.com/FormidableLabs/victory-native-xl/pull/325))

## 41.1.0

### Minor Changes

- Added support for web as a platform ([#330](https://github.com/FormidableLabs/victory-native-xl/pull/330))

## 41.0.2

### Patch Changes

- fix domain padding bottom on bar charts ([#303](https://github.com/FormidableLabs/victory-native-xl/pull/303))

- Add circleSweepDegrees and startAngle props to PieChart ([#307](https://github.com/FormidableLabs/victory-native-xl/pull/307))

## 41.0.1

### Patch Changes

- Fix yLabel width calculation to better align x-scale ([#291](https://github.com/FormidableLabs/victory-native-xl/pull/291))

- Replace getTextWidth with measureText ([#290](https://github.com/FormidableLabs/victory-native-xl/pull/290))

- fix: `useAnimatedPath` no longer jumps when path changes during animation ([#287](https://github.com/FormidableLabs/victory-native-xl/pull/287))

- fix negative bar charts for bar groups ([#295](https://github.com/FormidableLabs/victory-native-xl/pull/295))

## 41.0.0

### Major Changes

- Bump Expo 51, RN 74, Skia 1.0+ ([#259](https://github.com/FormidableLabs/victory-native-xl/pull/259))

### Minor Changes

- Add negative bar value support ([#262](https://github.com/FormidableLabs/victory-native-xl/pull/262))

## 40.2.1

### Patch Changes

- remove defaultProps ([#273](https://github.com/FormidableLabs/victory-native-xl/pull/273))

- Fix pie chart rendering when multiple elements have 0 values ([#266](https://github.com/FormidableLabs/victory-native-xl/pull/266))

## 40.2.0

### Minor Changes

- add tickValues to axisOptions prop ([#255](https://github.com/FormidableLabs/victory-native-xl/pull/255))

- Add `barWidth` and `barCount` prop for `Bar` and `BarGroup` ([#238](https://github.com/FormidableLabs/victory-native-xl/pull/238))

### Patch Changes

- export `PieSliceData` type ([#249](https://github.com/FormidableLabs/victory-native-xl/pull/249))

## 40.1.1

### Patch Changes

- fix: add onEnd callback for cartesian pangesture ([#230](https://github.com/FormidableLabs/victory-native-xl/pull/230))

- resolve single data point dupe keys warning ([#237](https://github.com/FormidableLabs/victory-native-xl/pull/237))

## 40.1.0

### Minor Changes

- Extend axisOptions lineWidth & lineColor API to allow for custom axis configuration ([#209](https://github.com/FormidableLabs/victory-native-xl/pull/209))

- Add Pie/Donut charts ([#191](https://github.com/FormidableLabs/victory-native-xl/pull/191))

## 40.0.4

### Patch Changes

- Fixes interaction between gestures and scrolling for charts on Android. Added prop `gestureLongPressDelay` to `CartesianChart` . ([#186](https://github.com/FormidableLabs/victory-native-xl/pull/186))

## 40.0.3

### Patch Changes

- Fixed grid and frame lineWidth prop. ([#174](https://github.com/FormidableLabs/victory-native-xl/pull/174))

## 40.0.2

### Patch Changes

- Fix asNumber per #135 so that null values don't get coerced to 0 ([#138](https://github.com/FormidableLabs/victory-native-xl/pull/138))

## 40.0.1

### Patch Changes

- Remove pre-production disclaimer from README ([#134](https://github.com/FormidableLabs/victory-native-xl/pull/134))

## 40.0.0

### Major Changes

- First next release. ([#82](https://github.com/FormidableLabs/victory-native-xl/pull/82))

### Patch Changes

- Add 'roundedCorners' prop to 'BarGroup' component ([#115](https://github.com/FormidableLabs/victory-native-xl/pull/115))

- Adds onChartBoundsChange prop to CartesianChart ([#117](https://github.com/FormidableLabs/victory-native-xl/pull/117))

- Support "misisng data", add `connectMissingData` prop to line/area charts. Allows for null/undefined y-values. ([#129](https://github.com/FormidableLabs/victory-native-xl/pull/129))

- Include src files in distribution tarball ([#100](https://github.com/FormidableLabs/victory-native-xl/pull/100))

- Loosen peer dependency requirements ([#111](https://github.com/FormidableLabs/victory-native-xl/pull/111))

- Add package provenance ([#108](https://github.com/FormidableLabs/victory-native-xl/pull/108))

- Updates to signature of useChartPressState, internal changes, to support non-numerical input values. ([#105](https://github.com/FormidableLabs/victory-native-xl/pull/105))

- Fixed initial x value for useChartStatePress() ([#121](https://github.com/FormidableLabs/victory-native-xl/pull/121))

## 40.0.0-next.7

### Patch Changes

- Support "misisng data", add `connectMissingData` prop to line/area charts. Allows for null/undefined y-values. ([#129](https://github.com/FormidableLabs/victory-native-xl/pull/129))

## 40.0.0-next.6

### Patch Changes

- Fixed initial x value for useChartStatePress() ([#121](https://github.com/FormidableLabs/victory-native-xl/pull/121))

## 40.0.0-next.5

### Patch Changes

- Adds onChartBoundsChange prop to CartesianChart ([#117](https://github.com/FormidableLabs/victory-native-xl/pull/117))

## 40.0.0-next.4

### Patch Changes

- Add 'roundedCorners' prop to 'BarGroup' component ([#115](https://github.com/FormidableLabs/victory-native-xl/pull/115))

- Loosen peer dependency requirements ([#111](https://github.com/FormidableLabs/victory-native-xl/pull/111))

## 40.0.0-next.3

### Patch Changes

- Add package provenance ([#108](https://github.com/FormidableLabs/victory-native-xl/pull/108))

## 40.0.0-next.2

### Patch Changes

- Updates to signature of useChartPressState, internal changes, to support non-numerical input values. ([#105](https://github.com/FormidableLabs/victory-native-xl/pull/105))

## 40.0.0-next.1

### Patch Changes

- Include src files in distribution tarball ([#100](https://github.com/FormidableLabs/victory-native-xl/pull/100))

## 40.0.0-next.0

### Major Changes

- First next release. ([#82](https://github.com/FormidableLabs/victory-native-xl/pull/82))
