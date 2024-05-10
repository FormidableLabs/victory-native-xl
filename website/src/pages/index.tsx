import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import { LandingHero } from "../components/landing/landing-hero";
import { LandingBanner } from "../components/landing/landing-banner";
import { LandingFeaturedProjects } from "../components/landing/landing-featured-projects";
import { LandingFeatures } from "../components/landing/landing-features";
import {
  feature1,
  feature2,
  feature3,
} from "../components/landing/landing-images";
import { Divider } from "../components/landing/divider";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <div className="dark:bg-gray-500 bg-gray-200 dark:text-white text-theme-2">
        <LandingHero
          heading={siteConfig.title}
          body={siteConfig.tagline}
          copyText="npm install groqd"
          navItems={[
            { link: "/open-source/groqd/docs", title: "Documentation" },
            { link: "/open-source/groqd/arcade", title: "Demo" },
            {
              link: "https://github.com/FormidableLabs/groqd",
              title: "Github",
            },
          ]}
        ></LandingHero>
      </div>
      <LandingFeatures
        heading="Features"
        list={[
          {
            imgSrc: feature1,
            alt: "Flexible",
            title: "Flexible",
            html: {
              __html: "GROQD maintains the flexibility of GROQ.",
            },
          },
          {
            imgSrc: feature2,
            alt: "Runtime Safe",
            title: "Runtime Safe",
            html: {
              __html:
                "Automatically layers in the runtime safety of <a href='https://github.com/colinhacks/zod' target='_blank'>Zod</a>.",
            },
          },
          {
            imgSrc: feature3,
            alt: "Type Safe",
            title: "Type Safe",
            body: "Leverages the type safety of TypeScript.",
          },
        ]}
      />
      <Divider />
      <div className="flex gap-20 flex-col md:flex-row mx-16 lg:mx-32 xl:mx-64">
        <LandingBanner
          heading="Get Started"
          body="Get the flexibility of GROQ with the runtime/type safety of Zod and TypeScript today!"
          cta={{ link: "/open-source/groqd/docs", text: "Documentation" }}
        />
        <LandingBanner
          heading="GROQD Arcade"
          body="View sample queries, and play with live examples in the GROQD Arcade."
          cta={{ link: "/open-source/groqd/arcade", text: "Arcade" }}
        />
      </div>
      <Divider />
      <LandingFeaturedProjects
        heading="Other Open Source"
        projects={[
          {
            name: "nuka",
            link: "https://github.com/FormidableLabs/nuka-carousel", // todo: update with docs site once one exists
            description:
              "Small, fast and accessibility-first React carousel library with easily customizable UI and behavior to fit your brand and site.",
          },
          {
            name: "figlog",
            link: "https://www.figma.com/community/widget/1293230657540297914",
            description:
              "The easiest and most efficient way to document team decisions and the evolution of your changes in Figma.",
          },
          {
            name: "envy",
            link: "https://github.com/FormidableLabs/envy", // todo: update with docs site once one exists
            description:
              "Envy will trace the network calls from every application in your stack and allow you to view them in a central place.",
          },
          {
            name: "victory",
            link: "https://commerce.nearform.com/open-source/victory/",
            description:
              "React.js components for modular charting and data visualization.",
          },
        ]}
      />
    </Layout>
  );
}
