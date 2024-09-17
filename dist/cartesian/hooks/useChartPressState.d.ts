import { type SharedValue } from "react-native-reanimated";
import type { InputFieldType } from "../../types";
export declare const useChartPressState: <Init extends ChartPressStateInit>(initialValues: Init) => {
    state: ChartPressState<Init>;
    isActive: boolean;
};
type ChartPressStateInit = {
    x: InputFieldType;
    y: Record<string, number>;
};
export type ChartPressState<Init extends ChartPressStateInit> = {
    isActive: SharedValue<boolean>;
    x: {
        value: SharedValue<Init["x"]>;
        position: SharedValue<number>;
    };
    y: Record<keyof Init["y"], {
        value: SharedValue<number>;
        position: SharedValue<number>;
    }>;
};
export {};
