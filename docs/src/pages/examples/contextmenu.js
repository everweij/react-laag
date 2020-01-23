import React from "react";

import Main from "../../components/ExamplesMain";

import Example from "../../examples/ContextMenu";

export default function ContextMenu() {
  return (
    <Main title="Nested context menus" pageUrl="/examples/contextmenu/">
      <p>Right-click in the grey box to show the menu</p>
      <a href="https://codesandbox.io/s/nested-context-menus-xx52d?fontsize=14">
        <img
          alt="Edit nested-context-menus"
          src="https://codesandbox.io/static/img/play-codesandbox.svg"
        />
      </a>

      <Example />
    </Main>
  );
}
