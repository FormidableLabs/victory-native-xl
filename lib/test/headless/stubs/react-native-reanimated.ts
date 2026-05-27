import type { ReactNode } from "react";

export function useSharedValue<T>(init: T): { value: T } {
  return { value: init };
}

export function useDerivedValue<T>(fn: () => T): { value: T } {
  return { value: fn() };
}

export function makeMutable<T>(init: T): { value: T } {
  return { value: init };
}

export function isSharedValue(value: unknown): value is { value: unknown } {
  return typeof value === "object" && value !== null && "value" in value;
}

export function withTiming<T>(value: T): T {
  return value;
}

export function withSpring<T>(value: T): T {
  return value;
}

export function withDecay(): number {
  return 0;
}

export function useAnimatedReaction(): void {}

export function runOnJS<T extends (...args: never[]) => unknown>(fn: T): T {
  return fn;
}

export function useAnimatedStyle<T>(fn: () => T): T {
  return fn();
}

export const Animated = {
  View: ({ children }: { children?: ReactNode }) => children,
};

export type SharedValue<T> = { value: T };
