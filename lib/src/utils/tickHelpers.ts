export function downsampleTicks(ticks: number[], tickCount: number) {
  if (!tickCount || !Array.isArray(ticks) || ticks.length <= tickCount) {
    return ticks;
  }
  const k = Math.floor(ticks.length / tickCount);

  return ticks.filter((_, i) => i % k === 0);
}

const getMinValue = (arr: Array<number>): number => {
  return Math.min(...arr);
};

const getMaxValue = (arr: Array<number>): number => {
  return Math.max(...arr);
};

export const getDomainFromTicks = (ticks: number[] | undefined) => {
  if (!Array.isArray(ticks)) return;

  const min = getMinValue(ticks);
  const max = getMaxValue(ticks);

  return [min, max];
};
