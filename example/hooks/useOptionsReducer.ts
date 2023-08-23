import type { AxisLabelPosition } from "lib/src/types";
import type { XAxisSide, YAxisSide } from "victory-native";

type State = {
  strokeWidth: number;
  xLabelOffset: number;
  yLabelOffset: number;
  chartPadding: number;
  fontSize: number;
  yTickCount: number;
  xTickCount: number;
  xAxisSide: XAxisSide;
  yAxisSide: YAxisSide;
  scatterRadius: number;
  xAxisLabelPosition: AxisLabelPosition;
  yAxisLabelPosition: AxisLabelPosition;
  colors: Record<string, string>;
  domainPadding: number;
};

type Action =
  | { type: "SET_STROKE_WIDTH"; payload: number }
  | { type: "SET_X_LABEL_OFFSET"; payload: number }
  | { type: "SET_Y_LABEL_OFFSET"; payload: number }
  | { type: "SET_CHART_PADDING"; payload: number }
  | { type: "SET_FONT_SIZE"; payload: number }
  | { type: "SET_Y_TICK_COUNT"; payload: number }
  | { type: "SET_X_TICK_COUNT"; payload: number }
  | { type: "SET_X_AXIS_SIDE"; payload: XAxisSide }
  | { type: "SET_Y_AXIS_SIDE"; payload: YAxisSide }
  | { type: "SET_SCATTER_RADIUS"; payload: number }
  | { type: "SET_X_AXIS_LABEL_POSITION"; payload: AxisLabelPosition }
  | { type: "SET_Y_AXIS_LABEL_POSITION"; payload: AxisLabelPosition }
  | { type: "SET_COLORS"; payload: Record<string, string> }
  | { type: "SET_DOMAIN_PADDING"; payload: number };

export const optionsReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_STROKE_WIDTH":
      return { ...state, strokeWidth: action.payload };
    case "SET_X_LABEL_OFFSET":
      return { ...state, xLabelOffset: action.payload };
    case "SET_Y_LABEL_OFFSET":
      return { ...state, yLabelOffset: action.payload };
    case "SET_CHART_PADDING":
      return { ...state, chartPadding: action.payload };
    case "SET_FONT_SIZE":
      return { ...state, fontSize: action.payload };
    case "SET_Y_TICK_COUNT":
      return { ...state, yTickCount: action.payload };
    case "SET_X_TICK_COUNT":
      return { ...state, xTickCount: action.payload };
    case "SET_X_AXIS_SIDE":
      return { ...state, xAxisSide: action.payload };
    case "SET_Y_AXIS_SIDE":
      return { ...state, yAxisSide: action.payload };
    case "SET_SCATTER_RADIUS":
      return { ...state, scatterRadius: action.payload };
    case "SET_X_AXIS_LABEL_POSITION":
      return { ...state, xAxisLabelPosition: action.payload };
    case "SET_Y_AXIS_LABEL_POSITION":
      return { ...state, yAxisLabelPosition: action.payload };
    case "SET_COLORS":
      return { ...state, colors: { ...state.colors, ...action.payload } };
    case "SET_DOMAIN_PADDING":
      return { ...state, domainPadding: action.payload };

    default:
      throw new Error(`Unhandled action type`);
  }
};

export const optionsInitialState: State = {
  strokeWidth: 1,
  xLabelOffset: 4,
  yLabelOffset: 4,
  chartPadding: 4,
  fontSize: 12,
  yTickCount: 5,
  xTickCount: 5,
  scatterRadius: 7,
  xAxisSide: "bottom",
  yAxisSide: "left",
  xAxisLabelPosition: "outset",
  yAxisLabelPosition: "outset",
  colors: {},
  domainPadding: 0,
};
