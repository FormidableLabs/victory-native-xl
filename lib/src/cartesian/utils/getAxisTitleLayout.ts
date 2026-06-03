import type { SkFont } from "@shopify/react-native-skia";
import type { AxisTitle, AxisTitlePosition } from "../../types";
import { getTextLayout, type TextLayout } from "../../utils/textLayout";

export const DEFAULT_AXIS_TITLE_OFFSET = 4;
const DEFAULT_AXIS_TITLE_POSITION: AxisTitlePosition = "center";

export type AxisTitleLayout = TextLayout & {
  text: string;
  font?: SkFont | null;
  color?: string;
  offset: number;
  position: AxisTitlePosition;
  hasContent: boolean;
};

export const getAxisTitleLayout = ({
  title,
  font,
}: {
  title?: AxisTitle;
  font?: SkFont | null;
}): AxisTitleLayout => {
  const titleFont = title?.font !== undefined ? title.font : font;
  const text = title?.text ?? "";
  const layout = getTextLayout(text, titleFont);

  return {
    ...layout,
    text,
    font: titleFont,
    color: title?.color,
    offset: title?.offset ?? DEFAULT_AXIS_TITLE_OFFSET,
    position: title?.position ?? DEFAULT_AXIS_TITLE_POSITION,
    hasContent: Boolean(titleFont && text && layout.width > 0),
  };
};

export const getRotatedYAxisTitleBaselineY = ({
  height,
  fontSize,
}: Pick<AxisTitleLayout, "height" | "fontSize">) => {
  const multilineOffset = height - fontSize;
  return multilineOffset > 0 ? -multilineOffset : 0;
};
