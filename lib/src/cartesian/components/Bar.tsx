import * as React from "react";
import { Path, type PathProps } from "@shopify/react-native-skia";
import type { PropsWithChildren, ReactNode } from "react";
import type { ChartBounds, PointsArray } from "../../types";
import { AnimatedPath } from "./AnimatedPath";
import { type PathAnimationConfig } from "../../hooks/useAnimatedPath";
import { useBarPath } from "../hooks/useBarPath";
import type { RoundedCorners } from "../../utils/createRoundedRectPath";

type CartesianBarProps = {
  points: PointsArray;
  chartBounds: ChartBounds;
  innerPadding?: number;
  animate?: PathAnimationConfig;
  roundedCorners?: RoundedCorners;
  barWidth?: number;
  barCount?: number;
  textOffsetX?: number;
  textOffsetY?: number;
  children?: ReactNode;
} & Partial<Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">>;

type CustomBarProps = React.SVGAttributes<SVGElement> & {
  x?: number;
  y?: number;
};

export const Bar = ({
  points,
  chartBounds,
  animate,
  innerPadding = 0.25,
  roundedCorners,
  barWidth,
  barCount,
  textOffsetX = 0,
  textOffsetY = 0,
  children,
  ...ops
}: PropsWithChildren<CartesianBarProps>) => {
  const { path, barPositions } = useBarPath(
    points,
    chartBounds,
    innerPadding,
    roundedCorners,
    barWidth,
    barCount,
  );

  const PathComponent = animate ? AnimatedPath : Path;

  return (
    <>
      <PathComponent
        path={path}
        color={ops.color || "black"}
        {...(Boolean(animate) && { animate })}
        {...ops}
      />
      {barPositions.map((barPosition, index) =>
        React.Children.map(children, (child, childIndex) => {
          if (React.isValidElement(child)) {
            const textX =
              barPosition.x - barWidth! / 2 + textOffsetX + barWidth! / 2;
            const textY = barPosition.y - 20 + textOffsetY + 10;

            const textWidth = child.props.text.length * 6;
            const textHeight = 12;

            return (
              <React.Fragment key={`bar-${index}-child-${childIndex}`}>
                {React.cloneElement(child, {
                  x: textX - textWidth / 2,
                  y: textY + textHeight / 2,
                } as CustomBarProps)}
              </React.Fragment>
            );
          }
          return child;
        }),
      )}
    </>
  );
};
