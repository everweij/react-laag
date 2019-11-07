import React from "react";

//import the Prism package
import Prism from "prismjs";

// The code we will be displaying
const code = `const foo = 'foo';
const bar = 'bar';
console.log(foo + bar);
`;

export default function Test() {
  React.useEffect(() => {
    // call the highlightAll() function to style our code blocks
    Prism.highlightAll();
  });

  return (
    <div style={{}}>
      <h2>
        Using Prism to style <code>code blocks</code> in Gatsby
      </h2>
      <div className="gatsby-highlight">
        <pre>
          <code className="language-jsx">{code}</code>
        </pre>
      </div>
    </div>
  );
}
