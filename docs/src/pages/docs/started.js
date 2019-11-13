import React from "react";
import { Link } from "gatsby";
import Main from "../../components/DocsMain";
import Code from "../../components/Code";
import ResizeObserver from "resize-observer-polyfill";
import { ToggleLayer, Arrow, Transition, useHover } from "react-laag";

function Tooltip({ children, text }) {
  const [isOpen, hoverProps] = useHover();

  return (
    <ToggleLayer
      ResizeObserver={ResizeObserver}
      isOpen={isOpen}
      renderLayer={({ isOpen, layerProps, arrowStyle }) => (
        <Transition isOpen={isOpen}>
          {(isOpen, onTransitionEnd) => (
            <div
              ref={layerProps.ref}
              onTransitionEnd={onTransitionEnd}
              style={{
                ...layerProps.style,
                backgroundColor: "black",
                color: "white",
                padding: "2px 8px",
                fontSize: 12,
                borderRadius: 4,
                transition: "0.2s",
                opacity: isOpen ? 1 : 0
              }}
            >
              {text}
              <Arrow size={4} style={arrowStyle} backgroundColor="black" />
            </div>
          )}
        </Transition>
      )}
    >
      {({ triggerRef }) => (
        <span ref={triggerRef} {...hoverProps}>
          {children}
        </span>
      )}
    </ToggleLayer>
  );
}

export default function Started() {
  return (
    <Main title="Getting Started" pageUrl="/docs/started/">
      <h1>Getting Started</h1>

      <h2>Installation</h2>
      <p>To download and install react-laag run:</p>
      <Code lang="bash">{`yarn add react-laag`}</Code>

      <h2>Create a Tooltip component</h2>
      <p>
        To get some sense of how react-laag works, we're going to build a simple
        Tooltip component. Eventually we want a component that looks like:
      </p>
      <Code>
        {`
<Tooltip text="I'm a tooltip!">
  When you hover over this text, a tooltip will appear
</Tooltip>
      `.trim()}
      </Code>

      <p>
        And here's a working example: <br />
        <Tooltip text="I'm a tooltip!">
          <i style={{ backgroundColor: "#e3effb" }}>
            When you hover over this text, a tooltip will appear
          </i>
        </Tooltip>
      </p>

      <h3>Importing the right tools</h3>
      <Code>
        {`import { ToggleLayer, Arrow, useHover, Transition } from "react-laag";`.trim()}
      </Code>
      <p>Let's go over these one by one, and describe their role.</p>
      <ul>
        <li>
          <code>ToggleLayer</code> - the most important component which takes
          care of all the heavy lifting (positioning)
        </li>
        <li>
          <code>Arrow</code> - as the name suggests, a small component that
          renders an arrow for our tooltip
        </li>
        <li>
          <code>useHover</code> - takes care of the logic of when to show the
          tooltip
        </li>
        <li>
          <code>Transition</code> - an utility component that takes care of
          transitioning the tooltip in and out
        </li>
      </ul>

      <h3>The component</h3>
      <p>
        We need a component that accepts <code>children</code> and{" "}
        <code>text</code> (the tooltip's text) as props:
      </p>
      <Code>
        {`
import { ToggleLayer, Arrow, useHover, Transition } from "react-laag";

function Tooltip({ children, text }) {
  return (
    // here comes our implementation
  );
}
      `.trim()}
      </Code>

      <h3>Connect the tools together</h3>
      <Code>
        {`
import { ToggleLayer, Arrow, Transition, useHover } from "react-laag";

function Tooltip({ children, text }) {
  // 'isOpen' tells whether we should show the tooltip
  // 'hoverProps' contains event-handlers we should pass to our 'children' 
  const [isOpen, hoverProps] = useHover();

  return (
    <ToggleLayer
      // should we show the tooltip?
      isOpen={isOpen}

      // this is the place where we render the tooltip
      renderLayer={({ isOpen, layerProps, arrowStyle }) => (
        // let 'Transition' know when the tooltip should be
        // mounted or unmounted
        <Transition isOpen={isOpen}>
          {(isOpen, onTransitionEnd) => (
            <div
              // provide a 'ref' for calculation purposes
              ref={layerProps.ref}
              // let 'Transition' know when the transition
              // has finished
              onTransitionEnd={onTransitionEnd}
              style={{
                // forward the 'style' we received from
                // 'renderLayer'
                ...layerProps.style,
                // provide our own styles
                backgroundColor: "black",
                color: "white",
                padding: "2px 8px",
                fontSize: 12,
                borderRadius: 4,
                // create a fade effect
                transition: "0.2s",
                opacity: isOpen ? 1 : 0
              }}
            >
              {text}
              // forward the 'arrowStyle'
              // customize props to our liking
              <Arrow size={4} style={arrowStyle} backgroundColor="black" />
            </div>
          )}
        </Transition>
      )}
    >
      {({ triggerRef }) => (
        // wrap the 'children' in a 'span' element
        // and apply the 'triggerRef' and 'hoverProps'
        <span ref={triggerRef} {...hoverProps}>
          {children}
        </span>
      )}
    </ToggleLayer>
  );
}
      `.trim()}
      </Code>
      <p>
        And there you have it: our custom tooltip component in only a couple of
        lines 🎉
      </p>
      <p>
        There's much more react-laag can do though. Go to the{" "}
        <Link to="/examples/">examples</Link> to get some inspiration, or check
        out the <Link to="/docs/togglelayer/">api reference</Link> to find out
        more possibilities.
      </p>
    </Main>
  );
}
