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
  example1,
  example2,
  example3,
  example4,
} from "../components/landing/landing-images";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <LandingHero
        heading={siteConfig.title}
        body={siteConfig.tagline}
        copyText="yarn add victory-native"
        navItems={[
          { link: "/open-source/victory-native/docs", title: "Documentation" },
          {
            link: "https://github.com/FormidableLabs/victory-native-xl",
            title: "Github",
          },
        ]}
      ></LandingHero>
      <LandingFeatures
        heading="Features"
        list={[
          {
            imgSrc: feature1,
            alt: "Flexible",
            title: "Flexible",
            html: {
              __html:
                "Fully contained, reusable data visualization elements are responsible for their own styles and behaviors.",
            },
          },
          {
            imgSrc: feature2,
            alt: "Easy to Use",
            title: "Easy to Use",
            html: {
              __html:
                "Comprehensive component and hook based elements make setting up and configuring a custom chart simple.",
            },
          },
          {
            imgSrc: feature3,
            alt: "Performant",
            title: "Performant",
            body: "A foundation for building high-end data visualizations that can animate at over 100 FPS even on low-end devices.",
          },
        ]}
      />
      <LandingBanner
        heading="Get Started with Examples"
        list={[
          {
            imgSrc: example1,
            alt: "Line",
            title: "Line",
            link: "/open-source/victory-native/docs/cartesian/line/",
          },
          {
            imgSrc: example2,
            alt: "Area",
            title: "Area",
            link: "/open-source/victory-native/docs/cartesian/area/",
          },
          {
            imgSrc: example3,
            alt: "Bar",
            title: "Bar",
            link: "/open-source/victory-native/docs/cartesian/bar/",
          },
          {
            imgSrc: example4,
            alt: "Pie",
            title: "Pie",
            link: "/open-source/victory-native/docs/polar/pie/pie-charts",
          },
        ]}
      />
      <LandingFeaturedProjects
        heading="Other Open Source"
        projects={[
          {
            name: "nuka",
            link: "https://commerce.nearform.com/open-source/nuka-carousel/",
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
            name: "React Native App Auth",
            link: "https://github.com/FormidableLabs/react-native-app-auth",
            description:
              "React native bridge for AppAuth - an SDK for communicating with OAuth2 providers",
          },
          {
            name: "urql",
            link: "https://commerce.nearform.com/open-source/urql/",
            description:
              "The highly customizable and versatile GraphQL client for React, Svelte, Vue, or plain JavaScript, with which you add on features like normalized caching as you grow.",
          },
        ]}
      />
    </Layout>
  );
}
