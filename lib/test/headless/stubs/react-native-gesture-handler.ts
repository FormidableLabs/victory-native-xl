import type { ReactNode } from "react";

const chainableGesture = () => {
  const proxy = new Proxy(() => proxy, {
    get: () => chainableGesture,
    apply: () => proxy,
  });
  return proxy;
};

export const Gesture = {
  Race: (..._gestures: unknown[]) => chainableGesture(),
  Pinch: () => chainableGesture(),
  Pan: () => chainableGesture(),
  LongPress: () => chainableGesture(),
  Tap: () => chainableGesture(),
};

export type PanGesture = ReturnType<typeof Gesture.Pan>;
export type PinchGesture = ReturnType<typeof Gesture.Pinch>;
export type ComposedGesture = ReturnType<typeof Gesture.Race>;
export type GestureType = PanGesture | PinchGesture | ComposedGesture;
export type TouchData = { x: number; y: number };

export function GestureDetector({ children }: { children?: ReactNode }) {
  return children;
}

export function GestureHandlerRootView({ children }: { children?: ReactNode }) {
  return children;
}
