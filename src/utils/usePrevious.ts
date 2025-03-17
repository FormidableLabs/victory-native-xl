import * as React from "react";

export function usePrevious<T>(value: T) {
  const ref = React.useRef<T>(value);

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
