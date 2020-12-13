import * as React from "react";
import { render, cleanup, waitFor } from "@testing-library/react";
import { scroll } from "./test-util";
import {
  useTrackElements,
  UseTrackElementsProps
} from "../src/useTrackElements";
import { ResizeObserver, ResizeObserverCallback } from "../src/types";
import { mockFn } from "./test-util";

class MockResizeObserver implements ResizeObserver {
  static observer: ResizeObserverCallback;

  constructor(observer: ResizeObserverCallback) {
    MockResizeObserver.observer = observer;
    // call the observer initially to fake default behavior
    observer(null!, null!);
  }

  observe() {}

  disconnect() {}

  unobserve() {}

  static triggerResize() {
    this.observer(null!, null!);
  }
}

const SCROLL_CONTAINER_SIZE = 1000;
const FILLER_SIZE = 2000;
const TRIGGER_SIZE = 100;
const LAYER_SIZE = 200;

const TRIGGER_STYLE: React.CSSProperties = {
  position: "relative",
  top: 500,
  left: 500,
  width: TRIGGER_SIZE,
  height: TRIGGER_SIZE,
  backgroundColor: "green"
};

const CONTAINER_STYLE: React.CSSProperties = {
  backgroundColor: "lightgrey",
  position: "relative",
  top: 0,
  left: 0,
  width: SCROLL_CONTAINER_SIZE,
  height: SCROLL_CONTAINER_SIZE,
  overflow: "auto"
};

const FILLER_STYLE: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  height: FILLER_SIZE,
  width: FILLER_SIZE
};

const LAYER_STYLE: React.CSSProperties = {
  width: LAYER_SIZE,
  height: LAYER_SIZE,
  backgroundColor: "blue"
};

type TestCaseProps = {
  onChange: UseTrackElementsProps["onChange"];
  showLayer: boolean;
  swapTrigger?: boolean;
};

function TestCase({ onChange, showLayer, swapTrigger }: TestCaseProps) {
  const { triggerRef, layerRef } = useTrackElements({
    overflowContainer: false,
    onChange,
    enabled: showLayer,
    environment: window,
    ResizeObserverPolyfill: MockResizeObserver,
    ignoreUpdate: false
  });

  return (
    <div data-testid="scroll-container" style={CONTAINER_STYLE}>
      {swapTrigger ? (
        <button data-testid="trigger" ref={triggerRef} style={TRIGGER_STYLE} />
      ) : (
        <div data-testid="trigger" ref={triggerRef} style={TRIGGER_STYLE} />
      )}
      {showLayer && (
        <div data-testid="layer" ref={layerRef} style={LAYER_STYLE} />
      )}
      <div style={FILLER_STYLE} />
    </div>
  );
}

describe("useTrackElements", () => {
  afterEach(cleanup);

  it("calls the onChange callback when tracking is enabled on mount", async () => {
    const onChange = mockFn();

    const tools = render(<TestCase showLayer={true} onChange={onChange} />);

    await tools.findByTestId("layer");

    expect(onChange.callCount()).toBe(1);

    const [
      {
        layer,
        trigger,
        scrollContainers: [scrollContainer]
      },
      scrollOffsets,
      borderOffsets
    ] = onChange.lastArgs();

    expect(layer).toBeInstanceOf(HTMLElement);
    expect(trigger).toBeInstanceOf(HTMLElement);
    expect(scrollContainer).toBeInstanceOf(HTMLElement);
    expect(scrollOffsets).toEqual({ top: 0, left: 0 });
    expect(borderOffsets).toEqual({ top: 0, left: 0 });
  });

  it("reacts to scroll events", async () => {
    const onChange = mockFn();

    const tools = render(<TestCase showLayer={true} onChange={onChange} />);

    const container = await tools.findByTestId("scroll-container");

    scroll(container, { top: 200 });

    await waitFor(() => {
      expect(onChange.callCount()).toBe(2); // mount + scroll
    });
  });

  it("stops reacting to scroll events after showLayer is set to false", async () => {
    const onChange = mockFn();

    const tools = render(<TestCase showLayer={true} onChange={onChange} />);
    tools.rerender(<TestCase showLayer={false} onChange={onChange} />);

    const container = await tools.findByTestId("scroll-container");
    scroll(container, { top: 200 });

    expect(onChange.callCount()).toBe(1); // just mount
  });

  it("reacts to resize-observer events", async () => {
    const onChange = mockFn();

    const tools = render(<TestCase showLayer={true} onChange={onChange} />);

    await tools.findByTestId("layer");

    MockResizeObserver.triggerResize();

    expect(onChange.callCount()).toBe(2); // mount + resize
  });

  it("reacts to changes in references", async () => {
    const onChange = mockFn();

    const tools = render(
      <TestCase showLayer={true} onChange={onChange} swapTrigger={false} />
    );

    tools.rerender(
      <TestCase showLayer={true} onChange={onChange} swapTrigger={true} />
    );

    // mount + re-render + reference change
    expect(onChange.callCount()).toBe(3);
  });
});
