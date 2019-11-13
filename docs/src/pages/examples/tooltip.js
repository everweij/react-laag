import React from "react";

import Main from "../../components/ExamplesMain";

import Example from "../../examples/Tooltip";

export default function Tooltip() {
  return (
    <Main title="Tooltip" pageUrl="/examples/tooltip/">
      <p>Hover over the blue keywords to trigger a tooltip</p>
      <a href="https://codesandbox.io/s/tooltip-pt2en?fontsize=14">
        <img
          alt="Edit tooltip"
          src="https://codesandbox.io/static/img/play-codesandbox.svg"
        />
      </a>

      <Example />
    </Main>
  );
}
