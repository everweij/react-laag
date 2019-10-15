import * as React from "react";
import expect from "expect";
import { render, cleanup } from "@testing-library/react";

import {
  ToggleLayerTest,
  ScrollBox,
  scroll,
  nextFrame,
  centerAndTrigger
} from "./util";

const TRIGGER_OFFSET = 10;
const SCROLL_OFFSET = 10;

afterEach(cleanup);

describe("Auto Adjust", () => {
  it("renders the layer as close to the prioritized anchor as possible (BOTTOM_CENTER / prefer left)", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "BOTTOM_CENTER",
            preferX: "LEFT",
            autoAdjust: true
          }}
        />
      </ScrollBox>
    );

    const layer = centerAndTrigger(tools);
    scroll(tools.getByTestId("scrollbox"), 190, 0);

    await nextFrame();
    expect(layer.style.left).toEqual("940px");
  });

  it("renders the layer as close to the prioritized anchor as possible (BOTTOM_CENTER / prefer right)", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "BOTTOM_CENTER",
            preferX: "RIGHT",
            autoAdjust: true
          }}
        />
      </ScrollBox>
    );

    const layer = centerAndTrigger(tools);
    scroll(tools.getByTestId("scrollbox"), -190, 0);

    await nextFrame();
    expect(layer.style.right).toEqual("-560px");
  });

  it("renders the layer as close to the prioritized anchor as possible (LEFT_CENTER / prefer top)", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "LEFT_CENTER",
            preferY: "TOP",
            autoAdjust: true
          }}
        />
      </ScrollBox>
    );

    const layer = centerAndTrigger(tools);
    scroll(tools.getByTestId("scrollbox"), 0, 190);

    await nextFrame();
    expect(layer.style.top).toEqual("940px");
  });

  it("renders the layer as close to the prioritized anchor as possible (LEFT_CENTER / prefer bottom)", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "LEFT_CENTER",
            preferY: "BOTTOM",
            autoAdjust: true
          }}
        />
      </ScrollBox>
    );

    const layer = centerAndTrigger(tools);
    scroll(tools.getByTestId("scrollbox"), 0, -190);

    await nextFrame();
    expect(layer.style.bottom).toEqual("-560px");
  });

  it("renders the layer as close to the prioritized anchor as possible with limited available anchors", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "BOTTOM_CENTER",
            preferX: "LEFT",
            autoAdjust: true,
            possibleAnchors: ["BOTTOM_CENTER", "BOTTOM_RIGHT", "RIGHT_CENTER"]
          }}
        />
      </ScrollBox>
    );

    const layer = centerAndTrigger(tools);

    // adjusting layer on same bottom anchor
    scroll(tools.getByTestId("scrollbox"), -190, 0);
    await nextFrame();
    expect(layer.style.right).toEqual("-560px");

    // since BOTTOM_LEFT is not on the possible anchors,
    // it should fallback to RIGHT_CENTER
    scroll(tools.getByTestId("scrollbox"), 190 * 2, 0);
    await nextFrame();

    expect(layer.style.top).toEqual("925px");
    expect(layer.style.left).toEqual("1050px");
  });

  it("snaps to the closest prioritized anchor when `snap` is enabled", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "BOTTOM_RIGHT",
            preferX: "LEFT",
            autoAdjust: true,
            snapToAnchor: true
          }}
        />
      </ScrollBox>
    );

    const layer = centerAndTrigger(tools);

    scroll(tools.getByTestId("scrollbox"), 160, 0);

    await nextFrame();

    // expect to snap to BOTTOM_CENTER
    expect(layer.style.left).toEqual("925px");
    expect(layer.style.top).toEqual("1050px");
  });

  it("snaps to the closest prioritized anchor available (`possibleAnchors` is defined)", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "BOTTOM_CENTER",
            preferX: "LEFT",
            autoAdjust: true,
            snapToAnchor: true,
            possibleAnchors: ["BOTTOM_CENTER", "RIGHT_CENTER"]
          }}
        />
      </ScrollBox>
    );

    const layer = centerAndTrigger(tools);

    scroll(tools.getByTestId("scrollbox"), 200, 0);

    await nextFrame();

    // expect to snap to RIGHT_CENTER
    expect(layer.style.top).toEqual("925px");
    expect(layer.style.left).toEqual("1050px");
  });

  it("renders a consistent space between trigger and layer when `triggerOffset` is set", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "BOTTOM_CENTER",
            preferX: "LEFT",
            autoAdjust: true,
            snapToAnchor: true,
            possibleAnchors: ["BOTTOM_CENTER", "RIGHT_CENTER"],
            triggerOffset: TRIGGER_OFFSET
          }}
        />
      </ScrollBox>
    );

    const layer = centerAndTrigger(tools);

    scroll(tools.getByTestId("scrollbox"), 200, 0);

    await nextFrame();

    // expect to snap to RIGHT_CENTER
    expect(layer.style.top).toEqual("925px");
    expect(layer.style.left).toEqual(`${1050 + TRIGGER_OFFSET}px`);
  });

  it("renders a consistent space between scrollbox and layer when `scrollOffset` is set", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "BOTTOM_CENTER",
            preferX: "LEFT",
            autoAdjust: true,
            snapToAnchor: true,
            possibleAnchors: ["BOTTOM_CENTER", "RIGHT_CENTER"],
            scrollOffset: SCROLL_OFFSET
          }}
        />
      </ScrollBox>
    );

    const layer = centerAndTrigger(tools);

    scroll(tools.getByTestId("scrollbox"), 200 - SCROLL_OFFSET, 0);

    await nextFrame();

    // expect to snap to RIGHT_CENTER
    expect(layer.style.top).toEqual("925px");
    expect(layer.style.left).toEqual(`1050px`);
  });

  it("renders the best suitable anchor when none of the possible anchors fit 100%", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "BOTTOM_CENTER",
            preferX: "LEFT",
            autoAdjust: true
          }}
        />
      </ScrollBox>
    );

    const layer = centerAndTrigger(tools);
    await nextFrame();

    scroll(tools.getByTestId("scrollbox"), 260, -260);

    await nextFrame();

    expect(layer.style.bottom).toEqual("-550px");
    expect(layer.style.left).toEqual(`1050px`);
  });

  it("renders the best suitable anchor inside nested scroll containers", async () => {
    const tools = render(
      <ScrollBox testId="scrollbox2">
        <ScrollBox testId="scrollbox">
          <ToggleLayerTest
            placement={{
              anchor: "BOTTOM_CENTER",
              preferX: "LEFT",
              autoAdjust: true,
              snapToAnchor: true
            }}
          />
        </ScrollBox>
      </ScrollBox>
    );

    // Setup everything so that BOTTOM_CENTER is clear
    scroll(tools.getByTestId("scrollbox2"), 64, 64);
    await nextFrame();

    const layer = centerAndTrigger(tools);

    scroll(tools.getByTestId("scrollbox"), -160, 0);
    await nextFrame();

    // expect to render BOTTOM_CENTER
    expect(layer.style.left).toEqual("925px");
    expect(layer.style.top).toEqual("1050px");

    // Move outer scroll parent slightly
    scroll(tools.getByTestId("scrollbox2"), -20, 0);
    await nextFrame();

    // expect to render BOTTOM_RIGHT
    expect(layer.style.right).toEqual("-550px");
  });

  it("renders different dimensions, based on the layerSide", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "CENTER",
            preferX: "LEFT",
            possibleAnchors: [
              "BOTTOM_CENTER",
              "TOP_CENTER",
              "LEFT_CENTER",
              "RIGHT_CENTER"
            ],
            autoAdjust: true,
            snapToAnchor: true,
            layerDimensions: layerSide => ({
              width: layerSide === "center" ? 200 : 300,
              height: layerSide === "center" ? 200 : 100
            })
          }}
        />
      </ScrollBox>
    );

    const layer = centerAndTrigger(tools);
    await nextFrame();
    expect(layer.style.width).toEqual("200px");
    expect(layer.style.height).toEqual("200px");

    scroll(tools.getByTestId("scrollbox"), 190, 0);

    await nextFrame();
    expect(layer.style.left).toEqual("1050px");
    expect(layer.style.width).toEqual("300px");
    expect(layer.style.height).toEqual("100px");
  });
});
