import { type ScaleLinear } from "d3-scale";
import type { AxisProps, NumericalFields, PrimitiveViewWindow, SidedNumber, TransformedData, InputFields } from "../../types";
/**
 * This is a fatty. Takes raw user input data, and transforms it into a format
 *  that's easier for us to consume. End result looks something like:
 *  {
 *    ix: [1, 2, 3], // input x values
 *    ox: [10, 20, 30], // canvas x values
 *    y: {
 *      high: { i: [3, 4, 5], o: [30, 40, 50] },
 *      low: { ... }
 *    }
 *  }
 *  This form allows us to easily e.g. do a binary search to find closest output x index
 *   and then map that into each of the other value lists.
 */
export declare const transformInputData: <RawData extends Record<string, unknown>, XK extends keyof InputFields<RawData>, YK extends keyof NumericalFields<RawData>>({ data: _data, xKey, yKeys, outputWindow, axisOptions, domain, domainPadding, }: {
    data: RawData[];
    xKey: XK;
    yKeys: YK[];
    outputWindow: PrimitiveViewWindow;
    axisOptions?: Partial<Omit<AxisProps<RawData, XK, YK>, "xScale" | "yScale">>;
    domain?: {
        x?: [number] | [number, number];
        y?: [number] | [number, number];
    };
    domainPadding?: SidedNumber;
}) => TransformedData<RawData, XK, YK> & {
    xScale: ScaleLinear<number, number>;
    yScale: ScaleLinear<number, number>;
    isNumericalData: boolean;
    xTicksNormalized: number[];
    yTicksNormalized: number[];
};
