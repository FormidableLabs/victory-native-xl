export const ChartRoutes: {
  title: string;
  description: string;
  path: string;
  url?: string;
}[] = [
  {
    title: "Line Chart",
    description:
      "This chart shows off a line with scatter points. This view also features Victory’s extensive customization options for the grid, axis chart, colors, and curve.",
    path: "/line-chart",
  },
  {
    title: "Constant Line Chart",
    description: "This chart shows off constant lines with scatter points. ",
    path: "/constant-line-chart",
  },
  {
    title: "Bar Chart",
    description:
      "This is a single Bar chart in Victory that supports customized spacing between each bar as well as pan/zoom.",
    path: "/bar-chart",
  },
  {
    title: "Bar Group",
    description:
      "This chart demonstrates grouping and displaying multiple sets of data in a Bar chart. Victory supports customizing the spacing between each bar inside the group and spacing around the groups.",
    path: "/bar-group",
  },
  {
    title: "Bar Group with Tooltip",
    description:
      "This chart demonstrates a Bar Group chart with a custom tooltip.",
    path: "/bar-with-tooltip",
  },
  {
    title: "Negative Bar Charts",
    description:
      "These charts demonstrate how negative values look with Bar, Bar Group and Stacked Bar charts.",
    path: "/negative-bar-charts",
  },
  {
    title: "Bar Charts Custom Bar",
    description: "These charts demonstrate how to customize individual bars.",
    path: "/bar-charts-custom-bars",
  },
  {
    title: "Stacked Bar Charts (Simple)",
    description: "This is a Stacked Bar chart in Victory Native.",
    path: "/stacked-bar-charts",
  },
  {
    title: "Stacked Bar Charts (Complex)",
    description: "More complicated Stacked Bar charts in Victory Native.",
    path: "/stacked-bar-charts-complex",
  },
  {
    title: "Scatter Plot",
    description:
      "This is a Scatter plot in Victory Native that supports custom shapes and sizes.",
    path: "/scatter",
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
  {
    title: "Horizontal bands background",
    description: `Custom horizontal bands background for a chart line, implemented through a custom shader.`,
    path: "/horizontal-bands-line",
  },
  {
    title: "Axis Configuration",
    description:
      "This shows off the various ways to configure custom axis rendering.",
    path: "/axis-configuration",
  },
  {
    title: "Multiple Y Axes",
    description: "This shows how to use multiple y axes in a single chart",
    path: "/multiple-y-axes",
  },
  {
    title: "Custom Shaders",
    description:
      "This chart showcases using custom shaders from Skia, leveraging shader uniforms derived from Reanimated shared values.",
    path: "/custom-shaders",
  },
  {
    title: "Pie Chart",
    description:
      "This is a Pie chart in Victory. It has support for customizing each slice and adding insets as well as pan/zoom",
    path: "/pie-chart",
  },
  {
    title: "Donut Chart",
    description:
      "This is how to make a Donut chart in Victory. It is built off of the Pie chart using the `innerRadius` prop.",
    path: "/donut-chart",
  },
  {
    title: "Pie and Donut Assortment",
    description:
      "This is mixture of Pie and Donut charts, showing off the different ways to customize the charts.",
    path: "/pie-and-donut-charts",
  },
  {
    title: "Dashed Axes",
    description: "This is an Area chart with dashed X and Y axes.",
    path: "/dashed-axes",
  },
  {
    title: "Stacked Area (very simple)",
    description: "This is a very simple Stacked Area chart",
    path: "/stacked-area",
  },
  {
    title: "Stacked Area (complex)",
    description: "This is a more complicated Stacked Area chart",
    path: "/stacked-area-complex",
  },
  {
    title: "Pan Zoom",
    description: "This is an example of pan zoom functionality",
    path: "/pan-zoom",
  },
  {
    title: "Custom Gesture",
    description: "Basic chart example with a custom tap gesture.",
    path: "/custom-gesture",
  },
  {
    title: "Scroll",
    description: "Show example of scrolling chart data.",
    path: "/scroll",
  },
  {
    title: "Axis Images",
    description: "Show example of using images as tick labels.",
    path: "/axis-images",
  },
];

if (__DEV__) {
  ChartRoutes.unshift(
    {
      title: "Getting Started Guide",
      description: "Basic chart example with a line chart and a tooltip.",
      url: "https://formidable.com/open-source/victory-native/getting-started",
      path: "/guides/getting-started",
    },
    {
      title: "Multi-Press Guide",
      description: "Guide for supporting multi-press interactions.",
      url: "https://formidable.com/open-source/victory-native/cartesian/guides/multi-press",
      path: "/guides/multi-press",
    },
    {
      title: "Missing Data",
      description: "Example showing missing data points.",
      path: "/missing-data",
    },
    {
      title: "Scrolling Charts with Gestures",
      description:
        "This page shows multiple charts with gestures inside a scrollview to ensure both platforms allow for this behavior.",
      path: "/scrollview-charts",
    },
  );
}

export const descriptionForRoute = (path: string) =>
  ChartRoutes.find((r) => r.path.includes(path))?.description || "";

export const urlForRoute = (path: string) =>
  ChartRoutes.find((r) => r.path.includes(path))?.url;
