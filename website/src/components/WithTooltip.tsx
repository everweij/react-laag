import React from "react";
import {
  useLayer,
  Arrow,
  useHover,
  Placement,
  UseHoverProps,
  UseLayerProps
} from "../../../src";
import styled from "styled-components";

import { colors } from "../theme";

type Position = "top" | "left" | "right" | "bottom";

type ForwardedProps = UseLayerProps["triggerProps"] & UseHoverProps;

type WithTooltipProps = {
  text: string;
  children:
    | React.ReactElement
    | ((
        props: UseHoverProps & UseLayerProps["triggerProps"]
      ) => React.ReactElement);
  position?: Position;
  auto?: boolean;
  maxWidth?: number;
};

const positionMap: Record<Position, Placement> = {
  top: "top-center",
  left: "left-center",
  right: "right-center",
  bottom: "bottom-center"
};

const Tooltip = styled.div`
  padding: 4px 8px;
  line-height: 1.15;
  background-color: ${colors["bg-code"]};
  color: white;
  font-size: 12.8px;
  pointer-events: none;
  border-radius: 3px;
  transition: opacity 0.1s ease-in-out;
  opacity: 1;
`;

export default function WithTooltip({
  text,
  children,
  position = "bottom",
  auto = false,
  maxWidth
}: WithTooltipProps) {
  const [isOpen, hoverProps] = useHover({ delayEnter: 250, delayLeave: 250 });

  const { layerProps, triggerProps, renderLayer, arrowProps } = useLayer({
    isOpen: isOpen,
    placement: positionMap[position],
    triggerOffset: 8,
    possiblePlacements: [
      "top-center",
      "bottom-center",
      "left-center",
      "right-center"
    ],
    auto,
    snap: true
  });

  const forwardedProps: ForwardedProps = {
    ...triggerProps,
    ...hoverProps
  };

  return (
    <>
      {isOpen &&
        renderLayer(
          <Tooltip
            {...layerProps}
            style={{ ...layerProps.style, maxWidth: maxWidth || "auto" }}
          >
            {text}
            <Arrow
              {...arrowProps}
              backgroundColor="black"
              size={4}
              roundness={0.5}
            />
          </Tooltip>
        )}
      {typeof children === "function"
        ? children(forwardedProps)
        : React.cloneElement(children, forwardedProps)}
    </>
  );
}
