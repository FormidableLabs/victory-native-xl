import * as React from "react";

/**
 * A context to make available to the components rendered inside a chart.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BridgedContext = React.Context<any>;

const NO_CONTEXTS: readonly BridgedContext[] = [];

const bridgedContexts = new WeakSet<BridgedContext>();

/**
 * A bridged context is provided by two React renderers: the app's, and the
 * canvas' own. In development, React reports "Detected multiple renderers
 * concurrently rendering the same context provider" when the canvas renders
 * while the app's renderer is paused below a provider of the same context
 * (during a transition for instance). Each renderer restores the value it
 * found once it is done with its provider, so this is harmless for a bridge,
 * which only ever repeats a value that the app provided.
 *
 * This hides the development only bookkeeping behind that report for the
 * contexts that were explicitly asked to be bridged.
 */
const allowSecondRenderer = (context: BridgedContext) => {
  if (process.env.NODE_ENV === "production" || bridgedContexts.has(context)) {
    return;
  }
  bridgedContexts.add(context);
  try {
    Object.defineProperty(context, "_currentRenderer2", {
      configurable: true,
      get: () => null,
      set: () => {},
    });
  } catch {
    // The report is only a development aid: nothing else depends on this.
  }
};

/**
 * React context does not cross into the canvas, which is rendered by a
 * separate React renderer. This reads the current value of each of the given
 * contexts and returns a function that provides these values again around
 * the content of the canvas.
 *
 * Only the given contexts are read, so the calling component only renders
 * again when one of them changes.
 */
export const useContextBridge = (
  contexts: readonly BridgedContext[] = NO_CONTEXTS,
) => {
  // Unlike `useContext`, `use` may be called in a loop, so the list is free to
  // change between renders.
  const values = contexts.map((context) => {
    allowSecondRenderer(context);
    return React.use(context);
  });

  return (content: React.ReactNode): React.ReactNode =>
    contexts.reduceRight<React.ReactNode>(
      (children, Context, index) => (
        <Context.Provider value={values[index]}>{children}</Context.Provider>
      ),
      content,
    );
};
