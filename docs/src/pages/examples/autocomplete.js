import React from "react";

import Main from "../../components/ExamplesMain";

import Example from "../../examples/AutoComplete";

export default function AutoComplete() {
  return (
    <Main title="Autocomplete" pageUrl="/examples/autocomplete/">
      <p>
        Try to search for a fruit below.
        <br /> Also try to scroll when the menu is open.
      </p>
      <a href="https://codesandbox.io/s/downshift-rw4hb?fontsize=14">
        <img
          alt="Edit downshift"
          src="https://codesandbox.io/static/img/play-codesandbox.svg"
        />
      </a>

      <Example />
    </Main>
  );
}
