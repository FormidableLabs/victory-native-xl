import React, {
  createContext,
  useReducer,
  useContext,
  type PropsWithChildren,
} from "react";
import type { NavigationProp } from "@react-navigation/core";

type State = {
  color1: string;
  color2: string;
  strokeWidth: number;
};

export type OptionsNavigationProp = NavigationProp<{
  "chart-options-modal": { type: "fill" | "stroke" };
}>;

type Action =
  | { type: "SET_COLOR1"; color1: string }
  | { type: "SET_COLOR2"; color2: string }
  | { type: "SET_STROKE_WIDTH"; strokeWidth: number };

const defaultState: State = {
  color1: "#4f46e5",
  color2: "#0d9488",
  strokeWidth: 8,
};

const ChartOptionsContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: defaultState,
  dispatch: () => {},
});

const chartOptionsReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_COLOR1":
      return { ...state, color1: action.color1 };
    case "SET_COLOR2":
      return { ...state, color2: action.color2 };
    case "SET_STROKE_WIDTH":
      return { ...state, strokeWidth: action.strokeWidth };
    default:
      throw new Error("Unsupported action type");
  }
};

export const ChartOptionsProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(chartOptionsReducer, defaultState);
  return (
    <ChartOptionsContext.Provider value={{ state, dispatch }}>
      {children}
    </ChartOptionsContext.Provider>
  );
};

export const useChartOptionsContext = () => useContext(ChartOptionsContext);
