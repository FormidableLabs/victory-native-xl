// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Point } from "../types";

const getClosest = (val1: Point, val2: Point, targetX: number) => {
  "worklet";
  return targetX - val1.x >= val2.x - targetX ? val2 : val1;
};

export function findClosestPoint(data: Point[], targetX: number): Point | null {
  "worklet";

  const n = data.length;
  if (targetX <= data[0].x) return data[0];
  if (targetX >= data[n - 1].x) return data[n - 1];

  // Doing binary search
  let i = 0,
    j = n,
    mid = 0;
  while (i < j) {
    mid = Math.floor((i + j) / 2);

    if (data[mid].x === targetX) return data[mid];

    // search left
    if (targetX < data[mid].x) {
      // If targetX is greater than previous
      // to mid, return closest of two
      if (mid > 0 && targetX > data[mid - 1].x)
        return getClosest(data[mid - 1], data[mid], targetX);

      // Repeat for left half
      j = mid;
    }

    // If target is greater than mid
    else {
      if (mid < n - 1 && targetX < data[mid + 1].x)
        return getClosest(data[mid], data[mid + 1], targetX);
      i = mid + 1; // update i
    }
  }

  // Only single element left after search
  return data[mid];
}
