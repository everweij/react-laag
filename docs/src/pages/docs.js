import React from "react";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";

import styled from "styled-components";

import Main from "../components/Main";
import TableOfContents from "../components/TableOfContents";

const Base = styled.section`
  margin-top: 76px;
  position: relative;
`;

export default function Docs({ data }) {
  return (
    <Main title="Documentation">
      <Base>
        <h1 style={{ marginBottom: 64, color: "#ffa25f" }}>Documentation</h1>

        <TableOfContents items={data.mdx.tableOfContents.items} />

        <MDXRenderer>{data.mdx.body}</MDXRenderer>
      </Base>
    </Main>
  );
}

export const pageQuery = graphql`
  query {
    mdx(frontmatter: { title: { eq: "docs" } }) {
      body
      tableOfContents
    }
  }
`;
