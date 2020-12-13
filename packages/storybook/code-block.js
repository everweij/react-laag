import * as React from "react";
import Prism from "prismjs";

export function CodeBlock({ children, className }) {
  const ref = React.useRef();

  React.useLayoutEffect(() => {
    Prism.highlightElement(ref.current);
  }, []);

  return (
    <div className="code-highlight">
      <pre>
        <code ref={ref} className={className}>
          {children}
        </code>
      </pre>
    </div>
  );
}
