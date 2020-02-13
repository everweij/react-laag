import React from "react";
import { Link } from "gatsby";
import Main from "../../components/DocsMain";
import Code from "../../components/Code";

import zoom from "../../images/zoom.svg";

export default function UseTooltip() {
  return (
    <Main title="useTooltip" pageUrl="/docs/usetooltip/">
      <h1>useTooltip</h1>

      <Code>{`import { useTooltip } from 'react-laag';`}</Code>

      <p>
        This is an utility hook that combines functionalities of{" "}
        <Link to="/docs/usetogglelayer/">
          <code>{`useToggleLayer()`}</code>
        </Link>{" "}
        and{" "}
        <Link to="/docs/usehover/">
          <code>{`useHover()`}</code>
        </Link>
        .
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
        <span className="entity linked">TriggerProps</span>]
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
          Same props as <code>{`<ToggleLayer/>`}</code> and same options as{" "}
          <code>{`useHover()`}</code>, except for <code>isOpen</code>,{" "}
          <code>onOutsideClick()</code> and <code>onDisappear()</code>.
        </p>
      </div>

      <div className="detail">
        <div className="title">TriggerProps</div>
        <img alt="details" src={zoom} />

        <p>
          This prop-object should be spread over the element that will trigger
          the tooltip, ie.:
          <br />
          <code>{`<div {...triggerProps} />`}</code>
          <br />
          <br />
          It contains a few event-handlers and a ref.
        </p>
      </div>

      <h3>Example</h3>
      <Code>
        {`
function Example() {
  const [element, triggerProps] = useTooltip(
    ({ isOpen, layerProps }) =>
      isOpen && <div {...layerProps}>I'm a tooltip!</div>,
    {
      delayEnter: 100,
      delayLeave: 100
    }
  );

  return (
    <>
      {element}
      <div {...triggerProps}>Hover me...</div>
    </>
  )
}
      `.trim()}
      </Code>
    </Main>
  );
}
