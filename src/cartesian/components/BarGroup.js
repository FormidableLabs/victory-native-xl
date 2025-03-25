import * as React from "react";
import { Path } from "@shopify/react-native-skia";
import { AnimatedPath } from "./AnimatedPath";
import { useBarGroupPaths } from "../hooks/useBarGroupPaths";
import { useFunctionRef } from "../../hooks/useFunctionRef";
export function BarGroup({ betweenGroupPadding = 0.25, withinGroupPadding = 0.25, chartBounds, roundedCorners, children, onBarSizeChange, barWidth: customBarWidth, barCount, }) {
    // Collect the bar props
    const bars = [];
    React.Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
            if (child.type === BarGroupBar) {
                bars.push(child.props);
            }
        }
    });
    const { paths, barWidth, groupWidth, gapWidth } = useBarGroupPaths(bars.map((bar) => bar.points), chartBounds, betweenGroupPadding, withinGroupPadding, roundedCorners, customBarWidth, barCount);
    // Handle bar size change
    const onBarSizeChangeRef = useFunctionRef(onBarSizeChange);
    React.useEffect(() => {
        onBarSizeChangeRef.current?.({ barWidth, groupWidth, gapWidth });
    }, [barWidth, gapWidth, groupWidth, onBarSizeChangeRef]);
    // If no bars, short-circuit
    const firstBar = bars[0];
    if (!firstBar)
        return null;
    return bars.map((props, i) => React.createElement(BarGroupBar, {
        ...props,
        // @ts-ignore
        __path: paths[i],
        key: i,
    }));
}
BarGroup.Bar = BarGroupBar;
function BarGroupBar(props) {
    const { animate, ...rest } = props;
    // Props that come from BarGroup but aren't exposed publicly.
    // @ts-ignore
    const path = props.__path;
    return React.createElement(animate ? AnimatedPath : Path, {
        path,
        style: "fill",
        color: "red",
        ...rest,
        ...(Boolean(animate) && { animate }),
    });
}
