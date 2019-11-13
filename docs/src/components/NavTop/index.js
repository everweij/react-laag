import React from "react";
import styled from "styled-components";
import media from "styled-media-query";
import { Link } from "gatsby";

import logo from "../NavLeft/laag-logo2.png";

import { TOP_HEIGHT, LEFT_WIDTH } from "../constants";

import GithubIcon from "../GithubIcon";

const Base = styled.nav`
  transition: border-bottom 0.3s ease-in-out;
  position: fixed;
  top: 0;
  height: ${TOP_HEIGHT}px;
  left: ${LEFT_WIDTH}px;
  right: 0px;
  background-color: white;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0px 32px;
  z-index: 999;

  ${media.lessThan("740px")`
    left: 0;
    padding: 0px 16px;
    justify-content: space-between;

    & .GH {
      display: none;
    }
    & .builder {
      display: none;
    }
  `}
`;

const NavItems = styled.ul`
  margin: 0;
  display: flex;
  align-items: center;
  padding: 0;

  /* & > *:not(:last-child) {
    margin-right: 24px;
  } */
`;

const NavItem = styled.li`
  list-style: none;
  font-size: 16px;
  font-weight: 400;
  color: var(--lighter);
  cursor: pointer;

  & a {
    text-decoration: none;
    color: var(--text);
  }
  & a:not(.active):hover {
    text-decoration: underline;
    color: black;
  }

  & .active {
    color: black;
    font-weight: 500;
  }
`;

const Logo = styled(Link)`
  display: none;

  ${media.lessThan("740px")`
    display: flex;
    align-self: center;
  `}
`;

// const Dot = styled.div`
//   width: 6px;
//   height: 6px;
//   border-radius: 50%;
//   background-color: #b7bdc3;
//   opacity: 0.5;
// `;

export default function NavTop() {
  const [showBorder, setBorder] = React.useState(false);

  React.useEffect(() => {
    function onScroll() {
      if (window.scrollY > 0 && !showBorder) {
        setBorder(true);
        return;
      }

      if (window.scrollY === 0 && showBorder) {
        setBorder(false);
        return;
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [showBorder]);

  return (
    <Base
      style={{
        borderBottom: `1px solid ${
          showBorder ? "var(--greybg-border)" : "transparent"
        }`
      }}
    >
      <Logo to="/">
        <img
          alt="react-laag logo"
          style={{ width: 32, objectFit: "contain", maxHeight: 40 }}
          src={logo}
        />
      </Logo>
      <NavItems>
        <NavItem style={{ marginRight: 32 }}>
          <Link
            getProps={({ isPartiallyCurrent }) => ({
              className: isPartiallyCurrent ? "active" : undefined
            })}
            to="/docs/"
          >
            Documentation
          </Link>
        </NavItem>
        {/* <Dot /> */}
        <NavItem>
          <Link activeClassName="active" to="/examples/">
            Examples
          </Link>
        </NavItem>
        {/* <Dot /> */}
        <NavItem className="builder" style={{ marginLeft: 32 }}>
          <Link activeClassName="active" to="/builder/">
            Builder
          </Link>
        </NavItem>
      </NavItems>
      <div className="GH">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/everweij/react-laag"
          style={{ textDecoration: "none" }}
        >
          <GithubIcon
            width={28}
            style={{ marginLeft: 32, fill: "var(--lighter)" }}
          />
        </a>
      </div>
    </Base>
  );
}
