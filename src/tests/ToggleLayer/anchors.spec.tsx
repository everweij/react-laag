import * as React from "react";
import { cleanup, render } from "@testing-library/react";

import {
  ToggleLayerTest,
  ScrollBox,
  centerAndTrigger,
  expectLayerStyle
} from "./util";

afterEach(cleanup);

describe("Anchors", () => {
  it("renders TOP_LEFT", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "TOP_LEFT"
          }}
        />
      </ScrollBox>
    );

    expectLayerStyle(centerAndTrigger(tools), {
      bottom: -450,
      left: 950
    });
  });

  it("renders TOP_CENTER", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "TOP_CENTER"
          }}
        />
      </ScrollBox>
    );

    expectLayerStyle(centerAndTrigger(tools), {
      bottom: -450,
      left: 925
    });
  });

  it("renders TOP_RIGHT", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "TOP_RIGHT"
          }}
        />
      </ScrollBox>
    );

    expectLayerStyle(centerAndTrigger(tools), {
      bottom: -450,
      right: -550
    });
  });

  it("renders BOTTOM_LEFT", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "BOTTOM_LEFT"
          }}
        />
      </ScrollBox>
    );

    expectLayerStyle(centerAndTrigger(tools), {
      top: 1050,
      left: 950
    });
  });

  it("renders BOTTOM_CENTER", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "BOTTOM_CENTER"
          }}
        />
      </ScrollBox>
    );

    expectLayerStyle(centerAndTrigger(tools), {
      top: 1050,
      left: 925
    });
  });

  it("renders BOTTOM_RIGHT", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "BOTTOM_RIGHT"
          }}
        />
      </ScrollBox>
    );

    expectLayerStyle(centerAndTrigger(tools), {
      top: 1050,
      right: -550
    });
  });

  it("renders LEFT_TOP", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "LEFT_TOP"
          }}
        />
      </ScrollBox>
    );

    expectLayerStyle(centerAndTrigger(tools), {
      top: 950,
      right: -450
    });
  });

  it("renders LEFT_CENTER", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "LEFT_CENTER"
          }}
        />
      </ScrollBox>
    );

    expectLayerStyle(centerAndTrigger(tools), {
      top: 925,
      right: -450
    });
  });

  it("renders LEFT_BOTTOM", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "LEFT_BOTTOM"
          }}
        />
      </ScrollBox>
    );

    expectLayerStyle(centerAndTrigger(tools), {
      bottom: -550,
      right: -450
    });
  });

  it("renders RIGHT_TOP", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "RIGHT_TOP"
          }}
        />
      </ScrollBox>
    );

    expectLayerStyle(centerAndTrigger(tools), {
      top: 950,
      left: 1050
    });
  });

  it("renders RIGHT_CENTER", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "RIGHT_CENTER"
          }}
        />
      </ScrollBox>
    );

    expectLayerStyle(centerAndTrigger(tools), {
      top: 925,
      left: 1050
    });
  });

  it("renders RIGHT_BOTTOM", async () => {
    const tools = render(
      <ScrollBox>
        <ToggleLayerTest
          placement={{
            anchor: "RIGHT_BOTTOM"
          }}
        />
      </ScrollBox>
    );

    expectLayerStyle(centerAndTrigger(tools), {
      bottom: -550,
      left: 1050
    });
  });
});
