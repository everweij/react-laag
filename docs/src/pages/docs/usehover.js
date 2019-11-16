import React from "react";

import Main from "../../components/DocsMain";
import PropTitle from "../../components/PropTitle";
import Code from "../../components/Code";

import zoom from "../../images/zoom.svg";

export default function UseHover() {
  return (
    <Main title="useHover" pageUrl="/docs/usehover/">
      <h1>useHover</h1>

      <Code>{`import { useHover } from 'react-laag';`}</Code>

      <p>
        When working with tooltips for instance, you sometimes want specific
        behavior regarding timing. If you show a tooltip immediately when the
        mouse enters the trigger element, the user may perceive the tooltip as
        annoying. That's why it's common to only show a tooltip after a certain
        time has passed while the user has been hovering over the trigger
        element. <code>useHover</code> is a hook which helps you control this
        kind of behavior.
      </p>

      <div className="label">Type</div>
      <div className="type">
        (<span className="arg">config?</span>:{" "}
        <span className="entity linked">UseHoverConfig</span>): [
        <span className="entity">boolean</span>,{" "}
        <span className="entity linked">HoverProps</span>]
      </div>

      <div className="detail">
        <div className="title">UseHoverConfig</div>
        <img alt="details" src={zoom} />

        <PropTitle>delayEnter</PropTitle>
        <div className="type">
          <span className="entity">number</span>
        </div>

        <div className="label">Default</div>
        <div style={{ fontSize: 14, color: "black" }}>0</div>

        <p>
          Amount of time in ms that should pass while hovering in order to show
          the layer.
        </p>

        <PropTitle>delayLeave</PropTitle>
        <div className="type">
          <span className="entity">number</span>
        </div>

        <div className="label">Default</div>
        <div style={{ fontSize: 14, color: "black" }}>0</div>

        <p>
          Amount of time in ms that should pass while user has left the element
          before the layer hides again .
        </p>

        <PropTitle>hideOnScroll</PropTitle>
        <div className="type">
          <span className="entity">boolean</span>
        </div>

        <div className="label">Default</div>
        <div style={{ fontSize: 14, color: "black" }}>true</div>

        <p>
          Determines whether the layer should hide when the user starts
          scrolling. Default is true.
        </p>
      </div>

      <div className="detail">
        <div className="title">HoverProps</div>
        <img alt="details" src={zoom} />

        <PropTitle>onMouseEnter</PropTitle>
        <div className="type" style={{ marginBottom: 24 }}>
          (<span className="arg">event</span>:{" "}
          <span className="entity">MouseEvent</span>): void
        </div>

        <PropTitle>onMouseLeave</PropTitle>
        <div className="type">
          (<span className="arg">event</span>:{" "}
          <span className="entity">MouseEvent</span>): void
        </div>
      </div>

      <h3>Example</h3>
      <Code>
        {`
function UseHoverExample() {
  const [show, hoverProps] = useHover({ delayEnter: 300, delayLeave: 200 });

  return (
    <ToggleLayer
      isOpen={show}
      renderLayer={({ layerProps }) =>
        isOpen ? <Layer {...layerProps} /> : null
      }
      // rest of props...
    >
      {({ triggerRef }) => (
        <div ref={triggerRef} {...hoverProps}>
          hover me!
        </div>
      )}
    </ToggleLayer>
  );
}
      `.trim()}
      </Code>
    </Main>
  );
}
