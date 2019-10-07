import * as React from "react";
import expect from "expect";
import { cleanup, render, fireEvent } from "@testing-library/react";

import ResizeObserver from "resize-observer-polyfill";

import ToggleLayer from "../../ToggleLayer";

import {
  ScrollBox,
  centerAndTrigger,
  expectLayerStyle,
  CONTAINER_DIMENSIONS,
  LAYER_DIMENSIONS,
  TRIGGER_DIMENSIONS,
  nextFrame,
  ignoreWindowErrors
} from "./util";

afterEach(cleanup);

type LayerProps = {
  style?: React.CSSProperties;
};

const Layer = React.forwardRef(function Layer({ style }: LayerProps, ref: any) {
  const [height, setHeight] = React.useState(LAYER_DIMENSIONS.height);
  const [key, setKey] = React.useState(1);

  return (
    <div
      key={key}
      ref={ref}
      style={{
        ...style,
        height,
        width: LAYER_DIMENSIONS.width,
        backgroundColor: "green"
      }}
      onClick={() => {
        if (height === LAYER_DIMENSIONS.height) {
          setHeight(LAYER_DIMENSIONS.height + 100);
        } else {
          setHeight(LAYER_DIMENSIONS.height);
        }
      }}
    >
      layer{" "}
      <button
        onClick={evt => {
          evt.stopPropagation();
          setKey(key + 1);
        }}
      >
        change-layer
      </button>
    </div>
  );
});

type TriggerProps = {
  onClick: () => void;
};

const Trigger = React.forwardRef(function Trigger(
  { onClick }: TriggerProps,
  ref: any
) {
  const [height, setHeight] = React.useState(TRIGGER_DIMENSIONS.height);
  const [key, setKey] = React.useState(1);

  return (
    <div
      key={key}
      ref={ref}
      onClick={onClick}
      style={{
        width: TRIGGER_DIMENSIONS.width,
        height,
        backgroundColor: "blue",
        color: "white"
      }}
    >
      trigger
      <button
        onClick={evt => {
          evt.stopPropagation();
          if (height === TRIGGER_DIMENSIONS.height) {
            setHeight(TRIGGER_DIMENSIONS.height + 50);
          } else {
            setHeight(TRIGGER_DIMENSIONS.height);
          }
        }}
      >
        change-trigger-height
      </button>
      <button
        onClick={evt => {
          evt.stopPropagation();
          setKey(key + 1);
        }}
      >
        change-trigger
      </button>
    </div>
  );
});

export function ToggleLayerTest({
  showExtraElement,
  RO_Polyfill
}: {
  showExtraElement?: boolean;
  RO_Polyfill?: any;
}) {
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
      <div>
        {showExtraElement && (
          <div style={{ backgroundColor: "red", width: 100, height: 100 }} />
        )}
        <ToggleLayer
          ResizeObserver={RO_Polyfill}
          placement={{
            anchor: "BOTTOM_CENTER",
            autoAdjust: true
          }}
          renderLayer={props =>
            props.isOpen ? <Layer {...props.layerProps} /> : null
          }
        >
          {({ triggerRef, toggle }) => (
            <Trigger ref={triggerRef} onClick={toggle} />
          )}
        </ToggleLayer>
      </div>
    </div>
  );
}

describe("Layout", () => {
  it("positions the layer correctly when React updates higher in the tree occur", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest />
      </ScrollBox>
    );

    expectLayerStyle(centerAndTrigger(tools), {
      top: 1050,
      left: 925
    });

    tools.rerender(
      <ScrollBox>
        <ToggleLayerTest showExtraElement />
      </ScrollBox>
    );

    await nextFrame();

    expectLayerStyle(tools.getByText("layer"), {
      top: 1000,
      left: 1050
    });
  });

  it("positions the layer correctly when the trigger changes in size", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest />
      </ScrollBox>
    );

    expectLayerStyle(centerAndTrigger(tools), {
      top: 1050,
      left: 925
    });
    await nextFrame();

    fireEvent.click(tools.getByText("change-trigger-height"));

    await nextFrame();
    await nextFrame();

    expectLayerStyle(tools.getByText("layer"), {
      top: 1075,
      left: 925
    });
  });

  it("positions the layer correctly when the layer changes in size", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest />
      </ScrollBox>
    );

    expectLayerStyle(centerAndTrigger(tools), {
      top: 1050,
      left: 925
    });
    await nextFrame();

    fireEvent.click(tools.getByText("layer"));

    await nextFrame();

    expectLayerStyle(tools.getByText("layer"), {
      top: 950,
      left: 1050
    });
  });

  it("throws when no ResizeObserver constructor could be found", () => {
    const backup = (window as any).ResizeObserver;
    (window as any).ResizeObserver = undefined;

    ignoreWindowErrors(() => {
      expect(() => {
        render(
          <ScrollBox>
            <ToggleLayerTest />
          </ScrollBox>
        );
      }).toThrow(
        "This browser does not support `ResizeObserver` out of the box. Please provide a polyfill as a prop."
      );
    });

    (window as any).ResizeObserver = backup;
  });

  it("uses a polyfill when a ResizeObserver constructor was passed as a prop", () => {
    const backup = (window as any).ResizeObserver;
    (window as any).ResizeObserver = undefined;

    ignoreWindowErrors(() => {
      expect(() => {
        render(
          <ScrollBox>
            <ToggleLayerTest RO_Polyfill={ResizeObserver} />
          </ScrollBox>
        );
      }).not.toThrow();
    });

    (window as any).ResizeObserver = backup;
  });

  it("positions the layer correctly when a trigger's ref changes (different trigger component)", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest />
      </ScrollBox>
    );

    expectLayerStyle(centerAndTrigger(tools), {
      top: 1050,
      left: 925
    });
    await nextFrame();

    fireEvent.click(tools.getByText("change-trigger"));

    await nextFrame();

    expectLayerStyle(tools.getByText("layer"), {
      top: 1050,
      left: 925
    });
  });

  it("positions the layer correctly when a layer's ref changes (different layer component)", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest />
      </ScrollBox>
    );

    expectLayerStyle(centerAndTrigger(tools), {
      top: 1050,
      left: 925
    });
    await nextFrame();

    fireEvent.click(tools.getByText("change-layer"));

    await nextFrame();

    expectLayerStyle(tools.getByText("layer"), {
      top: 1050,
      left: 925
    });
  });
});
