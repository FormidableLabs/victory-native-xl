import React from "react";

export const LandingBanner = ({
  heading,
  list,
}: {
  heading: string;
  list: {
    imgSrc: string;
    alt: string;
    title: string;
    link: string;
    body?: string;
    html?: { __html: string };
  }[];
}) => (
  <div className="landing-banner w-fill">
    <div className="flex flex-col text-center md:text-left mx-16 lg:mx-32 xl:mx-64 my-12">
      <h2 className="my-8 text-4xl font-semibold">{heading}</h2>
      <ul className="flex flex-col md:flex-row flex-wrap items-start content-center md:content-start justify-items-center justify-between gap-6 md:gap-12 list-none pl-0">
        {list.map(({ alt, body, imgSrc, title, html, link }, i) => (
          <li key={i} className="flex flex-col items-center text-center">
            <a
              href={link}
              className="landing-banner-link flex flex-col items-center text-center"
            >
              <img src={imgSrc} alt={alt} className="max-h-72" />
              <span className="mt-8 text-2xl font-semibold">{title}</span>
              <span
                dangerouslySetInnerHTML={html}
                className="mt-2 text-lg leading-8 mx-3"
              >
                {body}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
