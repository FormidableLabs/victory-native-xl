import React, { useContext, createContext, } from "react";
const CartesianChartContext = createContext(undefined);
export const CartesianChartProvider = (props) => {
    const { children, xScale, yScale } = props;
    return (React.createElement(CartesianChartContext.Provider, { value: {
            xScale,
            yScale,
        } }, children));
};
export const useCartesianChartContext = () => {
    const context = useContext(CartesianChartContext);
    if (context === undefined) {
        throw new Error("useCartesianChartContext must be used within a CartesianChartProvider");
    }
    return context;
};
