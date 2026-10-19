---
"victory-native": major
---

Switch the Skia peer dependency from `@shopify/react-native-skia` to its renamed package `react-native-skia`, and raise the minimum to `>=2.15.0 <3.0.0`. `@shopify/react-native-skia` stops at 2.14.0, so projects staying on Skia 2.x need to replace it with `react-native-skia` (`yarn remove @shopify/react-native-skia && yarn add react-native-skia`) and update their `@shopify/react-native-skia` imports.
