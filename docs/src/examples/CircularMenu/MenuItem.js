import * as React from "react";
import styled from "styled-components";
import ResizeObserver from "resize-observer-polyfill";

import { animated } from "react-spring";
import { ITEM_SIZE, BORDER, TEXT, PRIMARY } from "./constants";
import { ToggleLayer, useHover } from "react-laag";

import Tooltip from "./Tooltip";

/**
 * Main
 */

const Circle = styled(animated.div)`
  position: absolute;
  width: ${ITEM_SIZE}px;
  height: ${ITEM_SIZE}px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${BORDER};
  box-shadow: 1px 1px 6px 0px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: box-shadow 0.15s ease-in-out, border 0.15s ease-in-out;
  color: ${TEXT};
  pointer-events: all;
  will-change: transform;

  & svg {
    transition: 0.15s ease-in-out;
  }

  &:hover {
    box-shadow: 1px 1px 10px 0px rgba(0, 0, 0, 0.15);
    color: ${PRIMARY};

    & svg {
      transform: scale(1.15);
    }
  }
`;

function MenuItem({ style, className, Icon, onClick, label }, ref) {
  const [isOpen, bind] = useHover({ delayEnter: 300, delayLeave: 100 });

  return (
    <ToggleLayer
      ResizeObserver={ResizeObserver}
      isOpen={isOpen}
      fixed
      placement={{
        anchor: "TOP_CENTER",
        autoAdjust: true,
        scrollOffset: 16,
        triggerOffset: 6
      }}
      renderLayer={({ isOpen, layerProps }) => {
        return (
          <Tooltip {...layerProps} isOpen={isOpen}>
            {label}
          </Tooltip>
        );
      }}
    >
      {({ triggerRef }) => (
        <Circle
          ref={triggerRef}
          className={className}
          style={style}
          onClick={onClick}
          {...bind}
        >
          {React.createElement(Icon, { size: 20 })}
        </Circle>
      )}
    </ToggleLayer>
  );
}

export default React.forwardRef(MenuItem);
