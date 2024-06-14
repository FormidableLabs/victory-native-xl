# victory-native

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
