import React, {
  useContext,
  createContext,
  useState,
  type PropsWithChildren,
} from "react";
import type { PieLegendPosition } from "../PieChartLegend";

interface PieChartContext {
  position: PieLegendPosition;
  setPosition: React.Dispatch<React.SetStateAction<PieLegendPosition>>;
}

const PieChartContext = createContext<PieChartContext | undefined>(undefined);

interface PieChartProviderProps {}

export const PieChartProvider = ({
  children,
}: PropsWithChildren<PieChartProviderProps>) => {
  const [position, setPosition] = useState<PieLegendPosition>("bottom");

  return (
    <PieChartContext.Provider value={{ position, setPosition }}>
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
