import React from "react";
import styled from "styled-components";

import media from "styled-media-query";

import { Menu } from "styled-icons/boxicons-regular/Menu";

import { Link } from "gatsby";

import { LEFT_WIDTH, TOP_HEIGHT, CONTENT_TOP } from "../constants";

import logo from "./laag-logo2.png";

const Base = styled.aside`
  top: 0;
  bottom: 0;
  left: 0;
  width: ${LEFT_WIDTH}px;
  position: fixed;
  padding-left: 32px;
  background-color: var(--greybg);
  border-right: 1px solid var(--greybg-border);
  box-sizing: border-box;
  z-index: 998;
  transition: transform 0.15s ease-in-out, background-color 0.15s ease-in-out;

  & .toggle {
    display: none;
  }

  ${media.lessThan("740px")`
    transform: translateX(${p => (!p.isOpen ? "calc(-100% + 48px)" : 0)});
    background-color: ${p => (p.isOpen ? "var(--greybg)" : "transparent")};
    border-right: 1px solid ${p =>
      p.isOpen ? "var(--greybg-border)" : "transparent"};

      & .toggle {
        display: block;
      }
  `}
`;

const Head = styled.div`
  height: ${TOP_HEIGHT}px;
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: var(--lighter);

  & > img {
    margin-right: 16px;
    width: 32px;
  }
`;

const Nav = styled.nav`
  margin-top: ${CONTENT_TOP}px;

  ${media.lessThan("740px")`
    margin-top: 36px;
  `}
`;

const Items = styled.ul`
  margin: 0;
  padding: 0;
  margin-bottom: 32px;
`;

const Item = styled.li`
  list-style: none;
  margin: 0;
  padding: 0;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 500;

  & a {
    text-decoration: none;
    color: var(--text);
  }
  & a:not(.active):hover {
    text-decoration: underline;
    color: black;
  }

  & .active {
    color: var(--secondary);
  }
`;

const GroupTitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: var(--light);
  text-transform: uppercase;
  margin-bottom: 6px;
`;

const TOC = styled.div`
  position: absolute;
  top: ${TOP_HEIGHT}px;
  right: 0px;
  z-index: 999;
  padding: 8px 8px;
`;

export default function NavLeft() {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <>
      <Base isOpen={isOpen}>
        <TOC className="toggle" onClick={() => setOpen(!isOpen)}>
          <Menu size={32} color="var(--lighter)" />
        </TOC>
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <Head>
            <img alt="react-laag logo" src={logo} />
            <div>react-laag</div>
          </Head>
        </Link>
        <Nav>
          <Items>
            <Item>
              <Link activeClassName="active" to="/docs/">
                Overview
              </Link>
            </Item>
            <Item>
              <Link activeClassName="active" to="/docs/started/">
                Getting started
              </Link>
            </Item>
            <Item>
              <Link activeClassName="active" to="/docs/resources/">
                Resources
              </Link>
            </Item>
          </Items>

          <GroupTitle>Primitives</GroupTitle>
          <Items>
            <Item>
              <Link activeClassName="active" to="/docs/togglelayer/">
                ToggleLayer
              </Link>
            </Item>

            <Item>
              <Link activeClassName="active" to="/docs/usetogglelayer/">
                useToggleLayer
              </Link>
            </Item>
          </Items>

          <GroupTitle>Utilities</GroupTitle>
          <Items>
            <Item>
              <Link activeClassName="active" to="/docs/usehover/">
                useHover
              </Link>
            </Item>

            <Item>
              <Link activeClassName="active" to="/docs/arrow/">
                Arrow
              </Link>
            </Item>

            <Item>
              <Link activeClassName="active" to="/docs/transition/">
                Transition
              </Link>
            </Item>
          </Items>
        </Nav>
      </Base>
    </>
  );
}
