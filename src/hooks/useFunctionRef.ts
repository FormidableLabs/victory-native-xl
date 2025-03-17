import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFunctionRef = <Fn extends (...args: any[]) => any>(fn?: Fn) => {
  const fnRef = React.useRef(fn);
  React.useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  return fnRef;
};
