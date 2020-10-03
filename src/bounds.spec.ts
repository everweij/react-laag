import {
  getBoundsOfLayerByPlacement,
  getCollisionBoundsOfLayerByPlacement,
  createEmptyBounds
} from "./bounds";
import { Placement, OffsetType } from "./types";

import { SUBJECTS_BOUNDS, OFFSETS } from "./__mock";

const { TRIGGER, LAYER } = SUBJECTS_BOUNDS;
const TRIGGER_OFFSET = OFFSETS[OffsetType.trigger];

describe("getBoundsOfLayerByPlacement()", () => {
  it("returns the correct bounds based on placement bottom-start", async () => {
    const actual = getBoundsOfLayerByPlacement(
      Placement["bottom-start"],
      SUBJECTS_BOUNDS,
      OFFSETS
    );

    expect(actual).toEqual({
      top: TRIGGER.bottom + TRIGGER_OFFSET,
      left: TRIGGER.left,
      right: TRIGGER.left + LAYER.width,
      bottom: TRIGGER.bottom + LAYER.height + TRIGGER_OFFSET,
      width: LAYER.width,
      height: LAYER.height
    });
  });

  it("returns the correct bounds based on placement bottom-center", async () => {
    const actual = getBoundsOfLayerByPlacement(
      Placement["bottom-center"],
      SUBJECTS_BOUNDS,
      OFFSETS
    );

    expect(actual).toEqual({
      top: TRIGGER.bottom + TRIGGER_OFFSET,
      left: TRIGGER.left + TRIGGER.width / 2 - LAYER.width / 2,
      right: TRIGGER.left + TRIGGER.width / 2 - LAYER.width / 2 + LAYER.width,
      bottom: TRIGGER.bottom + LAYER.height + TRIGGER_OFFSET,
      width: LAYER.width,
      height: LAYER.height
    });
  });

  it("returns the correct bounds based on placement bottom-end", async () => {
    const actual = getBoundsOfLayerByPlacement(
      Placement["bottom-end"],
      SUBJECTS_BOUNDS,
      OFFSETS
    );

    expect(actual).toEqual({
      top: TRIGGER.bottom + TRIGGER_OFFSET,
      left: TRIGGER.right - LAYER.width,
      right: TRIGGER.right,
      bottom: TRIGGER.bottom + LAYER.height + TRIGGER_OFFSET,
      width: LAYER.width,
      height: LAYER.height
    });
  });

  it("returns the correct bounds based on placement left-start", async () => {
    const actual = getBoundsOfLayerByPlacement(
      Placement["left-start"],
      SUBJECTS_BOUNDS,
      OFFSETS
    );

    expect(actual).toEqual({
      top: TRIGGER.top,
      left: TRIGGER.left - LAYER.width - TRIGGER_OFFSET,
      right: TRIGGER.left - TRIGGER_OFFSET,
      bottom: TRIGGER.top + LAYER.height,
      width: LAYER.width,
      height: LAYER.height
    });
  });

  it("respects limits so the layer does not get detached from trigger", async () => {
    const SECONDARY_OFFSET = 250;

    const actual = getBoundsOfLayerByPlacement(
      Placement["bottom-start"],
      SUBJECTS_BOUNDS,
      {
        ...OFFSETS,
        [OffsetType.secondary]: SECONDARY_OFFSET // secondary is higher than width of layer
      }
    );

    expect(actual).toEqual({
      top: TRIGGER.bottom + TRIGGER_OFFSET,
      left: TRIGGER.right,
      right: TRIGGER.right + LAYER.width,
      bottom: TRIGGER.bottom + LAYER.height + TRIGGER_OFFSET,
      width: LAYER.width,
      height: LAYER.height
    });
  });

  it("respects limits + taking size of arrow into account", async () => {
    const SECONDARY_OFFSET = 250;
    const ARROW_SIZE = 25;

    const actual = getBoundsOfLayerByPlacement(
      Placement["bottom-start"],
      {
        ...SUBJECTS_BOUNDS,
        ARROW: {
          ...createEmptyBounds(),
          width: ARROW_SIZE,
          height: ARROW_SIZE
        }
      },
      {
        ...OFFSETS,
        [OffsetType.secondary]: SECONDARY_OFFSET
      }
    );

    expect(actual).toEqual({
      top: TRIGGER.bottom + TRIGGER_OFFSET,
      left: TRIGGER.right - ARROW_SIZE,
      right: TRIGGER.right - ARROW_SIZE + LAYER.width,
      bottom: TRIGGER.bottom + LAYER.height + TRIGGER_OFFSET,
      width: LAYER.width,
      height: LAYER.height
    });
  });
});

describe("getCollisionBoundsOfLayerByAnchor()", () => {
  it("returns the bounds of the layer + taking container offset into account", () => {
    const CONTAINER_OFFSET = 20;
    const TRIGGER_OFFSET = OFFSETS[OffsetType.trigger];

    const actual = getCollisionBoundsOfLayerByPlacement(
      Placement["bottom-start"],
      SUBJECTS_BOUNDS,
      {
        ...OFFSETS,
        [OffsetType.container]: CONTAINER_OFFSET
      }
    );

    expect(actual).toEqual({
      top: TRIGGER.bottom + TRIGGER_OFFSET - CONTAINER_OFFSET,
      left: TRIGGER.left - CONTAINER_OFFSET,
      right: TRIGGER.left + LAYER.width + CONTAINER_OFFSET,
      bottom: TRIGGER.bottom + LAYER.height + CONTAINER_OFFSET + TRIGGER_OFFSET,
      width: LAYER.width + 2 * CONTAINER_OFFSET,
      height: LAYER.height + 2 * CONTAINER_OFFSET
    });
  });
});
