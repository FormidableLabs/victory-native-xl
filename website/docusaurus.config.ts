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
          routeBasePath: "/",
          path: "./docs",
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/FormidableLabs/victory-native-xl/tree/master/website",
        },
        theme: {
          customCss: "./src/css/custom.css",
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
    announcementBar: {
      id: "legacy_docs",
      content: `These docs are for version &ge;40 of Victory Native. If you're looking for docs on versions &le;36, please <a href="https://commerce.nearform/open-source/victory/docs/native" rel="noreferrer" target="_blank">see here</a>.`,
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
          href: "https://commerce.nearform.com/",
          className: "header-nearform-link",
          "aria-label": "Nearform Commerce Website",
          position: "right",
          label: "Nearform Commerce Website",
        },
      ],
    },
    footer: {
      style: "dark",
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
