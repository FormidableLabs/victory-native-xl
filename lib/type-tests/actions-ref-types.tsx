import * as React from "react";
import { useSharedValue } from "react-native-reanimated";
import {
  CartesianChart,
  type CartesianActionsHandle,
  useChartPressState,
} from "victory-native";

const data = [{ x: 0, y: 1 }];

export function MutableActionsRefTypeFixture() {
  const { state } = useChartPressState({ x: 0, y: { y: 0 } });
  const actionsRef = React.useRef<CartesianActionsHandle<typeof state> | null>(
    null,
  );

  return (
    <CartesianChart
      actionsRef={actionsRef}
      chartPressState={state}
      data={data}
      xKey="x"
      yKeys={["y"]}
    >
      {() => null}
    </CartesianChart>
  );
}

export function SharedValueActionsRefTypeFixture() {
  const { state } = useChartPressState({ x: 0, y: { y: 0 } });
  const actionsRef = useSharedValue<CartesianActionsHandle<
    typeof state
  > | null>(null);

  return (
    <CartesianChart
      actionsRef={actionsRef}
      chartPressState={state}
      data={data}
      xKey="x"
      yKeys={["y"]}
    >
      {() => null}
    </CartesianChart>
  );
}
