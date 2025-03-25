import React from "react";
import { Path } from "@shopify/react-native-skia";
import { useSliceAngularInsetPath } from "./hooks/useSliceAngularInsetPath";
import { usePieSliceContext } from "./contexts/PieSliceContext";
import { AnimatedPath } from "../cartesian/components/AnimatedPath";
export const PieSliceAngularInset = (props) => {
    const { angularInset, children, animate, ...rest } = props;
    const { slice } = usePieSliceContext();
    const [path, insetPaint] = useSliceAngularInsetPath({ slice, angularInset });
    // If the path is empty, don't render anything
    if (path.toSVGString() === "M0 0L0 0M0 0L0 0") {
        return null;
    }
    if (angularInset.angularStrokeWidth === 0) {
        return null;
    }
    const Component = animate ? AnimatedPath : Path;
    return (React.createElement(Component, { path: path, paint: insetPaint, animate: animate, ...rest }, children));
};
