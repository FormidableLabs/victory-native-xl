import { makeMutable, useSharedValue, } from "react-native-reanimated";
import { scale } from "@shopify/react-native-skia";
import { useEffect } from "react";
import { identity4 } from "../../utils/transform";
export const useChartTransformState = (config) => {
    const origin = useSharedValue({ x: 0, y: 0 });
    const matrix = useSharedValue(identity4);
    const offset = useSharedValue(identity4);
    // This is done in a useEffect to prevent Reanimated warning
    // about setting shared value in the render phase
    useEffect(() => {
        matrix.value = scale(config?.scaleX ?? 1, config?.scaleY ?? 1);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return {
        state: {
            panActive: makeMutable(false),
            zoomActive: makeMutable(false),
            origin,
            matrix,
            offset,
        },
    };
};
