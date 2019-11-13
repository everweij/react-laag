import React from "react";

import Main from "../../components/ExamplesMain";

import Example from "../../examples/ColorPicker";

export default function ColorPicker() {
  return (
    <Main title="Color Picker" pageUrl="/examples/colorpicker/">
      <p>Click on a box and give it a color!</p>
      <a href="https://codesandbox.io/s/color-picker-boxes-853ix?fontsize=14">
        <img
          alt="Edit color-picker-boxes"
          src="https://codesandbox.io/static/img/play-codesandbox.svg"
        />
      </a>

      <Example />
    </Main>
  );
}
