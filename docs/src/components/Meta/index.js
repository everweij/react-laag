import React from "react";
import { useStaticQuery } from "gatsby";
import { Helmet } from "react-helmet";

export default function Main({ title, pageUrl = "" }) {
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            titlePostfix
            siteUrl
            description
            author
            keywords
            image
          }
        }
      }
    `
  );

  const t = `${title} ${data.site.siteMetadata.titlePostfix}`;

  const description = data.site.siteMetadata.description;

  const img = `${data.site.siteMetadata.siteUrl}${data.site.siteMetadata.image}`;

  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{t}</title>
      <link rel="canonical" href={data.site.siteMetadata.siteUrl + pageUrl} />
      <html lang={"en"} />

      <meta name="description" content={description} />
      <meta name="title" content={t} />
      <meta name="author" content={data.site.siteMetadata.author} />
      <meta
        name="keywords"
        content={data.site.siteMetadata.keywords.join(", ")}
      />
      <meta name="og:url" content={data.site.siteMetadata.siteUrl} />
      <meta name="og:title" content={data.site.siteMetadata.author} />
      <meta name="og:description" content={description} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content="@ErikEngineric" />
      <meta name="twitter:title" content={data.site.siteMetadata.author} />
      <meta name="twitter:description" content={description} />

      <meta name="og:image" content={img} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  );
}
