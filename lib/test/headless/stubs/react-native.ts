import type { ReactNode } from "react";

export const StyleSheet = {
  create: <T extends Record<string, unknown>>(styles: T) => styles,
  hairlineWidth: 1,
  absoluteFillObject: {},
};

export const Platform = {
  OS: "web" as const,
};

export const PixelRatio = {
  get: () => 1,
};

export const Image = {
  resolveAssetSource: () => ({ uri: "" }),
};

export function findNodeHandle(): null {
  return null;
}

export type LayoutChangeEvent = {
  nativeEvent: {
    layout: { width: number; height: number; x: number; y: number };
  };
};

export type ViewStyle = Record<string, unknown>;
export type StyleProp<T> = T | T[] | null | undefined;

export const View = ({ children }: { children?: ReactNode }) => children;

export const TurboModuleRegistry = {
  getEnforcing: () => ({}),
};
