---
"victory-native": major
---

Migrate from `@shopify/react-native-skia` to `react-native-skia` 2.15.1 or later in the 2.x series. Remove the scoped package, update Skia imports and test mocks, and rebuild native apps. Chart APIs remain unchanged; Skia 3 is not supported.

Align peer requirements with Skia 2.15 and its Worklets integration: React 19+, React Native 0.79+, Reanimated 4.x (4.1.7+), and Worklets 0.7+. Reanimated 4 requires the New Architecture; use compatible Reanimated/Worklets versions for your React Native version. Restrict Gesture Handler to the supported 2.x series. Bare React Native apps must replace `react-native-reanimated/plugin` with `react-native-worklets/plugin`; Expo's Babel preset configures it automatically.
