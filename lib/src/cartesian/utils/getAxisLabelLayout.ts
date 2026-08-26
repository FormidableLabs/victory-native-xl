import type { SkFont } from "@shopify/react-native-skia";
import type {
  AxisLabelMeasureArgs,
  AxisLabelMeasurement,
  AxisLabelRenderer,
} from "../../types";
import { getTextLayout } from "../../utils/textLayout";

const normalizeDimension = (value: number | undefined) =>
  Number.isFinite(value) ? Math.max(0, value ?? 0) : 0;

export type AxisLabelLayout<Label> = AxisLabelMeasureArgs<Label> &
  Required<AxisLabelMeasurement> & {
    lines: string[];
  };

export const getAxisLabelLayout = <Label>({
  axis,
  orientation,
  value,
  text,
  index,
  font,
  labelRenderer,
}: AxisLabelMeasureArgs<Label> & {
  font?: SkFont | null;
  labelRenderer?: AxisLabelRenderer<Label>;
}): AxisLabelLayout<Label> => {
  if (labelRenderer) {
    const measurement = labelRenderer.measure({
      axis,
      orientation,
      value,
      text,
      index,
    });
    const fontSize = normalizeDimension(
      measurement.fontSize ?? font?.getSize(),
    );
    const lineHeight = normalizeDimension(
      measurement.lineHeight ?? measurement.fontSize ?? fontSize,
    );

    return {
      axis,
      orientation,
      value,
      text,
      index,
      lines: [text],
      width: normalizeDimension(measurement.width),
      height: normalizeDimension(measurement.height),
      fontSize,
      lineHeight,
    };
  }

  const layout = getTextLayout(text, font);
  return {
    axis,
    orientation,
    value,
    text,
    index,
    ...layout,
  };
};

export const getMaxAxisLabelLayout = <Label>(
  labels: AxisLabelLayout<Label>[],
): Required<AxisLabelMeasurement> => {
  return labels.reduce<Required<AxisLabelMeasurement>>(
    (max, label) => ({
      width: Math.max(max.width, label.width),
      height: Math.max(max.height, label.height),
      fontSize: label.fontSize,
      lineHeight: label.lineHeight,
    }),
    { width: 0, height: 0, fontSize: 0, lineHeight: 0 },
  );
};
