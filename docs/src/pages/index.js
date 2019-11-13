import React from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import media from "styled-media-query";
import logo from "../images/logo.png";
import Main from "../components/Main";
import Button from "../components/Button";
import GHIcon from "../components/GithubIcon";

const Title = styled.h1`
  background: linear-gradient(to top, #ff4b53 0%, #ff9400 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  ${media.lessThan("medium")`
    font-size: 32px !important;
    `}
`;

const Header = styled.header`
  margin-top: 96px;
  margin-bottom: 48px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;

  & > img {
    max-width: 150px;

    ${media.lessThan("medium")`
    max-width: 80px;
    `}
  }

  & h1 {
    font-size: 48px;
  }
  & h2 {
    margin-top: 32px;
  }
`;

const Motto = styled.div`
  color: #444444;

  & span {
    color: var(--text);
    font-weight: 700;
    font-style: italic;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  & > * {
    margin-right: 8px;
    margin-bottom: 8px;
  }
`;

export default () => {
  return (
    <Main title="Home" pageUrl="/">
      <Header>
        <img alt="react-laag logo" src={logo} />
        <Title style={{ marginTop: 8, marginBottom: 48 }}>react-laag</Title>
        <h2 style={{ marginBottom: 16 }}>
          Primitives to build things like tooltips, dropdown menu's and
          pop-overs
        </h2>
        <Motto>
          Basically any kind of layer that can be toggled. Focus on{" "}
          <span>what</span> your layer should look like, and let react-laag take
          care of <span>where</span> and <span>when</span> to show it.
        </Motto>
      </Header>

      <Buttons>
        <Link to="/docs/">
          <Button>View docs</Button>
        </Link>
        <Link to="/builder/">
          <Button>Interactive demo</Button>
        </Link>
        <Link to="/examples/">
          <Button>Examples</Button>
        </Link>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/everweij/react-laag"
          style={{ textDecoration: "none" }}
        >
          <Button
            style={{ minWidth: "auto", display: "flex", alignItems: "center" }}
          >
            <GHIcon width={20} />
          </Button>
        </a>
      </Buttons>
    </Main>
  );
};
