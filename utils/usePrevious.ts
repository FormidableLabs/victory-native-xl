import * as React from "react";

export function usePrevious<T>(value: T): T | undefined {
  const ref = React.useRef<T>(value);

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
