import type { Gesture } from "react-native-gesture-handler";

// RNGH 3 renames the builder types to Legacy*. Derive them from the stable
// Gesture API so our declarations work with both RNGH 2 and 3.
export type PanGesture = ReturnType<typeof Gesture.Pan>;
export type PinchGesture = ReturnType<typeof Gesture.Pinch>;
export type HoverGesture = ReturnType<typeof Gesture.Hover>;
export type ComposedGesture = ReturnType<typeof Gesture.Race>;
