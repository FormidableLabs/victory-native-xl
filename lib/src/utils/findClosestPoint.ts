const getClosest = (
  [idx1, val1]: [number, number],
  [idx2, val2]: [number, number],
  targetX: number,
) => {
  "worklet";
  return targetX - val1 >= val2 - targetX ? idx2 : idx1;
};

/**
 * Takes in x/y arrays and a targetX and returns the _index_ of closest point
 */
export function findClosestPoint(
  xValues: number[],
  targetX: number,
): number | null {
  "worklet";

  const n = xValues.length;
  if (!n) return null;

  const firstX = xValues[0],
    lastX = xValues[n - 1];
  if (firstX !== undefined && targetX <= firstX) return 0;
  if (lastX !== undefined && targetX >= lastX) return n - 1;

  // binary search
  let i = 0,
    j = n,
    mid = 0;
  while (i < j) {
    mid = Math.floor((i + j) / 2);

    if (xValues[mid] === targetX) return mid;

    // search left
    if (targetX < xValues[mid]!) {
      if (mid > 0 && targetX > xValues[mid - 1]!)
        return getClosest(
          [mid - 1, xValues[mid - 1]!],
          [mid, xValues[mid]!],
          targetX,
        );

      // Repeat for left half
      j = mid;
    }

    // search right
    else {
      if (mid < n - 1 && targetX < xValues[mid + 1]!)
        return getClosest(
          [mid, xValues[mid]!],
          [mid + 1, xValues[mid + 1]!],
          targetX,
        );
      i = mid + 1;
    }
  }

  return mid;
}
