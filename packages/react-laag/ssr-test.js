const React = require("react");
const ReactDOMServer = require("react-dom/server");
const { useLayer } = require("./dist");

function Test({ initialOpen }) {
  const [isOpen] = React.useState(initialOpen);

  const { layerProps, triggerProps, renderLayer } = useLayer({
    isOpen
  });

  return React.createElement(
    "div",
    {},
    isOpen && renderLayer(React.createElement("div", layerProps, "layer")),
    React.createElement("div", triggerProps, "trigger")
  );
}

for (const initialOpen of [false, true]) {
  ReactDOMServer.renderToString(React.createElement(Test, { initialOpen }));
}

console.log("\n SSR TEST: SUCCESS\n");
