import React from "react";
import styled from "styled-components";

import Main from "../../components/DocsMain";
// import Note from "../../components/Note";
import Code from "../../components/Code";

import GitHubButton from "react-github-btn";

const Badges = styled.div`
  & > img:not(:last-child) {
    margin-right: 4px;
  }
`;

export default function Docs() {
  return (
    <Main title="Documentation" pageUrl="/docs/">
      <h1>Overview</h1>

      <Badges>
        <img alt="npm" src="https://img.shields.io/npm/v/react-laag.svg" />
        <img
          alt="typescript"
          src="https://img.shields.io/badge/%3C%2F%3E-typescript-blue"
        />
        <img
          alt="bundlephobia"
          src="https://badgen.net/bundlephobia/minzip/react-laag"
        />
        <img
          alt="Weekly downloads"
          src="https://badgen.net/npm/dw/react-laag?color=blue"
        />
      </Badges>

      <GitHubButton
        href="https://github.com/everweij/react-laag"
        data-show-count="true"
        aria-label="Star everweij/react-laag on GitHub"
      />

      <h2>Where is it good for?</h2>
      <p>
        react-laag exposes primitives to build things like tooltips, dropdown
        menu's and pop-overs in React. Basically any kind of layer that can be
        toggled. The keyword here is <b>primitive</b>. It's <i>not</i> a library
        with components that can be instantly used in your app, but more in the
        spirit of tools like <i>react-beautiful-dnd</i> and <i>downshift</i>,
        where a lot of work is being done for you. In other words, you have to
        code the last 25%.
      </p>

      <h2>Why do you need it?</h2>
      <p>
        There are already a great number of libraries on NPM that cover things
        like tooltips and popovers. So, why should you choose react-laag over
        all the others? <br />
        <br />
        If these existing packages fit perfectly in your own UI or design
        system, you need to look no further. However, in many cases they don't
        fit perfectly. Sometimes you want custom behavior or styling that the
        existing component does not offer. When it does support custom behavior
        or styling, you may have to jump through hoops to get there eventually.{" "}
        <br />
        <br />
        This is where react-laag comes in: it offers you flexible tools to build
        components the way you want them to look and behave 💪🏻.
      </p>

      <h2>Features</h2>
      <ul>
        <li>Not opinionated regarding styling or animations</li>
        <li>Highly customizable</li>
        <li>Small footprint</li>
        <li>Zero dependencies</li>
        <li>Built with typescript / ships with typescript definitions</li>
        <li>Integrates well with other libraries</li>
        <li>Automatically adjusts your layer's placement to fit the screen</li>
        <li>Works with nested scroll-containers</li>
        <li>Observes and reacts to changes in dimensions</li>
      </ul>

      <h2>Browser compatibility</h2>
      <p>
        react-laag has been tested on all modern browsers and should also work
        in IE 11.
        <br />
        <br />
        In order to watch elements for resizing, react-laag makes use of{" "}
        <i>ResizeObserver</i>. If your browser does not come with{" "}
        <i>ResizeObserver</i> out of the box, you can inject a polyfill via
        props, ie.:
      </p>
      <Code>
        {`
import ResizeObserver from "resize-observer-polyfill";
import { ToggleLayer } from "react-laag";

<ToggleLayer ResizeObserver={ResizeObserver} />;
        `.trim()}
      </Code>

      <h2>Server-side rendering</h2>
      <p>react-laag is fully compatible with server-side rendering</p>
    </Main>
  );
}
