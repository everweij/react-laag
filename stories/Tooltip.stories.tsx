import React from "react";
import {
  useLayer,
  Arrow,
  useHover,
  Placement,
  UseHoverProps,
  UseLayerProps
} from "../src";
import shortid from "shortid";
import styled from "styled-components";
import { useKeyboardFocus } from "@zendeskgarden/container-keyboardfocus";
import { FocusVisibleContainer } from "@zendeskgarden/container-focusvisible";

import Button from "./components/Button";

type Position = "top" | "left" | "right" | "bottom";

type ForwardedProps = UseLayerProps["triggerProps"] &
  UseHoverProps & {
    "aria-describedby": string;
  };

type WithTooltipProps = {
  text: string;
  children:
    | React.ReactElement
    | ((
        props: UseHoverProps & UseLayerProps["triggerProps"]
      ) => React.ReactElement);
  position?: Position;
  auto?: boolean;
  id?: string;
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
  background-color: var(--blue-800);
  color: var(--grey-100);
  font-size: 12.8px;
  pointer-events: none;
  border-radius: 3px;
  transition: opacity 0.1s ease-in-out;
  opacity: 1;

  &[aria-hidden="true"] {
    opacity: 0;
    visibility: hidden;
  }
`;

function WithTooltip({
  text,
  children,
  position = "bottom",
  auto = false,
  id
}: WithTooltipProps) {
  const [isOpen, hoverProps] = useHover({ delayEnter: 250, delayLeave: 250 });
  const { getFocusProps, keyboardFocused } = useKeyboardFocus();

  const [generatedId] = React.useState(() => shortid());

  const { layerProps, triggerProps, renderLayer, arrowProps } = useLayer({
    isOpen: isOpen || keyboardFocused,
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

  const tooltipId = id || generatedId;

  const forwardedProps: ForwardedProps = getFocusProps({
    ...triggerProps,
    ...hoverProps,
    "aria-describedby": tooltipId
  });

  return (
    <>
      {renderLayer(
        <Tooltip
          {...layerProps}
          id={tooltipId}
          role="tooltip"
          aria-hidden={isOpen || keyboardFocused ? "false" : "true"}
        >
          {text}
          <Arrow
            {...arrowProps}
            backgroundColor="var(--blue-800)"
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

export default {
  title: "Tooltip"
};

export function X() {
  return (
    <FocusVisibleContainer className={"focus-visible"}>
      {props => (
        <div {...props}>
          <WithTooltip text="Save your changes">
            <Button>Save</Button>
          </WithTooltip>
          <WithTooltip text="Create an account" position="right">
            {props => (
              <Button {...props} style={{ marginLeft: 12 }}>
                Sign up
              </Button>
            )}
          </WithTooltip>
        </div>
      )}
    </FocusVisibleContainer>
  );
}
