import * as React from "react";
import expect from "expect";
import { cleanup, render, fireEvent } from "@testing-library/react";

import useToggleLayer from "../useToggleLayer";

import { nextFrame } from "./util";

function Test() {
  const [element, { open }] = useToggleLayer(
    ({ isOpen, layerProps }) =>
      isOpen ? (
        <div
          data-testid="layer"
          ref={layerProps.ref}
          style={{
            ...layerProps.style,
            width: 100,
            height: 100,
            backgroundColor: "green"
          }}
        />
      ) : null,
    {
      placement: { anchor: "BOTTOM_CENTER" }
    }
  );

  return (
    <div
      data-testid="wrapper"
      style={{ width: 500, height: 500, position: "relative" }}
      onContextMenu={evt => {
        evt.preventDefault();
        const target = evt.target as HTMLElement;

        const clientRect: ClientRect = {
          top: evt.clientY,
          left: evt.clientX,
          bottom: evt.clientY + 1,
          right: evt.clientX + 1,
          width: 1,
          height: 1
        };

        open({ clientRect, target });
      }}
    >
      {element}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 200,
          width: 10,
          height: 10,
          backgroundColor: "blue"
        }}
      />
    </div>
  );
}

afterEach(cleanup);

describe("useToggleLayer", () => {
  it("renders a layer when openened with the 'open' function", async () => {
    const tools = render(<Test />);

    const wrapper = tools.getByTestId("wrapper");

    fireEvent.contextMenu(wrapper, {
      clientX: 200,
      clientY: 200,
      target: wrapper
    });
    await nextFrame();

    const layer = tools.getByTestId("layer");

    expect(layer.style.top).toBe("193px");
    expect(layer.style.left).toBe("142.5px");
  });
});
