import * as React from "react";
import { makeMutable, runOnJS, useAnimatedReaction } from "react-native-reanimated";
export const useChartPressState = (initialValues) => {
    const keys = Object.keys(initialValues.y).join(",");
    const state = React.useMemo(() => {
        return {
            isActive: makeMutable(false),
            matchedIndex: makeMutable(-1),
            x: { value: makeMutable(initialValues.x), position: makeMutable(0) },
            y: Object.entries(initialValues.y).reduce((acc, [key, initVal]) => {
                acc[key] = {
                    value: makeMutable(initVal),
                    position: makeMutable(0),
                };
                return acc;
            }, {}),
            yIndex: makeMutable(-1), // used for stacked bar charts
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keys]);
    const isActive = useIsPressActive(state);
    return { state, isActive };
};
const useIsPressActive = (value) => {
    const [isPressActive, setIsPressActive] = React.useState(() => value.isActive.value);
    useAnimatedReaction(() => value.isActive.value, (val, oldVal) => {
        if (val !== oldVal)
            runOnJS(setIsPressActive)(val);
    });
    return isPressActive;
};
