import React from "react";
import {
  FeaturedBadge,
  ProjectBadge,
  featuredBadgeNames,
} from "formidable-oss-badges";
import { NFLinkButton } from "./nf-link-button";
import { Divider } from "./divider";

export const LandingFeaturedProjects = ({
  heading,
  projects,
  showDivider,
}: {
  heading: string;
  projects: {
    name: string;
    link: string;
    description: string;
    title?: string;
  }[];
  showDivider?: boolean;
}) => (
  <div className="flex flex-col gap-6 text-center md:text-left mx-16 lg:mx-32 xl:mx-64 mt-12 py-12">
    {showDivider && <Divider />}
    <h2 className="my-8 text-4xl font-semibold">{heading}</h2>
    <div className="grid grid-cols-2 gap-12">
      {projects.map(({ name, link, description, title }) => (
        <a
          href={link}
          key={link}
          className="col-span-2 sm:col-span-1 flex flex-col lg:flex-row gap-6 align-center items-center text-theme-2 hover:text-theme-2 dark:text-white dark:hover:text-white"
        >
          {featuredBadgeNames.includes(name.toLocaleLowerCase()) ? (
            <FeaturedBadge
              // @ts-ignore
              name={name}
              isHoverable
              className="lg:basis-1/3 max-w-xs md:justify-self-end"
            />
          ) : (
            <ProjectBadge
              abbreviation={name.slice(0, 2)}
              description={name}
              isHoverable
              color="#F04D21"
              className="lg:basis-1/3 max-w-xs md:justify-self-end"
            />
          )}
          <span className="flex flex-col lg:basis-2/3 text-center md:text-left">
            <span className="text-xl font-semibold capitalize">
              {title || name}
            </span>
            <span className="text-sm max-w-md">{description}</span>
          </span>
        </a>
      ))}
    </div>

    <div className="flex my-8 pt-8 justify-center md:justify-start">
      <NFLinkButton
        link="https://commerce.nearform.com/open-source"
        text="View All Projects"
      />
    </div>
  </div>
);
