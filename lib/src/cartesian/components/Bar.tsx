import * as React from "react";
import {
  Path,
  Rect,
  Text as SkiaText,
  type PathProps,
} from "@shopify/react-native-skia";
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
  textOffsetX?: number; // x축 offset 추가
  textOffsetY?: number; // y축 offset 추가
  children?: ReactNode;
} & Partial<Pick<PathProps, "color" | "blendMode" | "opacity" | "antiAlias">>;

export const Bar = ({
  points,
  chartBounds,
  animate,
  innerPadding = 0.25,
  roundedCorners,
  barWidth,
  barCount,
  textOffsetX = 0, // 기본값 설정
  textOffsetY = 0, // 기본값 설정
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
        React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const rectX = barPosition.x - barWidth! / 2 + textOffsetX;
            const rectY = barPosition.y - 20 + textOffsetY;
            const textX = rectX + barWidth! / 2; // 중앙으로 이동
            const textY = rectY + 10; // 중앙으로 이동

            const textWidth = child.props.text.length * 6; // 임의의 텍스트 너비 계산 (조정 필요)
            const textHeight = 12; // 폰트 크기 기반 높이 (조정 필요)

            return (
              <>
                {React.cloneElement(child, {
                  x: textX - textWidth / 2,
                  y: textY + textHeight / 2,
                } as any)}
              </>
            );
          }
          return child;
        }),
      )}
    </>
  );
};
