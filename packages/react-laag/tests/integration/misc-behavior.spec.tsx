import expect from "expect";
import { fireEvent, waitFor } from "@testing-library/react";
import { render, cleanup, fixViewport } from "./util";

before(fixViewport);

afterEach(cleanup);

it("fires an callback (closes layer) when clicked outside", async () => {
  const tools = render({ closeOnOutsideClick: true });

  tools.clickTrigger();

  await waitFor(() => tools.getLayer());

  // We should be able to click the layer without closing
  tools.clickLayer();
  tools.getLayer();

  tools.clickOutside();
  await waitFor(() => expect(tools.queryByTestId("layer")).toBeNull());
});

it("handles nested layers with outside click", async () => {
  const tools = render({ closeOnOutsideClick: true });

  tools.clickTrigger();

  await waitFor(() => tools.getLayer());

  tools.clickLayer();

  await waitFor(() => tools.queryByTestId("nested-layer"));

  // we should be able to click the nested layer without closing
  fireEvent.click(tools.queryByTestId("nested-layer"));
  // nested layer should be there
  tools.getByTestId("nested-layer");

  tools.clickOutside();

  // both layers should be closed
  await waitFor(() => expect(tools.queryByTestId("layer")).toBeNull());
  await waitFor(() => expect(tools.queryByTestId("nested-layer")).toBeNull());
});

it("closes on disappearance when the layer is partially hidden and overflowContainer is false", async () => {
  const tools = render({
    overflowContainer: false,
    closeOnDisappear: "partial"
  });

  tools.clickTrigger();

  // just entirely visible
  tools.scrollContainer(722, 700);

  tools.getLayer();

  // scroll a bit further so that layer isn't entirely visible
  tools.scrollContainer(724, 700);

  await waitFor(() => expect(tools.queryByTestId("layer")).toBeNull());
});

it("closes on disappearance when the layer is fully hidden and overflowContainer is false", async () => {
  const tools = render({
    overflowContainer: false,
    closeOnDisappear: "full"
  });

  tools.clickTrigger();

  tools.getLayer();

  // scroll so that layer is completely hidde
  tools.scrollContainer(975, 700);

  await waitFor(() => expect(tools.queryByTestId("layer")).toBeNull());
});

it("closes on disappearance when the trigger is partially hidden and overflowContainer is true", async () => {
  const tools = render({
    closeOnDisappear: "partial"
  });

  tools.clickTrigger();

  // just entirely visible
  tools.scrollContainer(970, 700);

  tools.getLayer();

  // scroll a bit further so that trigger isn't entirely visible
  tools.scrollContainer(978, 700);

  await waitFor(() => expect(tools.queryByTestId("layer")).toBeNull());
});

it("closes on disappearance when the trigger is fully hidden and overflowContainer is false", async () => {
  const tools = render({
    overflowContainer: false,
    closeOnDisappear: "full"
  });

  tools.clickTrigger();

  tools.getLayer();

  // scroll so that layer is completely hidde
  tools.scrollContainer(1027, 700);

  await waitFor(() => expect(tools.queryByTestId("layer")).toBeNull());
});
