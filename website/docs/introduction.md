---
slug: /
---

# Introduction

Victory Native (XL) is a from-scratch rewrite of Victory Native that favors flexibility, ease of use, and **performance**.

DOCS:TODO: An introductory GIF with FPS meter.

Under the hood it's using:

- [React Native Reanimated (v3)](https://docs.swmansion.com/react-native-reanimated/).
- [React Native Gesture Handler (v2)](https://docs.swmansion.com/react-native-gesture-handler/).
- [React Native Skia](https://shopify.github.io/react-native-skia/).
- With a sprinkle of [D3](https://d3js.org/).

Reanimated and Gesture Handler offer powerful, convenient, and performant ways to handle gestures and animate UI in React Native. React Native Skia ships the Skia rendering engine (the engine that powers Google Chrome's UI) with a friendly React Native wrapper, allowing developers to write incredibly sophisticated and performant graphics code.

This toolset offers a foundation to build high-end data visualizations that can animate at over 100 FPS even on low-end devices.

## Why a rewrite?

[Victory](https://github.com/FormidableLabs/victory/) was originally built for the web, leveraging the power of [D3](https://d3js.org/) and SVG for rendering. It was later abstracted so that custom React elements could be used to render the various parts of the data visualizations, which allowed for Victory to use [React Native SVG](https://github.com/software-mansion/react-native-svg) to render Victory charts in React Native.

This worked well in many scenarios, but fell short in a few key ways:

- React Native SVG wasn't designed to have a large number of nodes being updated over the bridge dynamically.
- Victory's animation/gesture code triggers a lot of React re-renders, which when coupled with the first point made for almost-useless charts in Android when needing to add user interactions with datasets of any significant size.
- Native mobile and web are _different targets_ and UX differs in non-trivial ways. We believe that users expect to interact with data visualizations on mobile apps in different ways than on a desktop browser, and mobile data visualization libraries should adapt accordingly.
