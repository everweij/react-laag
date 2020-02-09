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
      <p>
        <code>useHover()</code> comes in two variants (overloads): controlled
        vs. uncontrolled. They both share the same configuration, but differ in
        their return-type based on the configuration that is provided. When the{" "}
        <code>onShow</code> option is provided, <code>useHover()</code> will act
        controlled and will only return the{" "}
        <span className="entity linked">HoverProps</span>.
      </p>

      <div className="label">Type</div>
      <div className="type">
        (<span className="arg">config?</span>:{" "}
        <span className="entity linked">UseHoverConfig</span>): [
        <span className="entity">boolean</span>,{" "}
        <span className="entity linked">HoverProps</span>] |{" "}
        <span className="entity linked">HoverProps</span>
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

        <PropTitle>onShow</PropTitle>
        <div className="type">(): void</div>
        <p>
          Function that gets called when <code>useHover</code> has determined
          the layer should be shown.
        </p>

        <PropTitle>onHide</PropTitle>
        <div className="type">(): void</div>
        <p>
          Function that gets called when <code>useHover</code> has determined
          the layer should be hidden.
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
      <div>Uncontrolled with {`<ToggleLayer />`}</div>
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
      <div>controlled with {`useToggleLayer()`}</div>
      <Code>
        {`
function UseHoverExample() {
  const triggerRef = React.useRef();
  const [element, toggleLayerProps] = useToggleLayer(/* layer element here */);
  const hoverProps = useHover({
    delayEnter: 300,
    delayLeave: 200,
    onShow: () => toggleLayerProps.openFromRef(triggerRef),
    onHide: () => toggleLayerProps.close()
  });

  return (
    <>
      {element}
      <div ref={triggerRef} {...hoverProps}>
        hover me!
      </div>
    </>
  );
}
      `.trim()}
      </Code>
    </Main>
  );
}
