// Note: type annotations allow type checking and IDEs autocompletion
import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const title = "Victory Native";
const tagline =
  "A charting library for React Native with a focus on performance and customization.";

const config: Config = {
  title,
  tagline,
  url: "https://commerce.nearform.com/",
  baseUrl:
    // eslint-disable-next-line no-undef
    process.env.VERCEL_ENV === "preview" ? "/" : "/open-source/victory-native",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.png",
  organizationName: "Nearform Commerce",
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
      {
        docs: {
          sidebarPath: "./sidebars.ts",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
        gtag: {
          trackingID: "G-M971D063B9",
        },
      },
    ],
  ],

  plugins: [
    async function myPlugin() {
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

  themeConfig: {
    navbar: {
      title: "VICTORY NATIVE XL",
      logo: {
        alt: "Nearform Commerce",
        src: "img/nearform-logo-white.svg",
      },
      items: [
        {
          href: "https://github.com/FormidableLabs/victory-native-xl",
          className: "header-github-link",
          "aria-label": "GitHub Repository",
          position: "right",
        },
      ],
    },
    footer: {
      logo: {
        alt: "Nearform logo",
        src: "img/nearform-logo-white.svg",
        href: "https://commerce.nearform.com",
        width: 100,
        height: 100,
      },
      copyright: `Copyright © ${new Date().getFullYear()} Nearform`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    metadata: [
      {
        name: "title",
        content: `${title} - React Charting Components`,
      },
      {
        name: "description",
        content: tagline,
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, maximum-scale=1",
      },
      {
        name: "keywords",
        content:
          "victory, victory-native, documentation, react, react-native, charts, charting, data, viz, d3",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: "https://commerce.nearform.com/open-source/victory-native/",
      },
      { property: "og:title", content: `${title} - React Charting Components` },
      {
        property: "og:description",
        content: tagline,
      },
      {
        property: "og:image",
        content:
          "https://commerce.nearform.com/open-source/victory-native/open-graph.png",
      },
      { property: "twitter:card", content: "summary_large_image" },
      {
        property: "twitter:url",
        content: "https://commerce.nearform.com/open-source/victory-native/",
      },
      {
        property: "twitter:title",
        content: `${title} - React Charting Components`,
      },
      {
        property: "twitter:description",
        content: tagline,
      },
      {
        property: "twitter:image",
        content:
          "https://commerce.nearform.com/open-source/victory-native/open-graph.png",
      },
    ],
  } satisfies Preset.ThemeConfig,
};

export default config;
