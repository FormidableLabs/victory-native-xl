import { type ChartExplicitSize } from "./ChartExplicitSize";

/**
 * Layout props for charts that support optional fixed sizing and headless mode.
 *
 * - `explicitSize` alone: fixed dimensions with normal mounted chrome.
 * - `headless: true`: requires `explicitSize`; renders a Skia-only subtree.
 */
export type ChartLayoutModeProps =
  | {
      /**
       * Initializes chart dimensions without waiting for React Native `onLayout`.
       */
      explicitSize?: ChartExplicitSize;
      headless?: false;
    }
  | {
      explicitSize: ChartExplicitSize;
      headless?: boolean;
    };
