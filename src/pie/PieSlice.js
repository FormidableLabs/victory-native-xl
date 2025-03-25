import React, {} from "react";
import { Path, } from "@shopify/react-native-skia";
import { useSlicePath } from "./hooks/useSlicePath";
import { usePieSliceContext } from "./contexts/PieSliceContext";
import PieLabel from "./PieLabel";
import { AnimatedPath } from "../cartesian/components/AnimatedPath";
export const PieSlice = ({ children, animate, ...rest }) => {
    const { slice } = usePieSliceContext();
    const path = useSlicePath({ slice });
    let label;
    const childrenArray = React.Children.toArray(children);
    const labelIndex = childrenArray.findIndex((child) => child.type === PieLabel);
    if (labelIndex > -1) {
        label = childrenArray.splice(labelIndex, 1);
    }
    const Component = animate ? AnimatedPath : Path;
    return (React.createElement(React.Fragment, null,
        React.createElement(Component, { path: path, style: "fill", color: slice.color, animate: animate, ...rest }, childrenArray),
        label));
};
