import React from "react";

import Main from "../../components/ExamplesMain";

import Example from "../../examples/TextSelection";

export default function TextSelection() {
  return (
    <Main title="Text Selection" pageUrl="/examples/textselection/">
      <p>Select text to edit the inline-styles</p>
      <a href="https://codesandbox.io/s/draftjs-text-selection-5ru5r?fontsize=14">
        <img
          alt="Edit draftjs-text-selection"
          src="https://codesandbox.io/static/img/play-codesandbox.svg"
        />
      </a>

      <Example />
    </Main>
  );
}
