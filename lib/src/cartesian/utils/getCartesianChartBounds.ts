import type { ChartBounds, SidedNumber, Viewport } from "../../types";
import { valueFromSidedNumber } from "../../utils/valueFromSidedNumber";

type CartesianScale = {
  (value: number): number;
  domain: () => number[];
};

const getScaleValue = (scale: CartesianScale, value: number) => {
  const output = scale(value);
  return Number.isFinite(output) ? output : 0;
};

const getDomainValue = (
  scale: CartesianScale,
  index: 0 | -1,
  fallback: number,
) => {
  const value = scale.domain().at(index);
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
};

export const getCartesianChartBounds = ({
  xScale,
  yScale,
  viewport,
  domainPadding,
}: {
  xScale: CartesianScale;
  yScale: CartesianScale;
  viewport?: Viewport;
  domainPadding?: SidedNumber;
}): ChartBounds => {
  const hasXViewport = viewport?.x !== undefined;
  const hasYViewport = viewport?.y !== undefined;
  const leftPadding = hasXViewport
    ? valueFromSidedNumber(domainPadding, "left")
    : 0;
  const rightPadding = hasXViewport
    ? valueFromSidedNumber(domainPadding, "right")
    : 0;
  const topPadding = hasYViewport
    ? valueFromSidedNumber(domainPadding, "top")
    : 0;
  const bottomPadding = hasYViewport
    ? valueFromSidedNumber(domainPadding, "bottom")
    : 0;

  return {
    left:
      getScaleValue(xScale, viewport?.x?.[0] ?? getDomainValue(xScale, 0, 0)) -
      leftPadding,
    right:
      getScaleValue(xScale, viewport?.x?.[1] ?? getDomainValue(xScale, -1, 0)) +
      rightPadding,
    top:
      getScaleValue(yScale, viewport?.y?.[1] ?? getDomainValue(yScale, 0, 0)) -
      topPadding,
    bottom:
      getScaleValue(yScale, viewport?.y?.[0] ?? getDomainValue(yScale, -1, 0)) +
      bottomPadding,
  };
};
