// Note: type annotations allow type checking and IDEs autocompletion
import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Victory Native",
  tagline:
    "A charting library for React Native with a focus on performance and customization.",
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
          trackingID: "G-999X9XX9XX",
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
    image: "/img/victory-native-social.png",
  } satisfies Preset.ThemeConfig,
};

export default config;
