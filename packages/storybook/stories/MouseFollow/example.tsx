import * as React from "react";
import styled from "styled-components";
import {
  useLayer,
  Arrow,
  useMousePositionAsTrigger,
  useHover
} from "react-laag";
import { TooltipBox, BG_COLOR, BORDER_COLOR } from "../../components/Tooltip";
import { ScrollBox } from "../../components/ScrollBox";

const Box = styled.div`
  width: 100px;
  height: 200px;
  background-color: purple;
`;

export function MouseFollow() {
  const [isOver, hoverProps] = useHover({
    delayEnter: 0,
    delayLeave: 0,
    hideOnScroll: false
  });

  const { handleMouseEvent, trigger, parentRef } = useMousePositionAsTrigger({
    enabled: isOver
  });

  const { renderLayer, layerProps, arrowProps } = useLayer({
    isOpen: isOver,
    overflowContainer: false,
    auto: true,
    snap: true,
    possiblePlacements: [
      "top-center",
      "bottom-center",
      "left-center",
      "right-center"
    ],
    placement: "top-center",
    triggerOffset: 8,
    containerOffset: 16,
    trigger
  });

  return (
    <>
      <ScrollBox ref={parentRef}>
        <Box {...hoverProps} onMouseMove={handleMouseEvent} />
      </ScrollBox>
      {isOver &&
        renderLayer(
          <TooltipBox {...layerProps}>
            I'm a tooltip!
            <Arrow
              {...arrowProps}
              backgroundColor={BG_COLOR}
              borderColor={BORDER_COLOR}
              borderWidth={1}
              size={6}
            />
          </TooltipBox>
        )}
    </>
  );
}
