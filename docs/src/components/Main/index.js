import React from "react";
import styled from "styled-components";
import { useStaticQuery } from "gatsby";
import { Helmet } from "react-helmet";

import Top from "../Top";

const Base = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0px 16px 148px 16px;
  /* position: relative; */
`;

export default function Main({ children, title, pageUrl = "" }) {
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
    <>
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

        {/* <meta
          name="google-site-verification"
          content="YTWloHhczGRLE8q0xJZsJRdOdDEY3efYKmyqV--NHFc"
        /> */}
      </Helmet>
      <Base>
        <Top />
        {children}
      </Base>
    </>
  );
}
