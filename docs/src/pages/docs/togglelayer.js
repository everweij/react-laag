import React from "react";

import Main from "../../components/DocsMain";
import Note from "../../components/Note";
import PropTitle from "../../components/PropTitle";
import Code from "../../components/Code";

import zoom from "../../images/zoom.svg";
import { Link } from "gatsby";

export default function ToggleLayer() {
  return (
    <Main title="ToggleLayer" pageUrl="/docs/togglelayer/" propsNav>
      <h1>ToggleLayer</h1>
      <Code>{`import { ToggleLayer } from 'react-laag';`}</Code>
      <p>
        ToggleLayer is the most important component of react-laag. As the name
        suggests, this component is used to toggle layers (between show and
        don't show). It assumes there are two key components at play:
      </p>
      <ul>
        <li>
          a <b>trigger</b>, which can be any html-element
        </li>
        <li>
          a <b>layer</b>, the element we want to toggle, can also be any
          html-element
        </li>
      </ul>
      <h3>position: relative;</h3>
      <p>
        react-laag expects you to style the scroll-parent where you want to
        contain your layer in <code>position: relative</code> (or{" "}
        <code>absolute</code> | <code>fixed</code>). If your layer does not need
        to be contained, because the trigger scrolls with the rest of the page
        for instance, you don't have to do anything, because react-laag looks at
        the <code>document.body</code> by default.
      </p>
      <h3>Render props</h3>
      <p>
        In order to give you as much control as possible, react-laag makes use
        of the <i>render prop</i> pattern; Instead of a normal react-element,
        react-laag expects you to pass in a function which in turn returns a
        react-element. To illustrate:
      </p>
      <Code>
        {`
// Plain react-element...
<div />

// ...becomes
() => <div />
      `.trim()}
      </Code>
      <p>
        The cool thing about this is that react-laag provides you with tools,
        and you get to decide if and how to use them!
      </p>
      <h3>Controlled vs. uncontrolled</h3>
      <p>
        By default react-laag behaves uncontrolled. That means that some state
        is managed internally inside react-laag. Most of the time this works
        fine, but there are cases where more control is desirable. Fortunately,
        react-laag watches certain props and can tell if you want to manage
        parts of the state yourself.
      </p>
      <Code>
        {`
const [isOpen, setOpen] = React.useState();

<ToggleLayer
  // by setting this prop, react-laag knows
  // you want control over this part of the state
  isOpen={isOpen}
/>
      `.trim()}
      </Code>
      <h2>Props</h2>
      <PropTitle icon required>
        children
      </PropTitle>
      <p>
        <i>Render prop</i> that should render the <b>trigger</b>. Minimal
        example:
      </p>
      <Code>
        {`
<ToggleLayer
  // rest of props go here
>
  {({ triggerRef }) => <div ref={triggerRef}>Trigger</div>}
</ToggleLayer>
      `.trim()}
      </Code>
      <div className="label">Type</div>
      <div className="type">
        (<span className="arg">props</span>:{" "}
        <span className="entity linked">ChildProps</span>):{" "}
        <span className="entity">ReactNode</span>
      </div>
      <div className="detail">
        <div className="title">ChildProps</div>
        <img alt="details" src={zoom} />

        <PropTitle required>triggerRef</PropTitle>
        <div className="type">
          <span className="entity">RefObject</span>
        </div>
        <p>
          In order to calculate the layer's position, react-laag needs access to
          the trigger's dom-element. Assign <code>triggerRef</code> to the ref
          prop when using a React-element or Component (make sure that you the{" "}
          <code>ref</code> is forwarded with <code>React.forwardRef</code>)
        </p>

        <PropTitle>isOpen</PropTitle>
        <div className="type">
          <span className="entity">boolean</span>
        </div>
        <p>Describes whether the layer is open or closed</p>

        <PropTitle>open</PropTitle>
        <div className="type">(): void</div>
        <p>Shows the layer</p>

        <PropTitle>close</PropTitle>
        <div className="type">(): void</div>
        <p>Hides the layer</p>

        <PropTitle>toggle</PropTitle>
        <div className="type">(): void</div>
        <p>Toggles between show/hide</p>

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
      <PropTitle icon required>
        renderLayer
      </PropTitle>
      <p>
        <i>Render prop</i> that should render the <b>layer</b>.
      </p>
      <div className="label">Type</div>
      <div className="type">
        (<span className="arg">props</span>:{" "}
        <span className="entity linked">RenderLayerProps</span>):{" "}
        <span className="entity">ReactNode</span>
      </div>
      <div className="detail">
        <div className="title">RenderLayerProps</div>
        <img alt="details" src={zoom} />

        <PropTitle required>layerProps</PropTitle>
        <div className="type">
          {"{"}
          <span className="arg">ref</span>:{" "}
          <span className="entity">RefObject</span>,{" "}
          <span className="arg">style</span>:{" "}
          <span className="entity">CSSProperties</span>
          {"}"}
        </div>
        <p>
          In some cases you can spread these <code>layerProps</code> directly
          onto your component or element like so: <br />
        </p>
        <Code style={{ margin: "16px 0px" }}>{"<div {...layerProps} />"}</Code>
        <p>
          But sometimes you want to add styles on top of the style-object
          react-laag provides. Such scenario's can be handled like this:
        </p>

        <Code style={{ marginTop: 16 }}>
          {`
          <div 
  ref={layerProps.ref}
  style={{ ...layerProps.style, backgroundColor: 'blue'}}
/>`.trim()}
        </Code>

        <PropTitle>isOpen</PropTitle>
        <div className="type">
          <span className="entity">boolean</span>
        </div>
        <p>
          Determines whether we should render the layer or not. The reason for
          providing this prop, and not to ignore the <code>renderLayer</code>{" "}
          prop entirely when <code>isOpen === false</code>, is that you still
          have control over what to do when the layer is closed (ie. handling
          transitions / animations).
        </p>

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

        <PropTitle>arrowStyle</PropTitle>
        <div className="type">
          <span className="entity">CSSProperties</span>
        </div>
        <p>
          If you want to display an arrow-like element, which many tooltip-like
          components do, you can utilize the <code>arrowStyle</code>. This style
          object gives the position of the center of the trigger, relative to
          the layer. How you style your arrow further is up to you. react-laag
          provides an{" "}
          <Link to="/docs/arrow/">
            <code>{`<Arrow />`}</code>{" "}
          </Link>
          component which allows you to add an arrow element quick and easy, but
          you're free to use your own svg-element for instance, and calculate
          its rotation based on the <code>layerSide</code> prop. Another
          possibility is to inject the positions into a styled-component and use
          a <code>{`&::before{}`}</code> selector.
        </p>

        <PropTitle>triggerRect</PropTitle>
        <div className="type">
          <span className="entity">ClientRect</span>
        </div>
        <p>
          Useful if you want to style your layer according to the trigger's
          width for instance.
        </p>

        <PropTitle>close</PropTitle>
        <div className="type">(): void</div>
        <p>
          Useful if you want to close the layer, from within the layer itself.
          For instance, when a menu-item was clicked.
        </p>
      </div>
      <p>
        A quick example to illustrate all provided{" "}
        <span className="entity linked">RenderLayerProp</span>'s:
      </p>
      <Code>
        {`
<ToggleLayer
  renderLayer={({ layerProps, isOpen, triggerRect, arrowStyle, close }) => {
    if (isOpen) {
      return (
        <div
          ref={layerProps.ref}
          className="layer"
          style={{
            ...layerProps.style,
            width: triggerRect.width
          }}
        >
          <div className="layer-arrow" style={arrowStyle} />

          <button onClick={close}>close</button>
        </div>
      );
    }

    return null;
  }}

// rest of props skipped for brevity
/>
      `.trim()}
      </Code>
      <PropTitle style={{ marginTop: 64 }} icon>
        placement
      </PropTitle>
      <p>
        A object containing configuration regarding the placement of the layer.
      </p>
      <div className="label">Type</div>
      <div className="type">
        <span className="entity linked">PlacementConfig</span>
      </div>
      <div className="detail">
        <div className="title">PlacementConfig</div>
        <img alt="details" src={zoom} />
        <PropTitle>anchor</PropTitle>
        <div className="type">
          <span className="entity">AnchorEnum</span>
        </div>
        <div className="label">Default</div>
        <span className="str">"TOP_CENTER"</span>
        <p style={{ marginTop: 16 }}>
          Tells react-laag which anchor (location of the layer) you prefer.
          <span className="str">"CENTER"</span> behaves a bit different compared
          to the rest of the anchors, in that it centers both horizontally and
          vertically, overlapping the trigger element.
        </p>
        <div className="label">Possible values</div>
        <div className="types" style={{ marginBottom: 32 }}>
          <span className="str">"TOP_LEFT"</span> |
          <span className="str">"TOP_CENTER"</span> |
          <span className="str">"TOP_RIGHT"</span> |
          <span className="str">"BOTTOM_LEFT"</span> |
          <span className="str">"BOTTOM_CENTER"</span> |
          <span className="str">"BOTTOM_RIGHT"</span> |
          <span className="str">"LEFT_TOP"</span> |
          <span className="str">"LEFT_CENTER"</span> |
          <span className="str">"LEFT_BOTTOM"</span> |
          <span className="str">"RIGHT_TOP"</span> |
          <span className="str">"RIGHT_CENTER"</span> |
          <span className="str">"RIGHT_BOTTOM"</span> |
          <span className="str">"CENTER"</span>
        </div>

        <PropTitle>possibleAnchors</PropTitle>
        <div className="type">
          <span className="entity">AnchorEnum[]</span>
        </div>
        <div className="label">Default</div>
        <div>All anchors</div>
        <p style={{ marginTop: 12 }}>
          <code>possibleAnchors</code> has only effect when{" "}
          <code>autoAdjust</code> is enabled. It describes which anchors should
          be considered when finding the best suitable anchor to fit on the
          screen.
        </p>

        <PropTitle>autoAdjust</PropTitle>
        <div className="type">
          <span className="entity">boolean</span>
        </div>
        <div className="label">Default</div>
        <div>false</div>
        <p style={{ marginTop: 12 }}>
          Determines whether react-laag should find another anchor when the
          preferred one does not fit the current screen. When{" "}
          <code>snapToAnchor</code> is set to <code>false</code>, there will be
          a smooth 'sliding'-like effect from one anchor to the next.
        </p>

        <PropTitle>snapToAnchor</PropTitle>
        <div className="type">
          <span className="entity">boolean</span>
        </div>
        <div className="label">Default</div>
        <div>false</div>
        <p style={{ marginTop: 12 }}>
          Determines whether the layer can place itself between two anchors,
          creating a 'sliding'-effect when scrolling the page/element. With
          <code>snapToAnchor</code> enabled, the layer will 'jump' from one
          anchor to the next one instantly.
        </p>

        <PropTitle>preferX</PropTitle>
        <div className="type">
          <span className="str">"LEFT" | "RIGHT"</span>
        </div>
        <div className="label">Default</div>
        <div style={{ fontSize: 14 }} className="str">
          "RIGHT"
        </div>
        <p style={{ marginTop: 12 }}>
          Only has effect when <code>autoAdjust</code> is enabled. Determines
          which side is preferred when the layer fits on both the left and right
          side of the trigger.
        </p>

        <PropTitle>preferY</PropTitle>
        <div className="type">
          <span className="str">"TOP" | "BOTTOM"</span>
        </div>
        <div className="label">Default</div>
        <div style={{ fontSize: 14 }} className="str">
          "BOTTOM"
        </div>
        <p style={{ marginTop: 12 }}>
          Only has effect when <code>autoAdjust</code> is enabled. Determines
          which side is preferred when the layer fits on both the top and bottom
          side of the trigger.
        </p>

        <PropTitle>triggerOffset</PropTitle>
        <div className="type">
          <span className="entity">number</span>
        </div>
        <div className="label">Default</div>
        <div style={{ fontSize: 14, color: "black" }}>0</div>
        <p style={{ marginTop: 12 }}>
          Determines the distance in pixels between the layer and the trigger.
        </p>

        <PropTitle>scrollOffset</PropTitle>
        <div className="type">
          <span className="entity">number</span>
        </div>
        <div className="label">Default</div>
        <div style={{ fontSize: 14, color: "black" }}>10</div>
        <p style={{ marginTop: 12 }}>
          Determines the minimum margin in pixels between the layer and the
          scroll-containers (incl. viewport)
        </p>

        <PropTitle>arrowOffset</PropTitle>
        <div className="type">
          <span className="entity">number</span>
        </div>
        <div className="label">Default</div>
        <div style={{ fontSize: 14, color: "black" }}>0</div>
        <p style={{ marginTop: 12 }}>
          Determines the minimum margin in pixels between the arrow and the
          layers edges. Useful when you need to respect the layers
          border-radius.
        </p>

        <PropTitle>layerDimensions</PropTitle>
        <div className="type">
          {"{"}
          <span className="arg">width</span>:{" "}
          <span className="entity">number</span>,{" "}
          <span className="arg">height</span>:{" "}
          <span className="entity">number</span>
          {"}"} | (<span className="arg">layerSide</span>:{" "}
          <span className="entity">LayerSide</span>): {"{"}
          <span className="arg">width</span>:{" "}
          <span className="entity">number</span>,{" "}
          <span className="arg">height</span>:{" "}
          <span className="entity">number</span>
          {"}"}
        </div>

        <p>
          Sometimes your layer needs a different width and / or height based on
          certain conditions, ie. on which side the layer is relative to the
          trigger-element. react-laag needs to anticipate these conditional
          dimensions on order to find the best suitable place to render the
          layer. Otherwise, react-laag will 'see' the layer's dimensions only
          after it has been re-positioned, which may result in an infinite loop
          of positional calculations.
        </p>
        <Code>
          {`
{
  // rest of 'placement' here...

  layerDimensions: layerSide => ({
    width: layerSide === "bottom" ? 200 : 100,
    height: layerSide === "bottom" ? 100 : 200,
  })
}  
          `.trim()}
        </Code>
      </div>
      <PropTitle icon>fixed</PropTitle>
      <div className="label">Type</div>
      <div className="type">
        <span className="entity">boolean</span>
      </div>
      <p>
        By default react-laag tries to render the layer within the closest
        scroll-container. But in some cases you want the layer to show outside
        its parent scroll-container. This is especially true for tooltip-like
        components. It's called 'fixed'-mode, because instead of positioning the
        layer absolute, relative to its parent, the layer gets positioned fixed
        against the viewport.
      </p>
      <Note>
        Only the viewport boundaries are taken into account when using{" "}
        <code className="inline-code">placement.autoAdjust</code>
      </Note>
      <PropTitle icon>isOpen</PropTitle>
      <div className="label">Type</div>
      <div className="type">
        <span className="entity">boolean</span>
      </div>
      <p>
        By setting the <code>isOpen</code> prop, you are controlling when the
        layer should show or not. This also means that trying to call the{" "}
        <code>open()</code>, <code>close()</code> and
        <code>toggle()</code> functions from the children-props, will result in
        an error being thrown.
      </p>
      <PropTitle icon>onStyle</PropTitle>
      <div className="label">Type</div>
      <div className="type">
        (<span className="arg">layerStyle</span>:{" "}
        <span className="entity">CSSProperties</span>,{" "}
        <span className="arg">arrowStyle</span>:{" "}
        <span className="entity">CSSProperties</span>,{" "}
        <span className="arg">layerSide</span>:{" "}
        <span className="entity">LayerSide</span>): void
      </div>
      <p>
        By passing <code>onStyle</code> you get control over how the relevant
        elements are styled. This is an advanced feature, and should generally
        only be used when necessary. A reason to control the styles yourself, is
        when you run into performance issues because your layer/trigger is
        expensive to render, and you want to update the styles without causing
        React to re-render.
      </p>
      <Note>
        By using this prop you will receive no further style updates via the{" "}
        <code className="inline-code">renderLayer</code> prop when things like
        the layer's anchor has changed.
      </Note>
      <PropTitle icon>closeOnOutsideClick</PropTitle>
      <div className="label">Type</div>
      <div className="type">
        <span className="entity">boolean</span>
      </div>
      <p>
        By setting this flag, react-laag will close the layer when a click has
        ocurred somewhere except the layer / trigger.
      </p>
      <PropTitle icon>onOutsideClick</PropTitle>
      <div className="label">Type</div>
      <div className="type">(): void</div>
      <p>
        By using this prop, react-laag will notify you when a click has ocurred
        somewhere except the layer / trigger. Useful in combination with{" "}
        <code>isOpen</code>.
      </p>
      <PropTitle icon>closeOnDisappear</PropTitle>
      <div className="label">Type</div>
      <div className="type">
        <span className="str">"partial"</span> |{" "}
        <span className="str">"full"</span>
      </div>
      <p>
        The behavior depends on whether fixed is set to <code>true</code> or{" "}
        <code>false</code>:<br />
        <br />
        In <b>fixed</b> mode, the layer will close when the <b>trigger</b> has
        fully / partially disappeared. In <b>non-fixed</b> mode, the layer will
        close when the <b>layer</b> has fully / partially disappeared.
      </p>
      <PropTitle icon>onDisappear</PropTitle>
      <div className="label">Type</div>
      <div className="type">
        (<span className="arg">type</span>:{" "}
        <span className="str">"partial"</span> |{" "}
        <span className="str">"full"</span>): void
      </div>
      <p>
        By using this prop, react-laag will notify you when:
        <br />- the <b>trigger</b> has disappeared (fully / partially) in{" "}
        <b>fixed</b> mode
        <br />- the <b>layer</b> has disappeared (fully / partially) in{" "}
        <b>non-fixed</b> mode
      </p>
      <PropTitle icon>ResizeObserver</PropTitle>
      <div className="label">Type</div>
      <div className="type">
        typeof <span className="entity">ResizeObserver</span>
      </div>
      <p>
        Use this prop to inject a ResizeObserver polyfill for browsers that have
        no support out of the box.
      </p>
      <PropTitle icon experimental>
        container
      </PropTitle>
      <div className="label">Type</div>
      <div className="type">
        <span className="entity">HTMLElement</span> | ():{" "}
        <span className="entity">HTMLElement</span>
      </div>
      <p>
        Normally, react-laag renders the layers inside the closest
        scroll-parent. However, there might be use-cases where you want to
        control in which container the layers are rendered in. Since react-laag
        (in non-fixed mode) looks at the <code>scrollTop</code> and{" "}
        <code>scrollLeft</code> properties of the scroll-parent for positioning,
        it is advised to also put the container element inside the the same
        scroll-parent as the layer. It is possible to place the container
        element outside of the scroll-parent, but that will only work in 'fixed'
        mode.
      </p>
      <Note>
        For elements that are part of the React render tree, it is recommended
        to pass a getter function which returns a reference to the element,
        because it could be that the element has not been mounted by React yet.
        For containers defined in an 'index.html' for example, a{" "}
        <code>document.getElementById</code> will suffice.
      </Note>
      <Code>
        {`
<div className="scroll-container">
  <div className="tooltip-container"></div>
  <p>
    Your content here...

    <ToggleLayer
      container={() => document.querySelector(".tooltip-container")}
    />
  </p>
</div>
        `.trim()}
      </Code>

      <PropTitle style={{ marginTop: 56 }} icon experimental>
        environment
      </PropTitle>
      <div className="label">Type</div>
      <div className="type">
        <span className="entity">Window</span>
      </div>
      <div className="label">Default</div>
      <div style={{ marginBottom: 20 }}>
        <code>window</code>
      </div>

      <p>
        This prop is only useful if you're rendering react-laag within a
        different window context from where your JavaScript is running; for
        example, an iframe or a shadow-root.
      </p>
    </Main>
  );
}
