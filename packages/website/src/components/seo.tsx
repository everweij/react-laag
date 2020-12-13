import React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

function SEO() {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            keywords
            image
          }
        }
      }
    `
  );

  const metaDescription = site.siteMetadata.description;

  const img = `${site.siteMetadata.siteUrl}${site.siteMetadata.image}`;

  const fullTitle = site.siteMetadata.title;

  return (
    <Helmet
      htmlAttributes={{
        lang: "en"
      }}
      title={`${fullTitle} | ${metaDescription}`}
      meta={[
        {
          name: `description`,
          content: metaDescription
        },
        {
          property: `og:title`,
          content: fullTitle
        },
        {
          property: `og:description`,
          content: metaDescription
        },
        {
          property: `og:type`,
          content: `website`
        },
        {
          property: `og:image`,
          content: img
        },
        {
          name: `twitter:card`,
          content: `summary`
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author
        },
        {
          name: `twitter:title`,
          content: fullTitle
        },
        {
          name: `twitter:description`,
          content: metaDescription
        },
        {
          name: `twitter:image`,
          content: img
        },
        {
          name: "keywords",
          content: site.siteMetadata.keywords.join(", ")
        }
      ]}
    />
  );
}

export default SEO;
