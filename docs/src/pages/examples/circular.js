import React from "react";

import Main from "../../components/ExamplesMain";

import Example from "../../examples/CircularMenu";

export default function Circular() {
  return (
    <Main title="Circular menu" pageUrl="/examples/circular/">
      <p>
        Open the menu by clicking on the green button. Try to scroll arround to
        see the menu-items reacting to the layer-side's changes.
      </p>
      <a href="https://codesandbox.io/s/circular-menu-autoadjust-m9zi5?fontsize=14">
        <img
          alt="Edit circular-menu-autoadjust"
          src="https://codesandbox.io/static/img/play-codesandbox.svg"
        />
      </a>
      <Example />
    </Main>
  );
}
