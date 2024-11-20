/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    "introduction",
    "getting-started",
    {
      type: "category",
      label: "Cartesian Charts",
      collapsed: false,
      collapsible: false,
      items: [
        "cartesian/cartesian-chart",
        "cartesian/chart-gestures",

        {
          type: "category",
          label: "Guides",
          items: [
            "cartesian/guides/basic-bar-chart",
            "cartesian/guides/multi-press",
            "cartesian/guides/custom-bars",
          ],
        },

        {
          type: "category",
          label: "Line Paths",
          items: ["cartesian/line/line", "cartesian/line/use-line-path"],
        },
        {
          type: "category",
          label: "Area Paths",
          items: [
            "cartesian/area/area",
            "cartesian/area/use-area-path",
            "cartesian/area/stacked-area",
            "cartesian/area/use-stacked-area-paths",
          ],
        },
        {
          type: "category",
          label: "Bar Paths",
          items: [
            "cartesian/bar/bar",
            "cartesian/bar/use-bar-path",
            "cartesian/bar/bar-group",
            "cartesian/bar/use-bar-group-paths",
            "cartesian/bar/stacked-bar",
            "cartesian/bar/use-stacked-bar-paths",
          ],
        },
        {
          type: "category",
          label: "Scatter Paths",
          items: ["cartesian/scatter/scatter"],
        },
      ],
    },
    {
      type: "category",
      label: "Polar Charts",
      collapsed: false,
      collapsible: false,
      items: [
        "polar/polar-chart",
        {
          type: "category",
          label: "Pie / Donut Paths",
          items: [
            "polar/pie/pie-charts",
            "polar/pie/use-slice-path",
            "polar/pie/use-slice-angular-inset-path",
          ],
        },
      ],
    },

    "animated-paths",
  ],
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar: [{ type: "autogenerated", dirName: "." }],
};

module.exports = sidebars;
