type BodyOptions<ColorValue> = {
  color?: ColorValue;
};

type WickOptions<ColorValue> = {
  color?: ColorValue;
  strokeWidth?: number;
};

export const resolveCandlestickPathOptions = <
  ColorValue,
  CustomBodyOptions extends BodyOptions<ColorValue>,
  CustomWickOptions extends WickOptions<ColorValue>,
>({
  color,
  wickStrokeWidth,
  options,
}: {
  color: ColorValue;
  wickStrokeWidth: number;
  options: {
    body?: CustomBodyOptions;
    wick?: CustomWickOptions;
  };
}) => ({
  bodyOptions: {
    ...options.body,
    color: options.body?.color ?? color,
  },
  wickOptions: {
    ...options.wick,
    color: options.wick?.color ?? color,
    strokeWidth: options.wick?.strokeWidth ?? wickStrokeWidth,
  },
});
