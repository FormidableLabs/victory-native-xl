import { type ScaleLinear } from "d3-scale";
export declare const makeScale: ({ inputBounds, outputBounds, padStart, padEnd, isNice, }: {
    inputBounds: [number, number];
    outputBounds: [number, number];
    padStart?: number;
    padEnd?: number;
    isNice?: boolean;
}) => ScaleLinear<number, number>;
