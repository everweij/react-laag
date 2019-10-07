import React from "react";
import styled from "styled-components";
import { Link } from "gatsby";

import GithubIcon from "../GithubIcon";

import logo from "../../images/logo.png";

const Base = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 0px;

  & ul {
    margin: 0;
    display: flex;
    align-items: center;
    font-weight: 400;
    color: var(--lighter);
  }

  & li {
    list-style: none;
    vertical-align: middle;

    & a {
      text-decoration: none;

      &:hover {
        color: black;
      }
    }
  }

  & li:last-child {
    margin-left: 32px;
  }

  & svg {
    fill: var(--lighter);
    cursor: pointer;

    &:hover {
      fill: var(--text);
    }
  }
`;

const Logo = styled.div`
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

export default function Top() {
  return (
    <Base>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Logo>
          <img alt="logo" src={logo} style={{ width: 40 }} />
          <div>react-laag</div>
        </Logo>
      </Link>

      <ul>
        <li>
          <Link to="/docs">Docs</Link>
        </li>
        <li>
          <a href="https://github.com/everweij/react-laag">
            <GithubIcon width={32} />
          </a>
        </li>
      </ul>
    </Base>
  );
}
