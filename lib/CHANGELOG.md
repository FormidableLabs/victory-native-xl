# victory-native

## 42.0.0

### Major Changes

- Raise minimum `@shopify/react-native-skia` to `>=2.6.0` and migrate chart path construction to the immutable `PathBuilder` API. Raise minimum `react-native-reanimated` to `>=3.19.1` to align with Skia 2.6. ([#680](https://github.com/FormidableLabs/victory-native-xl/pull/680))

## 41.26.0

### Minor Changes

- Add Cartesian candlestick chart rendering with `Candlestick`, `useCandlestickPaths`, and OHLC geometry utilities. ([#676](https://github.com/FormidableLabs/victory-native-xl/pull/676))

  Includes examples for scrub interaction, windowed OHLC updates, custom candle styling, and doji or missing-value cases.

## 41.25.0

### Minor Changes

- Add optional Cartesian axis titles with automatic chart-space reservation. ([#672](https://github.com/FormidableLabs/victory-native-xl/pull/672))

- Add data label formatting and rotation options for Cartesian bars. ([#672](https://github.com/FormidableLabs/victory-native-xl/pull/672))

- Add measurement-aware custom Cartesian axis label renderers. ([#672](https://github.com/FormidableLabs/victory-native-xl/pull/672))

- Add an opt-in Skia Paragraph axis label renderer helper for multilingual labels. ([#672](https://github.com/FormidableLabs/victory-native-xl/pull/672))

## 41.24.0

### Minor Changes

- Add `HorizontalStackedBar` and `useHorizontalStackedBarPaths` for stacked bar charts inside `CartesianChart orientation="horizontal"`. ([#670](https://github.com/FormidableLabs/victory-native-xl/pull/670))

### Patch Changes

- Add orientation-neutral `isStart`, `isEnd`, `seriesIndex`, and `datumIndex` fields to stacked bar `barOptions` while preserving existing vertical field aliases. ([#670](https://github.com/FormidableLabs/victory-native-xl/pull/670))

## 41.23.0

### Minor Changes

- Add horizontal Cartesian bar chart support through `CartesianChart orientation="horizontal"` and the new `HorizontalBar` and `HorizontalBarGroup` components. ([#668](https://github.com/FormidableLabs/victory-native-xl/pull/668))

  Horizontal chart axis formatter types now match the runtime axis roles: `xAxis.formatXLabel` receives numeric value ticks, while `yAxis.formatYLabel` receives `xKey` category values.

## 41.22.0

### Minor Changes

- Assign Cartesian chart mutable `actionsRef` through React's imperative handle, and allow Reanimated shared-value action refs for worklet custom gestures. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Export bar overlay helpers including `useBarWidth`, `getBarWidth`, `useCartesianChartContext`, and `createRoundedRectPath`. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Export and provide `useCartesianTransformContext` so chart children can read the current transform scale and translation. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Add `chartPressConfig.pan.simultaneousWithExternalGesture` for running chart press gestures simultaneously with external gesture refs such as parent scroll views. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Support newline-delimited multiline labels for Cartesian x and y axes. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Add transform pan activation and failure offset options so chart panning can coordinate with parent scroll gestures. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

### Patch Changes

- Keep Cartesian y scales finite when every value for a y key is missing. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Cap rounded Cartesian bar corner radii to half of the rendered bar width. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Bridge Cartesian chart context into the Skia canvas to avoid multiple-renderer context provider warnings. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Apply explicit zero values in `chartPressConfig.pan` and wire Y-axis pan offsets to the matching gesture methods. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Limit downsampled explicit axis `tickValues` to the requested `tickCount`. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Avoid reserving Cartesian x-axis label space when x-label formatting intentionally returns empty labels. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Avoid reserving Cartesian y-axis label offset space when y-label formatting intentionally returns empty labels. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Preserve explicit empty y-axis labels during Cartesian layout measurement so hidden labels do not reserve y-axis space. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Respect explicit `barWidth={0}` on Cartesian bar groups. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Respect explicit `barWidth={0}` on Cartesian bar components. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Preserve the full scale domain when `domainPadding` is used with a viewport. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Keep first and last x-axis labels visible by clamping label drawing inside the chart bounds. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Keep the chart gesture overlay aligned with the visible chart area during pan and zoom transforms. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Return JSX elements from grouped bar, stacked bar, and pie chart components so their declaration types can be used as JSX components. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Preserve legacy `axisOptions` frame line color and width when normalizing Cartesian axes. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Keep log y scales finite when missing or non-positive values cannot define a valid positive domain, and treat non-positive log values as missing points. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Measure Cartesian ordinal x-axis labels using formatted x values instead of tick indexes. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Avoid reserving Cartesian x-axis label space when x ticks are disabled. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Use ordinal x-data indexes when normalizing Cartesian x-axis ticks so categorical axes respect `tickCount` and avoid extra scale-generated ticks. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Reset Cartesian chart press state when chart data changes so tooltips do not remain active on stale data. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Keep rotated x-axis label layout finite when no x ticks are rendered. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Keep single-value log y scales positive and finite. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Prevent `CartesianChart` from replaying a `chartPressState` touch that was released before long-press pan activation. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Preserve explicit zero scale values when reading transform matrix components while keeping axis rescaling finite. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Use the x-axis `labelOffset` when reserving Cartesian x-label layout space instead of reading the current y-axis offset. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

- Respect `tickCount={0}` when explicit axis `tickValues` are provided so no ticks or tick labels are rendered. ([#664](https://github.com/FormidableLabs/victory-native-xl/pull/664))

## 41.21.1

### Patch Changes

- Fix `chartPressConfig.pan` Y offset options being applied to X gesture methods. ([#655](https://github.com/FormidableLabs/victory-native-xl/pull/655))

## 41.21.0

### Minor Changes

- Add explicitSize and headless rendering support to CartesianChart and PolarChart ([#657](https://github.com/FormidableLabs/victory-native-xl/pull/657))

## 41.20.3

### Patch Changes

- Fix Cartesian chart press coordinate mapping for nested layouts and transformed charts. ([#654](https://github.com/FormidableLabs/victory-native-xl/pull/654))

- adjust peer deps ([#628](https://github.com/FormidableLabs/victory-native-xl/pull/628))

## 41.20.2

### Patch Changes

- all scrolling and scrubbing ([#633](https://github.com/FormidableLabs/victory-native-xl/pull/633))

## 41.20.1

### Patch Changes

- use `View` for cartestian chart `onLayout` ([#621](https://github.com/FormidableLabs/victory-native-xl/pull/621))

## 41.20.0

### Minor Changes

- Add `stepAfter` and `stepBefore` to the line curve options ([#618](https://github.com/FormidableLabs/victory-native-xl/pull/618))

## 41.19.3

### Patch Changes

- Add ref Prop to CartesianChart to Expose Skia Canvas and Chart Actions ([#599](https://github.com/FormidableLabs/victory-native-xl/pull/599))

## 41.19.2

### Patch Changes

- fixes type exports ([#609](https://github.com/FormidableLabs/victory-native-xl/pull/609))

## 41.19.1

### Patch Changes

- move deprecate canvas onLayout onto parent containers ([#605](https://github.com/FormidableLabs/victory-native-xl/pull/605))

## 41.19.0

### Minor Changes

- fix: update package.json exports format for Metro compatibility ([#581](https://github.com/FormidableLabs/victory-native-xl/pull/581))

## 41.18.0

### Minor Changes

- Add scale logarithmic to cartesian charts ([#592](https://github.com/FormidableLabs/victory-native-xl/pull/592))

## 41.17.4

### Patch Changes

- remove temporary polar chart hack by bumping skia dep ([#575](https://github.com/FormidableLabs/victory-native-xl/pull/575))

## 41.17.3

### Patch Changes

- Bump example app dependencies + fix two issues with updated versions ([#567](https://github.com/FormidableLabs/victory-native-xl/pull/567))

## 41.17.2

### Patch Changes

- Add curve type `basis` for lines ([#565](https://github.com/FormidableLabs/victory-native-xl/pull/565))

## 41.17.1

### Patch Changes

- fix rotate label transformation ([#504](https://github.com/FormidableLabs/victory-native-xl/pull/504))

## 41.17.0

### Minor Changes

- Add gestureHandlerConfig prop to CartesianChart for customizable gesture handling. ([#517](https://github.com/FormidableLabs/victory-native-xl/pull/517))

## 41.16.2

### Patch Changes

- Add `upperPoints` and `lowerPoints` properties as an alternative to `points` for `AreaRange` component ([#488](https://github.com/FormidableLabs/victory-native-xl/pull/488))

- fix hard crash when data is empty ([#509](https://github.com/FormidableLabs/victory-native-xl/pull/509))

- Make it possible to zoom/pan simultaneously ([#489](https://github.com/FormidableLabs/victory-native-xl/pull/489))

## 41.16.1

### Patch Changes

- Fix bar group positioning ([#478](https://github.com/FormidableLabs/victory-native-xl/pull/478))

## 41.16.0

### Minor Changes

- add custom x-axis label rotate ([#469](https://github.com/FormidableLabs/victory-native-xl/pull/469))

## 41.15.0

### Minor Changes

- Add AreaRange component ([#466](https://github.com/FormidableLabs/victory-native-xl/pull/466))

## 41.14.0

### Minor Changes

- Add animations for pie chart ([#451](https://github.com/FormidableLabs/victory-native-xl/pull/451))

## 41.13.0

### Minor Changes

- Add ability to scroll chart data ([#437](https://github.com/FormidableLabs/victory-native-xl/pull/437))

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

- Support "missing data", add `connectMissingData` prop to line/area charts. Allows for null/undefined y-values. ([#129](https://github.com/FormidableLabs/victory-native-xl/pull/129))

- Include src files in distribution tarball ([#100](https://github.com/FormidableLabs/victory-native-xl/pull/100))

- Loosen peer dependency requirements ([#111](https://github.com/FormidableLabs/victory-native-xl/pull/111))

- Add package provenance ([#108](https://github.com/FormidableLabs/victory-native-xl/pull/108))

- Updates to signature of useChartPressState, internal changes, to support non-numerical input values. ([#105](https://github.com/FormidableLabs/victory-native-xl/pull/105))

- Fixed initial x value for useChartStatePress() ([#121](https://github.com/FormidableLabs/victory-native-xl/pull/121))

## 40.0.0-next.7

### Patch Changes

- Support "missing data", add `connectMissingData` prop to line/area charts. Allows for null/undefined y-values. ([#129](https://github.com/FormidableLabs/victory-native-xl/pull/129))

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
