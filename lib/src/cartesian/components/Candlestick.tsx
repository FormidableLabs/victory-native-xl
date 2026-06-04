import * as React from "react";
import { Path, type PathProps, type SkPath } from "@shopify/react-native-skia";
import type { ChartBounds, PointsArray } from "../../types";
import { AnimatedPath } from "./AnimatedPath";
import type { PathAnimationConfig } from "../../hooks/useAnimatedPath";
import {
  useCandlestickPaths,
  type CandlestickColors,
  type CandlestickOptionsFn,
  type CandlestickBodyPathOptions,
  type CandlestickWickPathOptions,
} from "../hooks/useCandlestickPaths";

type SharedPathOptions = Partial<
  Pick<PathProps, "blendMode" | "opacity" | "antiAlias">
>;

export type CandlestickProps = {
  openPoints: PointsArray;
  highPoints: PointsArray;
  lowPoints: PointsArray;
  closePoints: PointsArray;
  chartBounds: ChartBounds;
  candleWidth?: number;
  candleRatio?: number;
  candleCount?: number;
  minBodyHeight?: number;
  candleColors?: CandlestickColors;
  wickStrokeWidth?: number;
  candleOptions?: CandlestickOptionsFn;
  animate?: PathAnimationConfig;
} & SharedPathOptions;

type CandlestickPathProps = {
  path: SkPath;
  style: "fill" | "stroke";
  options: CandlestickBodyPathOptions | CandlestickWickPathOptions;
  sharedOptions: SharedPathOptions;
  animate?: PathAnimationConfig;
};

const CandlestickPath = ({
  path,
  style,
  options,
  sharedOptions,
  animate,
}: CandlestickPathProps) => {
  const { children, ...pathOptions } = options;

  if (animate) {
    return (
      <AnimatedPath
        path={path}
        style={style}
        {...sharedOptions}
        {...pathOptions}
        animate={animate}
      >
        {children}
      </AnimatedPath>
    );
  }

  return (
    <Path path={path} style={style} {...sharedOptions} {...pathOptions}>
      {children}
    </Path>
  );
};

export const Candlestick = ({
  openPoints,
  highPoints,
  lowPoints,
  closePoints,
  chartBounds,
  candleWidth,
  candleRatio,
  candleCount,
  minBodyHeight,
  candleColors,
  wickStrokeWidth,
  candleOptions,
  animate,
  blendMode,
  opacity,
  antiAlias,
}: CandlestickProps) => {
  const paths = useCandlestickPaths({
    openPoints,
    highPoints,
    lowPoints,
    closePoints,
    chartBounds,
    candleWidth,
    candleRatio,
    candleCount,
    minBodyHeight,
    candleColors,
    wickStrokeWidth,
    candleOptions,
  });
  const sharedOptions = { blendMode, opacity, antiAlias };

  if (paths.mode === "custom") {
    return (
      <>
        {paths.candles.map((candle) => (
          <React.Fragment key={candle.key}>
            <CandlestickPath
              key={`${candle.key}-wick`}
              path={candle.wickPath}
              style="stroke"
              options={candle.wickOptions}
              sharedOptions={sharedOptions}
              animate={animate}
            />
            <CandlestickPath
              key={`${candle.key}-body`}
              path={candle.bodyPath}
              style="fill"
              options={candle.bodyOptions}
              sharedOptions={sharedOptions}
              animate={animate}
            />
          </React.Fragment>
        ))}
      </>
    );
  }

  return (
    <>
      {paths.groups.map((group) => (
        <React.Fragment key={group.key}>
          <CandlestickPath
            key={`${group.key}-wick`}
            path={group.wickPath}
            style="stroke"
            options={group.wickOptions}
            sharedOptions={sharedOptions}
            animate={animate}
          />
          <CandlestickPath
            key={`${group.key}-body`}
            path={group.bodyPath}
            style="fill"
            options={group.bodyOptions}
            sharedOptions={sharedOptions}
            animate={animate}
          />
        </React.Fragment>
      ))}
    </>
  );
};
