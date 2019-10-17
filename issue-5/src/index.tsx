import * as React from "react";
import { render } from "react-dom";
import { Example } from "./Example";

import "./styles.css";

const App = () => <Example />;

render(<App />, document.getElementById("root"));
