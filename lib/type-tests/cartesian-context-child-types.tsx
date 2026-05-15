import * as React from "react";
import {
  CartesianChart,
  useCartesianChartContext,
  useCartesianTransformContext,
} from "victory-native";

const data = [{ x: 0, y: 1 }];

export function CartesianContextChildTypeFixture() {
  return (
    <CartesianChart data={data} xKey="x" yKeys={["y"]}>
      {() => <ContextAwareChartChild />}
    </CartesianChart>
  );
}

function ContextAwareChartChild() {
  useCartesianChartContext();
  useCartesianTransformContext();
  return null;
}
