import expect from "expect";
import * as React from "react";
import {
  RenderResult,
  render as baseRender,
  fireEvent,
  cleanup as baseCleanup,
  waitFor
} from "@testing-library/react";
import { baseOptions, TestCaseOptions } from "../../sandbox/options";
import { TestCase } from "../../sandbox/TestCase";
import { LayerSide, Placement, PLACEMENT_TYPES } from "../../src";
import { IBounds } from "../../src/Bounds";
import { setViewport } from "@web/test-runner-commands";

export async function fixViewport() {
  return setViewport({ width: 1400, height: 900 });
}

function elementToBounds(element: HTMLElement): IBounds {
  const {
    top,
    left,
    bottom,
    right,
    width,
    height
  } = element.getBoundingClientRect();

  return { top, left, bottom, right, width, height };
}

interface CustomRenderResult extends RenderResult {
  getTrigger: () => HTMLElement;
  getLayer: () => HTMLElement;
  getArrow: () => HTMLElement;
  clickTrigger: () => void;
  clickLayer: () => void;
  clickOutside: () => void;
  scrollContainer: (top: number, left: number) => void;
  scrollWindow: (top: number, left: number) => void;
  getLayerBounds: () => IBounds;
  getArrowBounds: () => IBounds;
  reRender: (options: Partial<TestCaseOptions>) => void;
  getLayerSide: () => LayerSide;
  expectBounds: (props: {
    layerSide: LayerSide;
    layer: IBounds;
    arrow: IBounds;
  }) => Promise<void>;
}

function scrollWindow(top: number, left: number) {
  window.scrollTo(left, top);
}

export type ExpectBoundsProps = {
  layerSide: LayerSide;
  layer: IBounds;
  arrow: IBounds;
};

export function render(
  options: Partial<TestCaseOptions> = {}
): CustomRenderResult {
  const tools = baseRender(<TestCase {...{ ...baseOptions, ...options }} />);

  function getTrigger() {
    return tools.getByTestId("trigger");
  }

  function getLayer() {
    return tools.getByTestId("layer");
  }

  function getArrow() {
    return tools.getByTestId("arrow");
  }

  function clickTrigger() {
    fireEvent.click(getTrigger());
  }

  async function clickLayer() {
    fireEvent.click(getLayer());
  }

  async function clickOutside() {
    fireEvent.click(document.body);
  }

  function scrollContainer(top: number, left: number) {
    const scrollContainer = tools.getByTestId("scroll-container");
    scrollContainer.scrollTop = top;
    scrollContainer.scrollLeft = left;
  }

  function getLayerBounds() {
    const layer = getLayer();
    return elementToBounds(layer);
  }

  function getArrowBounds() {
    const arrow = getArrow();
    return elementToBounds(arrow);
  }

  function getLayerSide() {
    const element = tools.getByTestId("layer-side");
    return element.innerText as LayerSide;
  }

  async function expectBounds(props: ExpectBoundsProps) {
    return waitFor(() => {
      expect(getLayerSide()).toEqual(props.layerSide);
      expect(getLayerBounds()).toEqual(props.layer);
      expect(getArrowBounds()).toEqual(props.arrow);
    });
  }

  function reRender(options: Partial<TestCaseOptions> = {}) {
    tools.rerender(<TestCase {...{ ...baseOptions, ...options }} />);
  }

  return {
    ...tools,
    getTrigger,
    getLayer,
    clickTrigger,
    clickLayer,
    clickOutside,
    scrollContainer,
    scrollWindow,
    getLayerBounds,
    reRender,
    expectBounds,
    getLayerSide,
    getArrowBounds,
    getArrow
  };
}

export function getLayerSideByPlacement(placement: Placement): LayerSide {
  return placement.split("-")[0] as LayerSide;
}

export async function cleanup() {
  baseCleanup();
  scrollWindow(0, 0);
}

export const PLACEMENTS_NO_CENTER = PLACEMENT_TYPES.filter(
  placement => placement !== "center"
);
