import { type SkPath } from "@shopify/react-native-skia";
import { type WithDecayConfig, type WithSpringConfig, type WithTimingConfig } from "react-native-reanimated";
export type PathAnimationConfig = ({
    type: "timing";
} & WithTimingConfig) | ({
    type: "spring";
} & WithSpringConfig) | ({
    type: "decay";
} & WithDecayConfig);
export declare const useAnimatedPath: (path: SkPath, animConfig?: PathAnimationConfig) => import("react-native-reanimated").DerivedValue<SkPath>;
