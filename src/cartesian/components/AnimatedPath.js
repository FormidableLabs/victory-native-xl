import * as React from "react";
import { Path } from "@shopify/react-native-skia";
import { isSharedValue, makeMutable, } from "react-native-reanimated";
import isEqual from "react-fast-compare";
import { usePrevious } from "../../utils/usePrevious";
import { useAnimatedPath, } from "../../hooks/useAnimatedPath";
/**
 * IMPORTANT!
 * For some reason, Skia doesn't like mixing shared and non-shared values?
 * Things seem to crash if you mix a derived value for the path with e.g. strings for color.
 * We do a little bit of gymnastics to make sure that all props are shared values.
 */
export function AnimatedPath({ path, animate, children, ...rest }) {
    const p = useAnimatedPath(path, animate);
    const animProps = React.useMemo(() => {
        const vals = {};
        syncPropsToSharedValues(rest, vals);
        return vals;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const prevRest = usePrevious(rest);
    // Sync props to shared values when values change
    React.useEffect(() => {
        if (!isEqual(rest, prevRest)) {
            syncPropsToSharedValues(rest, animProps);
        }
    }, [rest, prevRest, animProps]);
    return (React.createElement(Path, { path: p, ...animProps }, children));
}
/**
 * Sync prop values to a map of prop -> shared values
 */
const syncPropsToSharedValues = (props, sharedValues) => {
    const keysToRemove = new Set(Object.keys(sharedValues));
    for (const key in props) {
        keysToRemove.delete(key);
        const propVal = props[key];
        const sharVal = sharedValues[key];
        // Shared value missing, create it
        if (!sharVal) {
            sharedValues[key] = isSharedValue(propVal)
                ? propVal
                : makeMutable(propVal);
        }
        // Shared value exists, update it if not already a shared value
        else if (!isSharedValue(propVal)) {
            sharVal.value = propVal;
        }
    }
    // Remove keys that didn't get passed in props
    keysToRemove.forEach((key) => {
        delete sharedValues[key];
    });
};
