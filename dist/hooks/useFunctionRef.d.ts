import * as React from "react";
export declare const useFunctionRef: <Fn extends (...args: any[]) => any>(fn?: Fn) => React.MutableRefObject<Fn | undefined>;
