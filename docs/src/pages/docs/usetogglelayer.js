import React from "react";
import { Link } from "gatsby";
import Main from "../../components/DocsMain";
import PropTitle from "../../components/PropTitle";
import Code from "../../components/Code";

import zoom from "../../images/zoom.svg";

export default function UseToggleLayer() {
  return (
    <Main title="useToggleLayer" pageUrl="/docs/usetogglelayer/">
      <h1>useToggleLayer</h1>

      <Code>{`import { useToggleLayer } from 'react-laag';`}</Code>

      <p>
        Hook variant of{" "}
        <Link to="/docs/togglelayer/">
          <code>{`<ToggleLayer />`}</code>
        </Link>{" "}
        that tries to achieve the same thing: rendering layers. When using{" "}
        <code>{`<ToggleLayer />`}</code>, the layer is coupled tightly to the
        trigger element, but there are cases where the trigger element is
        unknown beforehand, or there simply isn't a trigger-element (but another
        source to tie the layer to). In such cases it is recommended to use{" "}
        <code>{`useToggleLayer()`}</code>.<br />
        <br />
        Common use cases: <i>context-menus</i>, <i>text-selection</i>.
      </p>

      <div className="label">Type</div>
      <div className="type">
        (<br />
        &nbsp;&nbsp;
        <span className="arg">renderLayer</span>: (
        <span className="arg">props</span>:{" "}
        <span className="entity linked">RenderLayerProps</span>):{" "}
        <span className="entity">ReactNode</span>,<br />
        &nbsp;&nbsp;<span className="arg">options</span>:{" "}
        <span className="entity linked">Options</span>
        <br />
        ): [<span className="entity">ReactNode</span>,{" "}
        <span className="entity linked">ToggleLayerProps</span>]
      </div>

      <div className="detail">
        <div className="title">RenderLayerProps</div>
        <img alt="details" src={zoom} />
        <p>
          See <code>{`<ToggleLayer/>`}</code>'s{" "}
          <Link to="/docs/togglelayer/#renderlayer">
            <code>renderLayer</code>
          </Link>{" "}
          prop for more info.
        </p>
      </div>

      <div className="detail">
        <div className="title">Options</div>
        <img alt="details" src={zoom} />
        <p>
          Same props as <code>{`<ToggleLayer/>`}</code>, except for{" "}
          <code>isOpen</code>, <code>onOutsideClick()</code> and{" "}
          <code>onDisappear()</code>.
        </p>
      </div>

      <div className="detail">
        <div className="title">ToggleLayerProps</div>
        <img alt="details" src={zoom} />

        <PropTitle>isOpen</PropTitle>
        <div className="type">
          <span className="entity">boolean</span>
        </div>
        <p>Describes whether the layer is open or closed</p>

        <PropTitle>open</PropTitle>
        <div className="type">
          (<span className="arg">props</span>: {"{"}
          <span className="arg">clientRect</span>:{" "}
          <span className="entity">ClientRect</span> | ():{" "}
          <span className="entity">ClientRect</span>,{" "}
          <span className="arg">target</span>:{" "}
          <span className="entity">HTMLElement</span>
          {"}"})
        </div>
        <p>
          Shows the layer.
          <br />
          The <code>clientRect</code> prop is used to position the layer.
          Provide a function returning a <code>ClientRect</code> if you want
          react-laag to re-position the layer on scrolling / resizing.
          <br />
          The <code>target</code> prop is used to determine where to place the
          layer in the DOM.
        </p>

        <PropTitle>openFromMouseEvent</PropTitle>
        <div className="type">
          (<span className="arg">event</span>:{" "}
          <span className="entity">MouseEvent</span>): void
        </div>
        <p>
          Utility method that shows the layer with a mouse event as its source.
        </p>

        <PropTitle>openFromContextMenuEvent</PropTitle>
        <div className="type">
          (<span className="arg">event</span>:{" "}
          <span className="entity">MouseEvent</span>): void
        </div>
        <p>
          Utility method that shows the layer with a context-menu-event as its
          source.
        </p>

        <PropTitle>close</PropTitle>
        <div className="type">(): void</div>
        <p>Hides the layer</p>

        <PropTitle>layerSide</PropTitle>
        <div className="type">
          <span className="entity">LayerSide</span> |{" "}
          <span className="entity">null</span>
        </div>
        <p>
          <code>null</code> when the layer is closed.
          <br />
          When the layer is open, <code>layerSide</code> describes on which side
          the layer is currently positioned relative to the trigger. When{" "}
          <code>layerSide</code> is <span className="str">"center"</span>, it
          means that the layer is anchored <span className="str">"CENTER"</span>
          .<br />
          <span className="entity">LayerSide</span> ={" "}
          <span className="str">"top"</span> |{" "}
          <span className="str">"right"</span> |{" "}
          <span className="str">"bottom"</span> |{" "}
          <span className="str">"left"</span> |{" "}
          <span className="str">"center"</span>
        </p>
      </div>

      <h3>Example</h3>
      <Code>
        {`
function HookExample() {
  const [element, toggleLayerProps] = useToggleLayer(
    // determine how to render the layer
    ({ isOpen, layerProps }) => isOpen && <div {...layerProps} />,
    // optionally provide options
    {
      placement: {
        anchor: "BOTTOM_CENTER",
        autoAdjust: true,
        snapToAnchor: true,
        triggerOffset: 12,
        scrollOffset: 16,
        possibleAnchors: [
          "BOTTOM_CENTER",
          "LEFT_CENTER",
          "RIGHT_CENTER",
          "TOP_CENTER"
        ]
      },
      closeOnOutsideClick: true
    }
  );

  // react to events
  return (
    <>
      {element}
      <div onContextMenu={toggleLayerProps.openFromContextMenuEvent}></div>
    </>
  );
}
      `.trim()}
      </Code>
    </Main>
  );
}
