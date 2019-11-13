import * as React from "react";
import styled from "styled-components";
import { useHover, ToggleLayer, Arrow, Transition } from "react-laag";
import ResizeObserver from "resize-observer-polyfill";

import ScrollBox from "./ScrollBox";

const TooltipBox = styled.div`
  background-color: #333;
  border: 1px solid black;
  color: white;
  font-size: 12px;
  padding: 3px 12px;
  border-radius: 3px;
  transform-origin: center center;
  z-index: 100000;
`;

const TooltipText = styled.span`
  border-bottom: 1px dotted #1a73a7;
  color: #1a73a7;
`;

function Tooltip({ children, text }) {
  const [show, hoverProps] = useHover({ delayEnter: 300, delayLeave: 200 });

  return (
    <ToggleLayer
      ResizeObserver={ResizeObserver}
      isOpen={show}
      fixed
      placement={{ anchor: "TOP_CENTER", autoAdjust: true, triggerOffset: 4 }}
      renderLayer={({ isOpen, layerProps, layerSide, arrowStyle }) => {
        return (
          <Transition isOpen={isOpen}>
            {(isOpen, onTransitionEnd) => (
              <TooltipBox
                {...layerProps}
                onTransitionEnd={onTransitionEnd}
                style={{
                  ...layerProps.style,
                  transition: "opacity 0.15s, transform 0.15s",
                  opacity: isOpen ? 1 : 0,
                  transform: `scale(${isOpen ? 1 : 0.8}) translateY(${
                    isOpen ? 1 : layerSide === "top" ? -8 : 8
                  }px)`
                }}
              >
                {text}
                <Arrow
                  style={arrowStyle}
                  layerSide={layerSide}
                  size={5}
                  backgroundColor={"#333"}
                  borderWidth={1}
                  borderColor={"black"}
                />
              </TooltipBox>
            )}
          </Transition>
        );
      }}
    >
      {({ triggerRef }) => (
        <TooltipText ref={triggerRef} {...hoverProps}>
          {children}
        </TooltipText>
      )}
    </ToggleLayer>
  );
}

function Example() {
  return (
    <div>
      <ScrollBox>
        <p style={{ width: 400, fontSize: 16 }}>
          In alteration insipidity impression by travelling reasonable up
          motionless. Of regard warmth by unable sudden garden ladies. No kept
          hung am size spot no.{" "}
          <Tooltip text="I'm a tooltip!">Likewise</Tooltip> led and dissuade
          rejoiced welcomed husbands boy. Do listening on he suspected
          resembled. Water would still if to. Position boy{" "}
          <Tooltip text="I'm a tooltip!">required</Tooltip> law moderate was
          may. Speedily say has suitable disposal add boy. On forth doubt miles
          of child. Exercise joy man children rejoiced. Yet uncommonly his ten
          who diminution astonished. Demesne new manners{" "}
          <Tooltip text="I'm a tooltip!">savings</Tooltip> staying had. Under
          folly balls death own point now men. Match way these she avoid see
          death. She whose drift their fat off. Saw yet kindness too replying
          whatever marianne. Old{" "}
        </p>
      </ScrollBox>
    </div>
  );
}

export default Example;
