# Skia 3 / Gesture Handler 3 upgrade verification

Verified on 2026-10-09 (Asia/Manila). Upstream baseline `de84ff1f3098a2072f8c52ac801ce08141fdb46a`; tested fork branch `upgrade/skia3-gesture-handler3`.

## Dependencies and migration

| Dependency                   | Resolved version |
| ---------------------------- | ---------------- |
| Victory Native baseline      | 42.0.1           |
| react-native-skia            | 3.3.0            |
| react-native-gesture-handler | 3.3.0            |
| react-native-reanimated      | 4.5.1            |
| react-native-worklets        | 0.10.1           |
| React Native                 | 0.86.3           |
| React                        | 19.2.3           |
| Expo                         | 57.0.27          |

Skia and RNGH versions were checked against npm's stable `latest` tags on the verification date. The [Skia migration guide](https://wcandillon.github.io/react-native-skia/docs/getting-started/migration/) governs the scoped-to-unscoped package rename, native build requirement and platform minimums. Both library runtime imports and example imports use the unscoped package, including the web entry's deep import. The installed runtime graph contains no scoped Skia package.

RNGH 3's legacy builder exports preserve Victory's existing `Gesture.Pan/Pinch` and composed-gesture public contract. The exported gesture types use `LegacyPanGesture`, `LegacyPinchGesture` and `LegacyComposedGesture`; no type casts or new hook-based gesture substitution were used.

Skia 3's CanvasRef no longer exposes `makeImageSnapshotAsync`. The chart-ref example now offers the supported synchronous capture, PNG encoding and temporary-image disposal. Ref/actionsRef, redraw and selection remain available. This is an explicit example API change: the separate async snapshot button was removed.

The example requires iOS 16.4 because of Expo 57 (Skia itself requires 15.1), and configures Android API 26. Android was not built or exercised.

## Native build recovery

Xcode 26.2 (17C52), Swift 6.2 initially rejected the Expo Modules JSI scheduler constructor annotations. The committed Yarn patch backports runtime-only scheduler factories and sendable pointer wrappers from merged [Expo PR #51040](https://github.com/expo/expo/pull/51040), commit `d50bac42ff61d70fba771efd7056f09565f86b03`, to `expo-modules-jsi@57.1.1`. Upstream test changes are excluded. `yarn install --immutable` reapplies the patch through the committed resolution and lockfile.

The generated native project and Pods are intentionally untracked; regenerate with `cd example && npx expo prebuild --platform ios`, then `npx expo run:ios`. The actual Debug example build succeeded using `Victory.xcworkspace`, scheme `Victory`, iOS Simulator SDK, ad-hoc simulator signing (`CODE_SIGNING_ALLOWED=YES CODE_SIGN_IDENTITY=-`) and Metro port 8896. The app was installed as `com.formidable.victorynativexldemo` on an iPad simulator running iOS 26.2.

## Manual iOS evidence

The actual upstream example app resolves `victory-native` to the fork workspace source. These are manual observations, not an automated E2E suite.

| Route                        | Observed behavior                                                                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Landing                      | Example route categories rendered and navigation worked                                                                                         |
| pan-zoom                     | Line, fonts and axes rendered; Zoom In changed the range and line geometry                                                                      |
| scroll-transform-press-debug | Horizontal pan changed the plotted domain; long-press scrub selected index 34 (x 34, y 38.36); vertical page scrolling preserved that selection |
| bar-chart                    | Gradient bars and labels rendered; Shuffle Data changed values and heights                                                                      |
| pie-chart                    | Slice insets rendered; Simple enabled labels; Shuffle Data changed slices/colors                                                                |
| scroll-scrub                 | Pinch produced a persistent visible scale/domain change (roughly x 15–30 to 20–25)                                                              |
| chart-refs                   | Automatic actionsRef and manual actionsRef selected index 2; snapshot rendered below the chart; repeated capture succeeded                      |
| candlestick                  | Candles, axes and custom styles rendered; Later changed the windowed data and date range                                                        |

One interpolated long-press automation sequence unexpectedly navigated back. Reopening the route and using discrete Down/Move/Up events exercised scrubbing successfully; this does not establish the cause of the first sequence. Some pan/zoom examples intentionally reset transforms on gesture end, so released-frame equality on those examples was not treated as proof of pinch failure or success.

## Static checks and limits

- Source-only TypeScript check passed on the original tested fork branch. The original upstream tsconfig is restored in this proposal; full type checking currently fails in unchanged tests/type-tests importing scoped Skia.
- ESLint on all changed runtime/example sources passed; the inherited React-version configuration warning remains.
- Immutable Yarn install and library build passed. Yarn reports inherited transitive peer warnings; no Skia/RNGH/Reanimated version conflict was found in the resolved runtime dependencies.
- Whitespace/diff checks passed. Existing test and type-test files were left byte-identical; no unit tests or mixed suites were run.

Web landing and the bar-chart route were additionally checked on 2026-10-09: canvas rendering, gradients/axes/labels and Shuffle Data updates worked in the isolated Codex browser. This is limited manual web evidence.

This does not verify every example, full web gesture coverage, Android, release-mode performance, long-running GPU/resource limits, every animation/axis combination or an external app consuming the packed package. Upstream tests still contain scoped-Skia imports and need a separately authorized migration before they can be used with this fork. The successful source-only check was performed on the tested fork branch, which excluded test directories. This upstream proposal restores the original tsconfig; its full type check and unit-test CI remain unresolved. The upstream `check:code` and CI test workflow are not claimed green.
