type TouchWithId = {
  id?: number;
};

export type ChartPressBootstrapEntry<TState, TTouch extends TouchWithId> = {
  pressIndex: number;
  state: TState;
  touch: TTouch;
};

const hasReleasedTouchId = (
  touchId: number,
  changedTouches: readonly TouchWithId[],
) => {
  "worklet";

  for (let i = 0; i < changedTouches.length; i++) {
    if (changedTouches[i]?.id === touchId) return true;
  }

  return false;
};

export const pruneChartPressBootstrap = <TState, TTouch extends TouchWithId>({
  bootstrap,
  changedTouches,
  numberOfTouches,
}: {
  bootstrap: ChartPressBootstrapEntry<TState, TTouch>[];
  changedTouches: readonly TouchWithId[];
  numberOfTouches?: number;
}) => {
  "worklet";

  if (numberOfTouches === 0) return [];

  const nextBootstrap: ChartPressBootstrapEntry<TState, TTouch>[] = [];

  for (let i = 0; i < bootstrap.length; i++) {
    const entry = bootstrap[i];
    const touchId = entry?.touch.id;

    if (
      typeof touchId === "number" &&
      hasReleasedTouchId(touchId, changedTouches)
    ) {
      continue;
    }

    if (entry) nextBootstrap.push(entry);
  }

  return nextBootstrap;
};
