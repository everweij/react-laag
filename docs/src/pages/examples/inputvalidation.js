import React from "react";

import Main from "../../components/ExamplesMain";

import Example from "../../examples/Password";

export default function InputValidation() {
  return (
    <Main title="Input validation" pageUrl="/examples/inputvalidation/">
      <p>
        Try to pick a new password, and see if it is secure enough. <br />
        Scroll arround to see the layer move to fit the screen.
      </p>
      <a href="https://codesandbox.io/s/password-270o7?fontsize=14">
        <img
          alt="Edit password"
          src="https://codesandbox.io/static/img/play-codesandbox.svg"
        />
      </a>

      <Example />
    </Main>
  );
}
