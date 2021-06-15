import * as React from "react";
import * as ReactDOM from "react-dom";

import { TestCase } from "./TestCase";
import { OptionsPanel } from "./OptionsPanel";
import { baseOptions, TestCaseOptions } from "./options";

function App() {
  const [state, setState] = React.useState<TestCaseOptions>({ ...baseOptions });

  return (
    <>
      <OptionsPanel options={state} onOptionsChange={setState} />
      <TestCase {...state} />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
