import React from "react";
import { Link } from "gatsby";
import Main from "../../components/DocsMain";

export default function Resources() {
  return (
    <Main title="Resources" pageUrl="/docs/resources/">
      <h1>Resources</h1>

      <h2>Tutorials</h2>

      <ul>
        <li>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.erikverweij.dev/blog/introducing-react-laag/"
          >
            Introducing react-laag
          </a>
        </li>
        <li>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.erikverweij.dev/blog/circular-menus-with-react-laag-framer-motion/"
          >
            Circular menu's with react-laag and Framer Motion
          </a>
        </li>
        <li>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://dev.to/everweij/accessible-and-adaptive-select-menu-s-using-react-laag-and-downshift-abn"
          >
            Accessible and adaptive select menu's using react-laag and downshift
          </a>
        </li>
      </ul>
    </Main>
  );
}
