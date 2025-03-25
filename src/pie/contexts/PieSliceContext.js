import React, { useContext, createContext, } from "react";
const PieSliceContext = createContext(undefined);
export const PieSliceProvider = ({ children, slice: _slice, }) => {
    return (React.createElement(PieSliceContext.Provider, { value: { slice: _slice } }, children));
};
export const usePieSliceContext = () => {
    const context = useContext(PieSliceContext);
    if (context === undefined) {
        throw new Error("usePieSliceContext must be used within a PieSliceProvider");
    }
    return context;
};
