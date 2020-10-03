import * as React from "react";
import { render, cleanup, waitFor } from "@testing-library/react";
import { scroll, createSpy } from "./test-utils";
import { useTrackBounds, UseTrackBoundsProps } from "./useTrackBounds";
import {
  ResizeObserver,
  SubjectsBounds,
  ResizeObserverCallback
} from "./types";

import {
  CONTAINER_STYLE,
  TRIGGER_STYLE,
  LAYER_STYLE,
  FILLER_STYLE,
  SUBJECTS_BOUNDS
} from "./__mock";

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

type TestCaseProps = {
  fixedMode: boolean;
  onBoundsChange: UseTrackBoundsProps["onBoundsChange"];
  showLayer: boolean;
  swapTrigger?: boolean;
};

function TestCase({
  fixedMode,
  onBoundsChange,
  showLayer,
  swapTrigger
}: TestCaseProps) {
  const { triggerRef, layerRef } = useTrackBounds({
    fixedMode,
    onBoundsChange,
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

describe("useTrackBounds()", () => {
  afterEach(cleanup);

  it("calls the onBoundsChange callback when tracking is enabled on mount", async () => {
    const onBoundsChange = createSpy();

    const tools = render(
      <TestCase
        fixedMode={false}
        showLayer={true}
        onBoundsChange={onBoundsChange}
      />
    );

    await tools.findByTestId("layer");

    expect(onBoundsChange.callCount()).toBe(1);

    const [subjectsBounds] = onBoundsChange.lastArgs() as [SubjectsBounds];

    expect(subjectsBounds.ARROW).toEqual(SUBJECTS_BOUNDS.ARROW);
    expect(subjectsBounds.PARENT).toEqual(SUBJECTS_BOUNDS.PARENT);
    expect(subjectsBounds.TRIGGER).toEqual(SUBJECTS_BOUNDS.TRIGGER);

    expect(subjectsBounds.SCROLL_CONTAINERS.length).toEqual(1);
  });

  it("reacts to scroll events", async () => {
    const onBoundsChange = createSpy();

    const SCROLL_AMOUNT = 200;

    const tools = render(
      <TestCase
        fixedMode={false}
        showLayer={true}
        onBoundsChange={onBoundsChange}
      />
    );

    const container = await tools.findByTestId("scroll-container");

    scroll(container, { top: SCROLL_AMOUNT });

    await waitFor(() => {
      const [subjectsBounds] = onBoundsChange.lastArgs() as [SubjectsBounds];

      expect(onBoundsChange.callCount()).toBe(2);

      // the trigger bounds should have also moved up
      expect(subjectsBounds.TRIGGER).toEqual({
        ...SUBJECTS_BOUNDS.TRIGGER,
        top: SUBJECTS_BOUNDS.TRIGGER.top - SCROLL_AMOUNT,
        bottom: SUBJECTS_BOUNDS.TRIGGER.bottom - SCROLL_AMOUNT
      });
    });
  });

  it("reacts to resize-observer events", async () => {
    const onBoundsChange = createSpy();

    const tools = render(
      <TestCase
        fixedMode={false}
        showLayer={true}
        onBoundsChange={onBoundsChange}
      />
    );

    await tools.findByTestId("layer");

    MockResizeObserver.triggerResize();

    expect(onBoundsChange.callCount()).toBe(2);
  });

  it("reacts to changes in references", async () => {
    const onBoundsChange = createSpy();

    const tools = render(
      <TestCase
        fixedMode={false}
        showLayer={true}
        onBoundsChange={onBoundsChange}
        swapTrigger={false}
      />
    );

    tools.rerender(
      <TestCase
        fixedMode={false}
        showLayer={true}
        onBoundsChange={onBoundsChange}
        swapTrigger={true}
      />
    );

    // 2 extra times -> 1 re-render + 1 reference change
    expect(onBoundsChange.callCount()).toBe(3);
  });
});
