import React from "react";
import { useContextBridge } from "../../../src/shared/useContextBridge";

type Bridge = ReturnType<typeof useContextBridge>;

/**
 * Hands the bridge for `context` to the test.
 */
export const CapturesBridge = ({
  context,
  onBridge,
}: {
  context: React.Context<string>;
  onBridge: (bridge: Bridge) => void;
}) => {
  onBridge(useContextBridge([context]));
  return null;
};

/**
 * Takes longer to render than the time React gives low priority work before
 * it pauses to let other work run, and schedules `whilePaused` for that
 * pause. At that point the renderer is still below the providers above this
 * component.
 */
export const PausesRendering = ({
  whilePaused,
}: {
  whilePaused: () => void;
}) => {
  setTimeout(whilePaused, 0);
  const start = performance.now();
  while (performance.now() - start < 20) {
    // Busy wait.
  }
  return null;
};

export const ContextReader = ({
  context,
  onValue,
}: {
  context: React.Context<string>;
  onValue: (value: string) => void;
}) => {
  onValue(React.useContext(context));
  return null;
};
