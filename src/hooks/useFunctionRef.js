import * as React from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFunctionRef = (fn) => {
    const fnRef = React.useRef(fn);
    React.useEffect(() => {
        fnRef.current = fn;
    }, [fn]);
    return fnRef;
};
