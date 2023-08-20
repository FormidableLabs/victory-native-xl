import React, {
  createContext,
  useReducer,
  useContext,
  type PropsWithChildren,
} from "react";
import type { NavigationProp } from "@react-navigation/core";

type State = {
  strokeWidth: number;
  fontSize: number;
  labelOffsetX: number;
  labelOffsetY: number;
  ticksCountX: number;
  ticksCountY: number;
  colors: Record<string, string>;
};

export type OptionsNavigationProp = NavigationProp<{
  "chart-options-modal": { yKeys: string[] };
}>;

type ActionTypes =
  | { type: "SET_STROKE_WIDTH"; payload: number }
  | { type: "SET_FONT_SIZE"; payload: number }
  | { type: "SET_LABEL_OFFSET_X"; payload: number }
  | { type: "SET_LABEL_OFFSET_Y"; payload: number }
  | { type: "SET_TICKS_COUNT_X"; payload: number }
  | { type: "SET_TICKS_COUNT_Y"; payload: number }
  | { type: "SET_COLORS"; payload: Record<string, string> };

const initialState: State = {
  strokeWidth: 4,
  fontSize: 12,
  labelOffsetX: 4,
  labelOffsetY: 4,
  ticksCountX: 5,
  ticksCountY: 10,
  colors: {},
};

const ChartOptionsContext = createContext<{
  state: State;
  dispatch: React.Dispatch<ActionTypes>;
}>({
  state: initialState,
  dispatch: () => {},
});

const chartOptionsReducer = (state: State, action: ActionTypes): State => {
  switch (action.type) {
    case "SET_STROKE_WIDTH":
      return { ...state, strokeWidth: action.payload };
    case "SET_FONT_SIZE":
      return { ...state, fontSize: action.payload };
    case "SET_LABEL_OFFSET_X":
      return { ...state, labelOffsetX: action.payload };
    case "SET_LABEL_OFFSET_Y":
      return { ...state, labelOffsetY: action.payload };
    case "SET_TICKS_COUNT_X":
      return { ...state, ticksCountX: action.payload };
    case "SET_TICKS_COUNT_Y":
      return { ...state, ticksCountY: action.payload };
    case "SET_COLORS":
      return { ...state, colors: action.payload };
    default:
      return state;
  }
};

export const ChartOptionsProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(chartOptionsReducer, initialState);
  return (
    <ChartOptionsContext.Provider value={{ state, dispatch }}>
      {children}
    </ChartOptionsContext.Provider>
  );
};

export const useChartOptionsContext = () => useContext(ChartOptionsContext);
