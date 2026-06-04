import * as React from "react";
import {
  CartesianChart,
  createParagraphLabelRenderer,
  type CreateParagraphLabelRendererOptions,
} from "victory-native";

const DATA = [
  { category: "東京", value: 42 },
  { category: "القاهرة", value: 18 },
];

const options: CreateParagraphLabelRendererOptions<string> = {
  textStyle: {
    fontFamilies: ["Inter"],
    fontSize: 12,
  },
  maxWidth: ({ value, text }) => {
    value.toUpperCase();
    return Math.max(40, text.length * 12);
  },
};

const categoryParagraphRenderer = createParagraphLabelRenderer(options);
const valueParagraphRenderer = createParagraphLabelRenderer<number>({
  textStyle: {
    fontSize: 12,
  },
  maxWidth: ({ value }) => {
    value.toFixed(0);
    return 48;
  },
});

export function ParagraphAxisLabelRendererTypes() {
  return (
    <CartesianChart
      orientation="horizontal"
      data={DATA}
      xKey="category"
      yKeys={["value"]}
      xAxis={{
        labelRenderer: valueParagraphRenderer,
      }}
      yAxis={[
        {
          labelRenderer: categoryParagraphRenderer,
        },
      ]}
    >
      {() => null}
    </CartesianChart>
  );
}
