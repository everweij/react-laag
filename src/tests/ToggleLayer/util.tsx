import * as React from "react";
import ToggleLayer, { Props } from "../../ToggleLayer";
import expect from "expect";
import { RenderResult, fireEvent, act } from "@testing-library/react";

type ToggleLayerProps = Omit<Props, "renderLayer" | "children">;

export const TRIGGER_DIMENSIONS = {
  width: 100,
  height: 100
};

export const LAYER_DIMENSIONS = {
  height: 150,
  width: 150
};

export const CONTAINER_DIMENSIONS = {
  width: 2000,
  height: 2000
};

export const SCROLLBOX_DIMENSIONS = {
  width: 500,
  height: 500,
  margin: 64
};

function getArrowTranslate(layerSide: string) {
  let x = "-50%";
  let y = "-50%";

  const OFFSET = 8;

  if (layerSide === "bottom") {
    y = OFFSET + "px";
  } else if (layerSide === "top") {
    y = -OFFSET + "px";
  } else if (layerSide === "left") {
    x = -OFFSET + "px";
  } else {
    x = OFFSET + "px";
  }

  return `translate(${x}, ${y}) rotate(45deg)`;
}

export function ToggleLayerTest(props: ToggleLayerProps) {
  return (
    <div
      style={{
        display: "flex",
        width: CONTAINER_DIMENSIONS.width,
        height: CONTAINER_DIMENSIONS.height,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <ToggleLayer
        {...props}
        renderLayer={props =>
          props.isOpen ? (
            <div
              ref={props.layerProps.ref}
              style={{
                ...props.layerProps.style,
                width: LAYER_DIMENSIONS.width,
                height: LAYER_DIMENSIONS.height,
                backgroundColor: "green"
              }}
            >
              <div
                data-testid="arrow"
                style={{
                  ...props.arrowStyle,
                  transform: getArrowTranslate(props.layerSide),
                  transformOrigin: "center",
                  width: 12,
                  height: 12,
                  backgroundColor: "green"
                }}
              />
              layer
            </div>
          ) : null
        }
      >
        {({ triggerRef, toggle }) => (
          <div
            onClick={toggle}
            ref={triggerRef}
            style={{
              width: TRIGGER_DIMENSIONS.width,
              height: TRIGGER_DIMENSIONS.height,
              backgroundColor: "blue",
              color: "white"
            }}
          >
            trigger
          </div>
        )}
      </ToggleLayer>
    </div>
  );
}

export function ScrollBox({
  children,
  testId = "scrollbox"
}: {
  children: React.ReactNode;
  testId?: string;
}) {
  return (
    <div
      data-testid={testId}
      style={{
        position: "absolute",
        top: SCROLLBOX_DIMENSIONS.margin,
        left: SCROLLBOX_DIMENSIONS.margin,
        // margin: SCROLLBOX_DIMENSIONS.margin,
        width: SCROLLBOX_DIMENSIONS.width,
        height: SCROLLBOX_DIMENSIONS.height,
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        overflow: "auto"
      }}
    >
      {children}
    </div>
  );
}

export function scrollToCenter(element: HTMLElement) {
  const { width, height } = element.getBoundingClientRect();

  act(() => {
    element.scrollTop = element.scrollWidth / 2 - width / 2;
    element.scrollLeft = element.scrollHeight / 2 - height / 2;
  });
}

export function scroll(element: HTMLElement, x: number, y: number) {
  act(() => {
    element.scrollTop = element.scrollTop + y;
    element.scrollLeft = element.scrollLeft + x;
  });
}

type Side = "top" | "left" | "right" | "bottom";

export function getLayerStyle(layer: HTMLElement): Record<Side, number | null> {
  const styles = layer.style;

  function getValue(value: string | undefined | null) {
    if (!value) {
      return null;
    }

    return parseInt(value.replace("px", ""), 10);
  }

  return ["top", "left", "right", "bottom"].reduce(
    (style, key) => {
      return {
        ...style,
        [key]: getValue(styles[key])
      };
    },
    {} as Record<Side, number | null>
  );
}

export function expectLayerStyle(
  layer: HTMLElement,
  style: Partial<Record<Side, number>>
) {
  const layerStyle = getLayerStyle(layer);

  Object.keys(style).forEach(key => {
    expect(layerStyle[key]).toEqual(style[key]);
  });
}

export const wait = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const nextFrame = () => wait(20);

export function centerAndTrigger(tools: RenderResult) {
  const scrollbox = tools.getByTestId("scrollbox");
  const trigger = tools.getByText("trigger");

  scrollToCenter(scrollbox);

  fireEvent.click(trigger);

  const layer = tools.getByText("layer");

  return layer;
}

export function ignoreWindowErrors(test: () => void) {
  const onErrorBackup = window.onerror;
  window.onerror = () => null;
  const consoleError = console.error;
  console.error = () => null;

  test();

  window.onerror = onErrorBackup;
  console.error = consoleError;
}

export function ignoreWindowErrorsCallback(test: () => void, callback: any) {
  const onErrorBackup = window.onerror;
  window.onerror = callback;
  const consoleError = console.error;
  console.error = () => null;

  test();

  window.onerror = onErrorBackup;
  console.error = consoleError;
}
