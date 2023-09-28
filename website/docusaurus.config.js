// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Victory Native",
  tagline:
    "A charting library for React Native with a focus on performance and customization.",
  url: "https://formidable.com",
  baseUrl:
    // eslint-disable-next-line no-undef
    process.env.VERCEL_ENV === "preview" ? "/" : "/open-source/victory-native",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.png",
  organizationName: "formidablelabs",
  projectName: "victory-native",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          path: "./docs",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl:
            "https://github.com/FormidableLabs/victory-native-xl/tree/master/website",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  plugins: [
    async function myPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("tailwindcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      announcementBar: {
        id: "supportus",
        content: `These docs are for version 40 of Victory Native. If you're looking for docs on versions <=36, please <a href="https://formidable.com/open-source/victory/docs/native" rel="noreferrer" target="_blank">see here</a>.`,
        textColor: "var(--banner-text)",
        backgroundColor: "var(--banner-bg)",
      },

      navbar: {
        title: "VICTORY NATIVE XL",
        logo: {
          alt: "Victory Native",
          src: "img/victory-icon.svg",
        },
        items: [
          {
            href: "https://github.com/FormidableLabs/victory-native-xl",
            className: "header-github-link",
            "aria-label": "GitHub Repository",
            position: "right",
            label: "GitHub Repository",
          },
          {
            href: "https://formidable.com",
            className: "header-formidable-link",
            "aria-label": "Formidable Website",
            position: "right",
            label: "Formidable Website",
          },
        ],
      },
      footer: {
        style: "dark",
        copyright: `Copyright © ${new Date().getFullYear()} Formidable`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      image: "/img/victory-native-social.png",
    }),
};

module.exports = config;
