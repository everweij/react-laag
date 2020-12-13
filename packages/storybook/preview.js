import "../website/src/prism.css";
import "./main.css";
// eslint-disable-next-line no-unused-vars
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import { CodeBlock } from "./code-block";
import { theme } from "./theme";

export const parameters = {
  docs: {
    components: {
      code: CodeBlock
    },
    theme
  }
};
