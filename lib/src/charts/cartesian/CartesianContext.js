// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from "react";
import { SharedValue } from "react-native-reanimated";
import { MassagedData, ViewWindow } from "../../types";
export const CartesianContext = React.createContext({
    data: { x: [], y: {} },
    inputWindow: {},
    outputWindow: {},
    tracking: {
        isActive: false,
        x: null,
    },
});
export const useCartesianContext = () => React.useContext(CartesianContext);
