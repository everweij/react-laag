import React from "react";
import styled from "styled-components";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
// import media from "styled-media-query";

import Main from "../components/Main";
import Demo from "../components/Demo";

const Header = styled.header`
  margin-top: 76px;
  margin-bottom: 76px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`;

const Motto = styled.div`
  color: #444444;

  & span {
    color: var(--text);
    font-weight: 700;
    font-style: italic;
  }
`;

export default ({ data }) => {
  return (
    <Main title="Home">
      <Header>
        <h1 style={{ marginBottom: 16 }}>
          Primitive to build things like tooltips, dropdown menu's and pop-overs
        </h1>
        <Motto>
          Basically any kind of layer that can be toggled. Focus on{" "}
          <span>what</span> your layer should look like, and let react-laag take
          care of <span>where</span> and <span>when</span> to show it.
        </Motto>
      </Header>

      <Demo />

      <MDXRenderer>{data.mdx.body}</MDXRenderer>
    </Main>
  );
};

export const pageQuery = graphql`
  query {
    mdx(frontmatter: { title: { eq: "Getting started" } }) {
      body
    }
  }
`;
