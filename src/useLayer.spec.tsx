import * as React from "react";
import {
  render,
  cleanup,
  fireEvent,
  waitForElementToBeRemoved,
  waitFor
} from "@testing-library/react";
import { scroll } from "./test-utils";
import { useLayer } from "./useLayer";
import { getPixelValue } from "./util";

import {
  CONTAINER_STYLE,
  TRIGGER_STYLE,
  LAYER_STYLE,
  FILLER_STYLE,
  SUBJECTS_BOUNDS
} from "./__mock";

const { TRIGGER, LAYER } = SUBJECTS_BOUNDS;

function getCssPosition(element: HTMLElement) {
  return {
    top: getPixelValue(element.style.top),
    left: getPixelValue(element.style.left)
  };
}

function Nested() {
  const [isOpen, setOpen] = React.useState(false);

  const { layerProps, triggerProps, renderLayer } = useLayer({
    isOpen,
    onMasterClose: () => setOpen(false),
    onOutsideClick: () => setOpen(false),
    auto: true,
    possiblePlacements: ["top-center", "bottom-center"]
  });

  return (
    <>
      <div
        data-testid="nested-trigger"
        {...triggerProps}
        style={TRIGGER_STYLE}
        onClick={() => setOpen(true)}
      ></div>
      {isOpen &&
        renderLayer(
          <div
            data-testid="nested-layer"
            {...layerProps}
            style={{ ...layerProps.style, width: 100, height: 100 }}
          >
            Nested Layer
          </div>
        )}
    </>
  );
}

type TestCaseProps = { initialOpen?: boolean };

function TestCase({ initialOpen = false }: TestCaseProps) {
  const [isOpen, setOpen] = React.useState(initialOpen);

  const {
    layerProps,
    layerSide,
    triggerProps,
    renderLayer,
    triggerBounds
  } = useLayer({
    isOpen,
    onOutsideClick: () => setOpen(false),
    onDisappear: () => {
      setOpen(false);
    },
    auto: true,
    possiblePlacements: ["top-center", "bottom-center"]
  });

  return (
    <div data-testid="scroll-container" style={CONTAINER_STYLE}>
      <div
        data-testid="trigger"
        {...triggerProps}
        style={TRIGGER_STYLE}
        onClick={() => setOpen(true)}
      ></div>
      {isOpen &&
        renderLayer(
          <div
            data-testid="layer"
            {...layerProps}
            style={{ ...layerProps.style, ...LAYER_STYLE }}
          >
            {layerSide}
            <Nested />
          </div>
        )}
      <div style={FILLER_STYLE} />
      <div data-testid="trigger-bounds">{JSON.stringify(triggerBounds)}</div>
    </div>
  );
}

describe("useLayer()", () => {
  afterEach(cleanup);

  it("opens the layer when the trigger was clicked", async () => {
    const tools = render(<TestCase />);

    const trigger = tools.getByTestId("trigger");

    fireEvent.click(trigger);

    const layer = await tools.findByTestId("layer");

    expect(layer.innerText).toBe("top");

    expect(getCssPosition(layer)).toEqual({
      top: TRIGGER.top - LAYER.height,
      left: TRIGGER.left + TRIGGER.width / 2 - LAYER.width / 2
    });
  });

  it("closes the layer when the clicked outside", async () => {
    const tools = render(<TestCase />);

    const trigger = tools.getByTestId("trigger");
    fireEvent.click(trigger);

    await tools.findByTestId("layer");

    // click outside
    fireEvent.click(tools.getByTestId("scroll-container"));

    expect(tools.queryByTestId("layer")).toBeFalsy();
  });

  it("does not close when clicked inside the layer", async () => {
    const tools = render(<TestCase />);

    const trigger = tools.getByTestId("trigger");
    fireEvent.click(trigger);

    const layer = await tools.findByTestId("layer");

    fireEvent.click(layer);

    // layer should still be open
    await tools.findByTestId("layer");
  });

  it("does not close when clicked inside the layer", async () => {
    const tools = render(<TestCase />);

    const trigger = tools.getByTestId("trigger");
    fireEvent.click(trigger);

    const layer = await tools.findByTestId("layer");

    fireEvent.click(layer);

    // layer should still be open
    await tools.findByTestId("layer");
  });

  it("flips the layer to placement `bottom-center` on scroll", async () => {
    const tools = render(<TestCase />);

    const container = tools.getByTestId("scroll-container");

    // open layer
    const trigger = tools.getByTestId("trigger");
    fireEvent.click(trigger);

    // scroll so that trigger is at top of container
    scroll(container, {
      top: TRIGGER.top
    });

    await waitFor(() => {
      const layer = tools.getByTestId("layer");

      expect(getCssPosition(layer).top).toBe(TRIGGER.height);
      expect(layer.innerText).toBe("bottom");
    });
  });

  it("provides correctly updates `triggerBounds` on scroll", async () => {
    const tools = render(<TestCase />);

    const container = tools.getByTestId("scroll-container");

    // open layer
    const trigger = tools.getByTestId("trigger");
    fireEvent.click(trigger);

    scroll(container, {
      top: 100
    });

    await waitFor(() => {
      const triggerBounds = JSON.parse(
        tools.getByTestId("trigger-bounds").innerText
      );

      expect(triggerBounds.top).toBe(TRIGGER.top - 100);
    });
  });

  it("renders / positions the layer immediately when `isOpen` is true on mount", async () => {
    const tools = render(<TestCase initialOpen />);

    const layer = await tools.findByTestId("layer");

    expect(layer.innerText).toBe("top");

    expect(getCssPosition(layer)).toEqual({
      top: TRIGGER.top - LAYER.height,
      left: TRIGGER.left + TRIGGER.width / 2 - LAYER.width / 2
    });
  });

  it("closes the layer when the layer disappears from the screen", async () => {
    const tools = render(<TestCase />);

    const container = tools.getByTestId("scroll-container");

    // open layer
    const trigger = tools.getByTestId("trigger");
    fireEvent.click(trigger);

    // scroll so that trigger is outside boundaries
    // of the scroll-container
    scroll(container, {
      top: TRIGGER.bottom + 10
    });

    await waitForElementToBeRemoved(() => tools.queryByTestId("layer"));
  });

  it("deals with nested layers", async () => {
    const tools = render(<TestCase />);

    // open layer
    const trigger = tools.getByTestId("trigger");
    fireEvent.click(trigger);

    // open nested layer
    const nestedTrigger = await tools.findByTestId("nested-trigger");
    fireEvent.click(nestedTrigger);

    await tools.findByTestId("nested-layer");

    // close nested-layer by clicking on parent layer (outside)
    fireEvent.click(await tools.findByTestId("layer"));

    // nested layer should be closed
    await waitFor(() =>
      expect(tools.queryByTestId("nested-layer")).toBeFalsy()
    );

    // open nested layer again
    fireEvent.click(nestedTrigger);

    // click on nested layer
    fireEvent.click(await tools.findByTestId("nested-layer"));

    // both layer as nested-layer should be still open
    await tools.findByTestId("layer");
    await tools.findByTestId("nested-layer");

    // click somewhere inside container
    fireEvent.click(tools.getByTestId("scroll-container"));

    // Both layers should be closed now
    await waitFor(() => {
      expect(tools.queryByTestId("nested-layer")).toBeFalsy();
      expect(tools.queryByTestId("layer")).toBeFalsy();
    });
  });
});
