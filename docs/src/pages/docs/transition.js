import React from "react";

import Main from "../../components/DocsMain";
import PropTitle from "../../components/PropTitle";
import Code from "../../components/Code";

export default function Transition() {
  return (
    <Main title="Transition" pageUrl="/docs/transition/">
      <h1>Transition</h1>

      <Code>{`import { Transition } from 'react-laag';`}</Code>

      <p>
        Utility component that lets you transition the appearance /
        disappearance of the layer in a simple way. Best used if you want to use
        simple css-transitions like <code>opacity</code> or{" "}
        <code>transform</code> and don't want to depend on an animation library.
        For more complex transitions it is recommended to use tools like{" "}
        <code>framer-motion</code> or <code>react-spring</code>.
      </p>

      <h2 style={{ marginBottom: 32 }}>Props</h2>

      <PropTitle icon required>
        isOpen
      </PropTitle>
      <div className="label">Type</div>
      <div className="type">
        <span className="entity">boolean</span>
      </div>

      <p>Determines if the layer is currently open or closed.</p>

      <PropTitle icon required>
        children
      </PropTitle>
      <div className="label">Type</div>
      <div className="type">
        (<span className="arg">isOpen</span>:{" "}
        <span className="entity">boolean</span>,{" "}
        <span className="arg">onTransitionEnd</span>: (): void,{" "}
        <span className="arg">isLeaving</span>:{" "}
        <span className="entity">boolean</span>):{" "}
        <span className="entity">ReactNode</span>
      </div>

      <h3>Example</h3>
      <Code>
        {`
import * as React from "react";
import { ToggleLayer, Transition } from "react-laag";

<ToggleLayer
  renderLayer={({ isOpen, layerProps }) => (
    <Transition isOpen={isOpen}>
      {(isOpen, onTransitionEnd) => (
        <div
          ref={layerProps.ref}

          // 'onTransitionEnd' is required in order for '<Transition />'
          // to determine when the layer should be unmounted.
          onTransitionEnd={onTransitionEnd}
          style={{
            ...layerProps.style,
            // 'transition' is required for the 'onTransitionEnd' to fire
            transition: '0.2s ease-in-out'

            // declare styles based on whether the layer is open or closed
            opacity: isOpen ? 1 : 0
          }}
        >
          Layer
        </div>
      )}
    </Transition>
  )}
>
  {({ triggerRef, toggle }) => (
    <button ref={triggerRef} onClick={toggle}>
      Toggle
    </button>
  )}
</ToggleLayer>;
      `.trim()}
      </Code>
    </Main>
  );
}
