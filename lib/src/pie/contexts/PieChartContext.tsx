import React, {
  useContext,
  createContext,
  useState,
  type PropsWithChildren,
} from "react";
import type { PieLegendPosition } from "../PieChartLegend";
import type { PieSliceData } from "../PieSlice";

interface PieChartContext {
  data: PieSliceData[];
  position: PieLegendPosition;
  setPosition: React.Dispatch<React.SetStateAction<PieLegendPosition>>;
}

const PieChartContext = createContext<PieChartContext | undefined>(undefined);

interface PieChartProviderProps {
  data: PieSliceData[];
}

export const PieChartProvider = (
  props: PropsWithChildren<PieChartProviderProps>,
) => {
  const [position, setPosition] = useState<PieLegendPosition>("bottom");
  const { children, data } = props;

  return (
    <PieChartContext.Provider value={{ data, position, setPosition }}>
      {children}
    </PieChartContext.Provider>
  );
};

export const usePieChartContext = () => {
  const context = useContext(PieChartContext);

  if (context === undefined) {
    throw new Error(
      "usePieChartContext must be used within a PieChartProvider",
    );
  }

  return context;
};
