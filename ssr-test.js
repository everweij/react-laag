const React = require("react");
const ReactDOMServer = require("react-dom/server");
const { ToggleLayer } = require("./dist");
const expect = require("expect");

const html = ReactDOMServer.renderToString(
  React.createElement(ToggleLayer, {
    placement: { anchor: "BOTTOM_CENTER" },
    renderLayer: ({ layerProps, isOpen }) =>
      isOpen &&
      React.createElement("div", {
        ...layerProps,
        style: {
          ...layerProps.style,
          width: 200,
          height: 100,
          backgroundColor: "blue"
        }
      }),
    children: ({ triggerRef, toggle }) =>
      React.createElement("div", {
        ref: triggerRef,
        onClick: toggle,
        children: "trigger"
      })
  })
);

expect(html).toEqual("<div>trigger</div>");

console.log("\n SSR TEST: SUCCESS\n");
