import React, { useContext, createContext, } from "react";
const PolarChartContext = createContext(undefined);
export const PolarChartProvider = (props) => {
    const { children, data, canvasSize, labelKey, valueKey, colorKey } = props;
    return (React.createElement(PolarChartContext.Provider, { value: {
            data,
            canvasSize,
            labelKey,
            valueKey,
            colorKey,
        } }, children));
};
export const usePolarChartContext = () => {
    const context = useContext(PolarChartContext);
    if (context === undefined) {
        throw new Error("usePolarChartContext must be used within a PolarChartProvider");
    }
    return context;
};
