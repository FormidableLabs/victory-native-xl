import type { SidedNumber } from "../types";
export declare const valueFromSidedNumber: (sidedNumber: SidedNumber | undefined, side: keyof Exclude<SidedNumber, number>, defaultValue?: number) => number;
