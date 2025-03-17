import * as React from "react";
import { ZoomTransform } from "d3-zoom";
import type { ScaleLinear } from "d3-scale";
import isEqual from "react-fast-compare";
import { useFunctionRef } from "../hooks/useFunctionRef";

import { XAxis } from "./components/XAxisScroll";
import { YAxis } from "./components/YAxis";
import { useBuildChartAxis } from "./hooks/useBuildChartAxis";
import { useCartesianTransformContext } from "./contexts/CartesianTransformContext";
import { downsampleTicks } from "../utils/tickHelpers";
import { normalizeYAxisTicks } from "../utils/normalizeYAxisTicks";

export function useChartAxis({
  yKeys,
  axisOptions,
  onScaleChange,
  xAxis,
  yAxis,
  frame,
  xScale,
  primaryYScale,
  chartBounds,
  yAxes,
  isNumericalData,
  _tData,
  hasMeasuredLayoutSize,
  scrollX,
  ignoreClip,
}: any) {
  const xScaleRef = React.useRef<ScaleLinear<number, number> | undefined>(
    undefined,
  );
  const yScaleRef = React.useRef<ScaleLinear<number, number> | undefined>(
    undefined,
  );

  const normalizedAxisProps = useBuildChartAxis({
    xAxis,
    yAxis,
    frame,
    yKeys,
    axisOptions,
  });

  // create a d3-zoom transform object based on the current transform state. This
  // is used for rescaling the X and Y axes.
  const transform = useCartesianTransformContext();
  const zoomX = React.useMemo(
    () => new ZoomTransform(transform.k, transform.tx, transform.ty),
    [transform.k, transform.tx, transform.ty],
  );
  const zoomY = React.useMemo(
    () => new ZoomTransform(transform.ky, transform.tx, transform.ty),
    [transform.ky, transform.tx, transform.ty],
  );

  const onScaleRef = useFunctionRef(onScaleChange);
  React.useEffect(() => {
    const rescaledX = zoomX.rescaleX(xScale);
    const rescaledY = zoomY.rescaleY(primaryYScale);
    if (
      !isEqual(xScaleRef.current?.domain(), rescaledX.domain()) ||
      !isEqual(yScaleRef.current?.domain(), rescaledY.domain()) ||
      !isEqual(xScaleRef.current?.range(), rescaledX.range()) ||
      !isEqual(yScaleRef.current?.range(), rescaledY.range())
    ) {
      xScaleRef.current = xScale;
      yScaleRef.current = primaryYScale;
      onScaleRef.current?.(rescaledX, rescaledY);
    }
  }, [onScaleChange, onScaleRef, xScale, zoomX, zoomY, primaryYScale]);

  const YAxisComponents =
    hasMeasuredLayoutSize && (axisOptions || yAxes)
      ? normalizedAxisProps.yAxes?.map((axis, index) => {
          const yAxis = yAxes[index];

          if (!yAxis) return null;

          const primaryAxisProps = normalizedAxisProps.yAxes[0]!;
          const primaryRescaled = zoomY.rescaleY(primaryYScale);
          const rescaled = zoomY.rescaleY(yAxis.yScale);

          const rescaledTicks = axis.tickValues
            ? downsampleTicks(axis.tickValues, axis.tickCount)
            : axis.enableRescaling
              ? rescaled.ticks(axis.tickCount)
              : yAxis.yScale.ticks(axis.tickCount);

          const primaryTicksRescaled = primaryAxisProps.tickValues
            ? downsampleTicks(
                primaryAxisProps.tickValues,
                primaryAxisProps.tickCount,
              )
            : primaryAxisProps.enableRescaling
              ? primaryRescaled.ticks(primaryAxisProps.tickCount)
              : primaryYScale.ticks(primaryAxisProps.tickCount);

          return (
            <YAxis
              key={index}
              {...axis}
              xScale={zoomX.rescaleX(xScale)}
              yScale={rescaled}
              yTicksNormalized={
                index > 0 && !axis.tickValues
                  ? normalizeYAxisTicks(
                      primaryTicksRescaled,
                      primaryRescaled,
                      rescaled,
                    )
                  : rescaledTicks
              }
              chartBounds={chartBounds}
            />
          );
        })
      : null;

  const XAxisComponents =
    hasMeasuredLayoutSize && (axisOptions || xAxis) ? (
      <XAxis
        {...normalizedAxisProps.xAxis}
        scrollX={scrollX}
        xScale={xScale}
        yScale={zoomY.rescaleY(primaryYScale)}
        ix={_tData.ix}
        isNumericalData={isNumericalData}
        chartBounds={chartBounds}
        zoom={zoomX}
        ignoreClip={ignoreClip}
      />
    ) : null;

  // Memoize the body content
  const chartBody = React.useMemo(() => {
    return {
      YAxisComponents,
      XAxisComponents,
    };
  }, [YAxisComponents, XAxisComponents]);

  return chartBody;
}
