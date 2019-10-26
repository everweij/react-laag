import * as React from "react";
import { cleanup, render, fireEvent } from "@testing-library/react";

import ToggleLayer from "../ToggleLayer";

import { ignoreWindowErrorsCallback } from "./util";

afterEach(cleanup);

xdescribe("Warnings / Errors", () => {
  it("throws an error when no valid triggerRef was found", async done => {
    function ToggleLayerTest() {
      return (
        <ToggleLayer
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
          {({ toggle }) => (
            <div
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

    ignoreWindowErrorsCallback(
      () => {
        fireEvent.click(tools.getByText("trigger"));
      },
      () => done()
    );
  });

  it("throws an error when no valid layer ref was found", done => {
    function ToggleLayerTest() {
      return (
        <ToggleLayer
          placement={{ anchor: "BOTTOM_CENTER" }}
          renderLayer={props =>
            props.isOpen ? (
              <div
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

    ignoreWindowErrorsCallback(
      () => {
        fireEvent.click(tools.getByText("trigger"));
      },
      () => done()
    );
  });
});
