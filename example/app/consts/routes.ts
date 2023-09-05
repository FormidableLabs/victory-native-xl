export const ChartRoutes: {
  title: string;
  description: string;
  path: string;
}[] = [
  {
    title: "Line Chart",
    description:
      "This chart shows off a line with scatter points. This view also features Victory’s extensive customization options for the grid, axis chart, colors, and curve.",
    path: "/line-chart",
  },
  {
    title: "Bar Chart",
    description:
      "This is a single Bar chart in Victory that supports customized spacing between each bar.",
    path: "/bar-chart",
  },
  {
    title: "Bar Group",
    description:
      "This chart demonstrates grouping and displaying multiple sets of data in a Bar chart. Victory supports customizing the spacing between each bar inside the group and spacing around the groups.",
    path: "/bar-group",
  },
  {
    title: "Custom Drawing",
    description:
      "Victory provides the developer full access to all the transformed data points. This chart shows off using that data to draw custom shapes using Skia directly in Victory.",
    path: "/custom-drawing",
  },
  {
    title: "Stock Price",
    description:
      "This chart shows off Victory’s support for large datasets and multi-touch interactions. You can use Victory’s active press array to support single or multi-touch.",
    path: "/stock-price",
  },
  {
    title: "Ordinal Data",
    description:
      "This chart shows off ordinal data and touch events. Tap different x axis points to see the highlighted dot move. The color changes based on interpolating the color from the transformed and range data.",
    path: "/ordinal-data",
  },
  // // Guides from the docs
  // {
  //   title: "Getting Started",
  //   description:
  //     "Basic chart example with a line chart and a tooltip. Referenced in Getting Started documentation",
  //   path: "/guides/getting-started",
  // },
  // {
  //   title: "Multi Press",
  //   description: "Guide for supporting multi-press interactions.",
  //   path: "/guides/multi-press",
  // },
];

export const descriptionForRoute = (path: string) =>
  ChartRoutes.find((r) => r.path.includes(path))?.description || "";
