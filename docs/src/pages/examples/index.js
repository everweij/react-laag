import React from "react";

import Main from "../../components/ExamplesMain";

import Example from "../../examples/PopoverMenu";

export default function Examples() {
  return (
    <Main title="Popover menu" pageUrl="/examples/">
      <p>
        Click on the button to select an item. Click outside the menu to close
        it. Scroll menu partially out of sight to also close it. Scroll y/x
        while the menu is open to see `autoAdjust` in action.
      </p>
      <a href="https://codesandbox.io/s/popover-menu-bvplm?fontsize=14">
        <img
          alt="Edit popover-menu"
          src="https://codesandbox.io/static/img/play-codesandbox.svg"
        />
      </a>

      <Example />
    </Main>
  );
}
