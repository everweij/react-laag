import React from "react";

import Main from "../../components/DocsMain";
import PropTitle from "../../components/PropTitle";
import Code from "../../components/Code";

export default function Arrow() {
  return (
    <Main title="Arrow" pageUrl="/docs/arrow/" propsNav>
      <h1>Arrow</h1>

      <Code>{`import { Arrow } from 'react-laag';`}</Code>

      <p>
        <code>{`<Arrow />`}</code> is a utility component that is useful if you
        want to add an arrow to your layer. This is a common practice for
        especially tooltips, as well as menu's. The <code>{`<Arrow />`}</code>{" "}
        component composes a svg dynamically based on a couple of props you
        provide. The goal is to add arrow functionality in a declarative way,
        without the need to do any arrow specific calculations.
      </p>

      <h2 style={{ marginBottom: 32 }}>Props</h2>

      <PropTitle icon>layerSide</PropTitle>
      <div className="label">Type</div>
      <div className="type">
        <span className="entity">LayerSide</span>
      </div>
      <div className="label">Default</div>
      <div style={{ fontSize: 16, marginBottom: 16 }} className="str">
        "top"
      </div>

      <p>
        Determines which side the layer is currently on. This property is
        normally provided as part of the <code>RenderLayerProps</code>.
      </p>

      <PropTitle icon>style</PropTitle>
      <div className="label">Type</div>
      <div className="type">
        <span className="entity">CSSProperties</span>
      </div>
      <div className="label">Default</div>
      <div style={{ fontSize: 16, marginBottom: 16 }}>{`{}`}</div>

      <p>
        Style that positions the arrow. This property (<code>arrowStyle</code>)
        is normally provided as part of the <code>RenderLayerProps</code>.
      </p>

      <PropTitle icon>size</PropTitle>
      <div className="label">Type</div>
      <div className="type">
        <span className="entity">number</span>
      </div>
      <div className="label">Default</div>
      <div style={{ fontSize: 16, marginBottom: 16, color: "black" }}>8</div>

      <p>Distance in pixels between point of the arrow and the layer.</p>

      <PropTitle icon>angle</PropTitle>
      <div className="label">Type</div>
      <div className="type">
        <span className="entity">number</span>
      </div>
      <div className="label">Default</div>
      <div style={{ fontSize: 16, marginBottom: 16, color: "black" }}>45</div>

      <p>
        Angle of the point of the arrow in degrees. Accepts a value between
        0-80, where a lower value results in a more pointy arrow.
      </p>

      <PropTitle icon>roundness</PropTitle>
      <div className="label">Type</div>
      <div className="type">
        <span className="entity">number</span>
      </div>
      <div className="label">Default</div>
      <div style={{ fontSize: 16, marginBottom: 16, color: "black" }}>0</div>

      <p>
        Value between 0 and 1. Determines how 'sharp' the point of the arrow
        should be, much like the 'border-radius' in css.
      </p>

      <PropTitle icon>borderWidth</PropTitle>
      <div className="label">Type</div>
      <div className="type">
        <span className="entity">number</span>
      </div>
      <div className="label">Default</div>
      <div style={{ fontSize: 16, marginBottom: 16, color: "black" }}>0</div>

      <p>The width of the border</p>

      <PropTitle icon>borderColor</PropTitle>
      <div className="label">Type</div>
      <div className="type">
        <span className="entity">string</span>
      </div>
      <div className="label">Default</div>
      <div className="str" style={{ fontSize: 16, marginBottom: 16 }}>
        "black"
      </div>

      <p>The color of the border</p>

      <PropTitle icon>backgroundColor</PropTitle>
      <div className="label">Type</div>
      <div className="type">
        <span className="entity">string</span>
      </div>
      <div className="label">Default</div>
      <div className="str" style={{ fontSize: 16, marginBottom: 16 }}>
        "white"
      </div>

      <p>The background-color of the arrow</p>

      <h3>Example</h3>
      <Code>
        {`
import * as React from "react";
import { ToggleLayer, Arrow } from "react-laag";

<ToggleLayer
  renderLayer={({ layerProps, layerSide, arrowStyle }) =>
    isOpen && (
      <div {...layerProps}>
        <Arrow
          style={arrowStyle}
          layerSide={layerSide}
          size={8}
          angle={45}
          roundness={1}
          borderWidth={1}
          borderColor="black"
          backgroundColor="white"
        />
      </div>
    )
  }
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
