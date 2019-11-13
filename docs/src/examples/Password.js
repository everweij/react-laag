import * as React from "react";
import styled from "styled-components";
import { ToggleLayer, Arrow } from "react-laag";
import { motion } from "framer-motion";
import ResizeObserver from "resize-observer-polyfill";

import ScrollBox from "./ScrollBox";
import Input from "./Input";
import composeRefs from "./composeRefs";

function Requirement({ text, valid }) {
  return (
    <div
      style={{
        display: "flex",
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
        lineHeight: 1.15
      }}
    >
      <div style={{ width: 20, color: "#7db316" }}>{valid ? "✔︎" : ""}</div>
      {text}
    </div>
  );
}

const outTransform = {
  top: { x: 0, y: -20 },
  left: { x: -20, y: 0 },
  bottom: { x: 0, y: 20 },
  right: { x: 20, y: 0 },
  center: { x: 0, y: 0 }
};

const MenuBase = styled(motion.div)`
  transition: width 0.15s ease-in-out;
  position: absolute;
  padding: 12px 16px;
  background-clip: padding-box;
  border-radius: 4px;
  box-shadow: 0 1px 15px rgba(27, 31, 35, 0.15);
  margin: 0;
  box-sizing: border-box;
  background-color: white;
  color: #333;
  border: 1px solid rgba(27, 31, 35, 0.15);
`;

const Requirements = React.forwardRef(function Menu(
  { style, layerSide, arrowStyle, children },
  ref
) {
  return (
    <MenuBase
      ref={ref}
      style={style}
      initial={{ opacity: 0, ...outTransform[layerSide] }} // animate from
      animate={{ opacity: 1, x: 0, y: 0 }} // animate to
      transition={{
        type: "spring",
        stiffness: 800,
        damping: 35
      }}
      positionTransition={{
        type: "spring",
        stiffness: 800,
        damping: 50
      }}
    >
      {children}

      <Arrow
        style={arrowStyle}
        layerSide={layerSide}
        borderColor="rgba(27, 31, 35, 0.15)"
        borderWidth={1}
        roundness={0.5}
      />
    </MenuBase>
  );
});
const Password = React.forwardRef(function AutoComplete({ style }, ref) {
  const [value, setValue] = React.useState("");

  return (
    <ToggleLayer
      ResizeObserver={ResizeObserver}
      placement={{
        anchor: "RIGHT_CENTER",
        autoAdjust: true,
        scrollOffset: 16,
        triggerOffset: 16,
        possibleAnchors: ["TOP_LEFT", "RIGHT_CENTER", "BOTTOM_LEFT"]
      }}
      renderLayer={({
        layerProps,
        arrowStyle,
        isOpen,
        layerSide,
        triggerRect
      }) => {
        return (
          isOpen && (
            <Requirements
              key="requirements"
              ref={layerProps.ref}
              style={{
                ...layerProps.style,
                width:
                  layerSide === "right" || layerSide === "left"
                    ? 200
                    : triggerRect.width
              }}
              arrowStyle={arrowStyle}
              layerSide={layerSide}
            >
              <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 8 }}>
                Choose a secure password
              </div>
              <Requirement valid={value.length >= 8} text="8 chars" />
              <Requirement
                valid={/[A-Z]/.test(value)}
                text="1 uppercase letter"
              />
              <Requirement
                valid={/[a-z]/.test(value)}
                text="1 lowercase letter"
              />
              <Requirement
                valid={/[\!\@\#\$\%\^\&\*\+\_\-\~]/.test(value)}
                text="1 special char"
              />
              <Requirement valid={/[0-9]/.test(value)} text="1 number" />
            </Requirements>
          )
        );
      }}
    >
      {({ triggerRef, open, close }) => (
        <Input
          style={{
            ...style,
            width: 200
          }}
          type="password"
          value={value}
          onChange={evt => setValue(evt.target.value)}
          ref={composeRefs(ref, triggerRef)}
          onFocus={open}
          onBlur={close}
          placeholder="Choose a password..."
        />
      )}
    </ToggleLayer>
  );
});

function Example() {
  return (
    <div>
      <ScrollBox>
        <Password />
      </ScrollBox>
    </div>
  );
}

export default Example;
