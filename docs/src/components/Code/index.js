import React from "react";

import Prism from "prismjs";

export default function Code({ lang = "jsx", children, style }) {
  React.useEffect(() => {
    Prism.highlightAll();
  });

  return (
    <div className="gatsby-highlight" style={style}>
      <pre>
        <code className={`language-${lang}`}>{children}</code>
      </pre>
    </div>
  );
}
