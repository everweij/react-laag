import React from "react";

import Main from "../../components/DocsMain";
import Code from "../../components/Code";

export default function UseBreakpoint() {
  return (
    <Main title="useHover" pageUrl="/docs/usehover/">
      <h1>useBreakpoint</h1>

      <Code>{`import { useBreakpoint } from 'react-laag';`}</Code>

      <p>
        Layer's that are tied to a trigger element usually work great on
        desktop, but sometimes the user experience isn't good on mobile devices.
        In order to detect the users viewport size you can use{" "}
        <code>useBreakpoint</code>, which allows you to adjust the layers
        styling and behavior accordingly. Under the hood, this hook makes use of{" "}
        <code>window.matchMedia</code>, which is very performant in checking
        changes in viewport sizes.
      </p>

      <div className="label">Type</div>
      <div className="type">
        (<span className="arg">maxPixels</span>:{" "}
        <span className="entity linked">number</span>):{" "}
        <span className="entity">boolean</span>
      </div>

      <h3>Example</h3>
      <Code>
        {`
function Example() {
  // check if user is on screen with a width of <= 480 pixels
  const isMobile = useBreakpoint(480);

  return (
    <ToggleLayer
      renderLayer={({ layerProps }) =>
        isOpen && (
          <Layer
            ref={layerProps.ref}
            style={{
              ...layerProps.style,
              // pick width depending on 'isMobile'
              width: isMobile ? 400 : 300
            }}
          />
        )
      }
      // rest of props...
    >
      {({ triggerRef, toggle }) => (
        <button ref={triggerRef} onClick={toggle}>
          hover me!
        </button>
      )}
    </ToggleLayer>
  );
}
      `.trim()}
      </Code>
    </Main>
  );
}
