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
          }
        }
      }
    `
  );

  const metaDescription = site.siteMetadata.description;

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
        }
      ]}
    />
  );
}

export default SEO;
