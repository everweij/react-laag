import { position, PositionConfig } from "./position";
import { ALL_PLACEMENTS } from "./placement";
import { Placement, OffsetType, Side } from "./types";

import { SUBJECTS_BOUNDS, OFFSETS } from "./__mock";

const { TRIGGER, LAYER, PARENT } = SUBJECTS_BOUNDS;
const TRIGGER_OFFSET = OFFSETS[OffsetType.trigger];

const CONTAINER_OFFSET = 10;

const defaultPositionConfig: PositionConfig = {
  subjectsBounds: SUBJECTS_BOUNDS,
  possiblePlacements: ALL_PLACEMENTS,
  placement: "bottom-center",
  auto: false,
  snap: false,
  arrowOffset: 0,
  containerOffset: CONTAINER_OFFSET,
  triggerOffset: TRIGGER_OFFSET,
  layerDimensions: null,
  preferX: "right",
  preferY: "top",
  overflowContainer: true,
  borders: {
    top: 0,
    left: 0
  },
  scroll: {
    top: 0,
    left: 0
  }
};

function simulateScroll({ top, left }: { top: number; left: number }) {
  const newTriggerBounds = { ...SUBJECTS_BOUNDS.TRIGGER };

  newTriggerBounds.top += top;
  newTriggerBounds.bottom += top;
  newTriggerBounds.left += left;
  newTriggerBounds.right += left;

  return { ...SUBJECTS_BOUNDS, TRIGGER: newTriggerBounds };
}

describe("position()", () => {
  it("positions the default config correctly", () => {
    const { placement, layerBounds, layerSide } = position(
      defaultPositionConfig
    );

    expect(placement).toBe(Placement["bottom-center"]);

    expect(layerBounds).toEqual({
      top: TRIGGER.bottom + TRIGGER_OFFSET,
      left: TRIGGER.left + TRIGGER.width / 2 - LAYER.width / 2,
      right: TRIGGER.left + TRIGGER.width / 2 - LAYER.width / 2 + LAYER.width,
      bottom: TRIGGER.bottom + LAYER.height + TRIGGER_OFFSET,
      width: LAYER.width,
      height: LAYER.height
    });

    expect(layerSide).toEqual(Side.bottom);
  });

  it("auto adjusts to the next best placement", () => {
    const distanceBetweenLayerBottomAndContainerBottom =
      PARENT.height -
      TRIGGER.bottom -
      LAYER.height -
      CONTAINER_OFFSET -
      TRIGGER_OFFSET;

    const littleExtra = 10;

    const { placement, layerBounds, layerSide } = position({
      ...defaultPositionConfig,
      auto: true,
      subjectsBounds: simulateScroll({
        top: distanceBetweenLayerBottomAndContainerBottom + littleExtra,
        left: 0
      })
    });

    expect(placement).toBe(Placement["right-start"]);

    expect(layerBounds).toEqual({
      top:
        TRIGGER.top +
        distanceBetweenLayerBottomAndContainerBottom +
        littleExtra,
      left: TRIGGER.right + TRIGGER_OFFSET,
      right: TRIGGER.right + LAYER.width + TRIGGER_OFFSET,
      bottom:
        TRIGGER.top +
        LAYER.height +
        distanceBetweenLayerBottomAndContainerBottom +
        littleExtra,
      width: LAYER.width,
      height: LAYER.height
    });

    expect(layerSide).toBe(Side.right);
  });

  it("auto adjusts between two placements", () => {
    const distanceBetweenLayerLeftAndContainerLeft =
      PARENT.width - TRIGGER.left - LAYER.width;

    const littleExtra = 10;

    const { placement, layerBounds, layerSide } = position({
      ...defaultPositionConfig,
      auto: true,
      placement: "bottom-start",
      subjectsBounds: simulateScroll({
        top: 0,
        left: distanceBetweenLayerLeftAndContainerLeft + littleExtra
      })
    });

    expect(placement).toBe(Placement["bottom-center"]);

    expect(layerBounds).toEqual({
      top: TRIGGER.bottom + TRIGGER_OFFSET,
      left:
        TRIGGER.left + distanceBetweenLayerLeftAndContainerLeft - littleExtra,
      right:
        TRIGGER.left +
        LAYER.width +
        distanceBetweenLayerLeftAndContainerLeft -
        littleExtra,
      bottom: TRIGGER.bottom + LAYER.height + TRIGGER_OFFSET,
      width: LAYER.width,
      height: LAYER.height
    });

    expect(layerSide).toBe(Side.bottom);
  });

  it("auto adjusts but snaps to the next placement", () => {
    const distanceBetweenLayerLeftAndContainerLeft =
      PARENT.width - TRIGGER.left - LAYER.width;

    const littleExtra = 10;

    const { placement, layerBounds, layerSide } = position({
      ...defaultPositionConfig,
      auto: true,
      snap: true,
      placement: "bottom-start",
      subjectsBounds: simulateScroll({
        top: 0,
        left: distanceBetweenLayerLeftAndContainerLeft + littleExtra
      })
    });

    expect(placement).toBe(Placement["bottom-center"]);

    expect(layerBounds).toEqual({
      top: TRIGGER.bottom + TRIGGER_OFFSET,
      left:
        TRIGGER.left +
        TRIGGER.width / 2 -
        LAYER.width / 2 +
        distanceBetweenLayerLeftAndContainerLeft +
        littleExtra,
      right:
        TRIGGER.left +
        TRIGGER.width / 2 -
        LAYER.width / 2 +
        LAYER.width +
        distanceBetweenLayerLeftAndContainerLeft +
        littleExtra,
      bottom: TRIGGER.bottom + LAYER.height + TRIGGER_OFFSET,
      width: LAYER.width,
      height: LAYER.height
    });

    expect(layerSide).toBe(Side.bottom);
  });

  it("lets you anticicpate on the dimensions of layer given a layer-side", () => {
    const distanceBetweenLayerBottomAndContainerBottom =
      PARENT.height -
      TRIGGER.bottom -
      LAYER.height -
      CONTAINER_OFFSET -
      TRIGGER_OFFSET;

    const littleExtra = 10;

    const layerHeightThatWontFit =
      LAYER.height + distanceBetweenLayerBottomAndContainerBottom + littleExtra;

    const { placement } = position({
      ...defaultPositionConfig,
      auto: true,
      placement: "bottom-start",
      layerDimensions: layerSide => ({
        height: layerSide === "bottom" ? layerHeightThatWontFit : LAYER.height,
        width: LAYER.width
      })
    });

    expect(placement).toBe(Placement["right-start"]);
  });
});
