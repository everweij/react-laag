import * as React from "react";
import expect from "expect";
import { cleanup, render, fireEvent } from "@testing-library/react";
import ToggleLayer from "../../ToggleLayer";

import {
  nextFrame,
  ToggleLayerTest,
  ScrollBox,
  centerAndTrigger,
  scroll
} from "./util";

afterEach(cleanup);

describe("Misc behavior", () => {
  it("closes the layer when clicked outside the layer/trigger and `closeOnOutsideClick` was set", async () => {
    function ToggleLayerTest() {
      return (
        <ToggleLayer
          closeOnOutsideClick
          placement={{ anchor: "BOTTOM_CENTER" }}
          renderLayer={props =>
            props.isOpen ? (
              <div
                ref={props.layerProps.ref}
                style={{
                  ...props.layerProps.style,
                  width: 100,
                  height: 100,
                  backgroundColor: "green"
                }}
              >
                layer
              </div>
            ) : null
          }
        >
          {({ toggle, triggerRef }) => (
            <div
              ref={triggerRef}
              onClick={toggle}
              style={{
                width: 50,
                height: 50,
                backgroundColor: "blue",
                color: "white"
              }}
            >
              trigger
            </div>
          )}
        </ToggleLayer>
      );
    }

    const tools = render(<ToggleLayerTest />);

    fireEvent.click(tools.getByText("trigger"));

    await nextFrame();

    fireEvent.click(document.body);

    await nextFrame();

    expect(tools.queryByText("layer")).toBeFalsy();
  });

  it("calls a callback when clicked outside the layer/trigger and `onOutsideClick` was set", async () => {
    let called = false;

    function ToggleLayerTest() {
      return (
        <ToggleLayer
          onOutsideClick={() => (called = true)}
          placement={{ anchor: "BOTTOM_CENTER" }}
          renderLayer={props =>
            props.isOpen ? (
              <div
                ref={props.layerProps.ref}
                style={{
                  ...props.layerProps.style,
                  width: 100,
                  height: 100,
                  backgroundColor: "green"
                }}
              >
                layer
              </div>
            ) : null
          }
        >
          {({ toggle, triggerRef }) => (
            <div
              ref={triggerRef}
              onClick={toggle}
              style={{
                width: 50,
                height: 50,
                backgroundColor: "blue",
                color: "white"
              }}
            >
              trigger
            </div>
          )}
        </ToggleLayer>
      );
    }

    const tools = render(<ToggleLayerTest />);

    fireEvent.click(tools.getByText("trigger"));

    await nextFrame();

    fireEvent.click(document.body);

    await nextFrame();

    expect(called).toBeTruthy();
  });

  it("closes the layer when the layer partially disappears and `closeOnDisappear=partial` was set", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{ anchor: "BOTTOM_CENTER" }}
          closeOnDisappear="partial"
        />
      </ScrollBox>
    );

    centerAndTrigger(tools);

    scroll(tools.getByTestId("scrollbox"), 0, -100);

    await nextFrame();

    expect(tools.queryByText("layer")).toBeFalsy();
  });

  it("calls a callback when layer partially disappears and `onDisappear` was set", async () => {
    let type: any = null;

    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{ anchor: "BOTTOM_CENTER" }}
          closeOnDisappear="partial"
          onDisappear={arg => (type = arg)}
        />
      </ScrollBox>
    );

    centerAndTrigger(tools);

    scroll(tools.getByTestId("scrollbox"), 0, -100);

    await nextFrame();

    expect(type).toBe("partial");
  });

  it("closes the layer when the layer fully disappears and `closeOnDisappear=full` was set", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{ anchor: "BOTTOM_CENTER" }}
          closeOnDisappear="full"
        />
      </ScrollBox>
    );

    centerAndTrigger(tools);

    scroll(tools.getByTestId("scrollbox"), 0, -200);

    await nextFrame();

    expect(tools.queryByText("layer")).toBeFalsy();
  });

  it("calls a callback when layer fully disappears and `onDisappear` was set", async () => {
    let type: any = null;

    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{ anchor: "BOTTOM_CENTER" }}
          closeOnDisappear="full"
          onDisappear={arg => (type = arg)}
        />
      </ScrollBox>
    );

    centerAndTrigger(tools);

    scroll(tools.getByTestId("scrollbox"), 0, -200);

    await nextFrame();

    expect(type).toBe("full");
  });
});
