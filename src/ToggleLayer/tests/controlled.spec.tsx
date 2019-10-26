import * as React from "react";
import expect from "expect";
import { cleanup, render, fireEvent } from "@testing-library/react";

import ToggleLayer from "../ToggleLayer";

import { nextFrame, ignoreWindowErrorsCallback } from "./util";

afterEach(cleanup);

function ToggleLayerTest({
  isOpen,
  handler
}: {
  isOpen: boolean;
  handler?: string;
}) {
  return (
    <ToggleLayer
      isOpen={isOpen}
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
      {({ triggerRef, ...handlers }) => (
        <div
          onClick={() => handlers[handler!]()}
          ref={triggerRef}
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

describe("Controlled", () => {
  it("passes open/close control to the parent when the `isOpen` prop is defined", async () => {
    const tools = render(<ToggleLayerTest isOpen={false} />);

    expect(tools.queryByText("layer")).toBeFalsy();

    tools.rerender(<ToggleLayerTest isOpen={true} />);

    await nextFrame();

    expect(tools.queryByText("layer")).toBeTruthy();
  });

  it("throws when `toggle` is called while using the `isOpen` prop", done => {
    ignoreWindowErrorsCallback(
      () => {
        const tools = render(
          <ToggleLayerTest isOpen={true} handler="toggle" />
        );
        fireEvent.click(tools.getByText("trigger"));
      },
      () => done()
    );
  });

  it("throws when `close` is called while using the `isOpen` prop", done => {
    ignoreWindowErrorsCallback(
      () => {
        const tools = render(<ToggleLayerTest isOpen={true} handler="close" />);
        fireEvent.click(tools.getByText("trigger"));
      },
      () => done()
    );
  });

  it("throws when `open` is called while using the `isOpen` prop", done => {
    ignoreWindowErrorsCallback(
      () => {
        const tools = render(<ToggleLayerTest isOpen={true} handler="open" />);
        fireEvent.click(tools.getByText("trigger"));
      },
      () => done()
    );
  });

  it("passes styling control to the parent when the `onStyle` prop is defined", async () => {
    let layerStyle: React.CSSProperties | null = null;

    function ToggleLayerTest() {
      return (
        <ToggleLayer
          onStyle={style => (layerStyle = style)}
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
          {({ triggerRef, toggle }) => (
            <div
              onClick={toggle}
              ref={triggerRef}
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

    expect(layerStyle!.top).toBe(50);
    expect(layerStyle!.left).toBe(-25);
  });
});
