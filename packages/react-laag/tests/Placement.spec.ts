import { Placement } from "../src/Placement";
import { BoundSide, Side } from "../src/Sides";
import { SubjectsBounds } from "../src/SubjectsBounds";
import { Bounds } from "../src/Bounds";
import { Offsets } from "../src/types";
import { BoundsOffsets } from "../src/BoundsOffsets";

describe("Placement", () => {
  const window = Bounds.create({
    top: 0,
    left: 0,
    right: 800,
    bottom: 600,
    width: 800,
    height: 600
  });

  const TRIGGER_SIZE = 100;
  const TRIGGER_START = 100;

  const trigger = Bounds.create({
    top: TRIGGER_START,
    left: TRIGGER_START,
    right: TRIGGER_START + TRIGGER_SIZE,
    bottom: TRIGGER_START + TRIGGER_SIZE,
    height: TRIGGER_SIZE,
    width: TRIGGER_SIZE
  });

  const LAYER_HEIGHT = 200;

  const layer = Bounds.create({
    top: trigger.bottom,
    left: TRIGGER_START - TRIGGER_SIZE,
    right: trigger.right + 100,
    bottom: trigger.bottom + LAYER_HEIGHT,
    height: LAYER_HEIGHT,
    width: trigger.right + 100 - (TRIGGER_START - TRIGGER_SIZE)
  });

  const SCROLL_CONTAINER_SIZE = 500;

  const scrollContainer = Bounds.create({
    top: 0,
    left: 0,
    right: SCROLL_CONTAINER_SIZE,
    bottom: SCROLL_CONTAINER_SIZE,
    width: SCROLL_CONTAINER_SIZE,
    height: SCROLL_CONTAINER_SIZE
  });

  const ARROW_SIZE = 10;

  // @ts-expect-error
  const sb = new SubjectsBounds(
    {
      trigger,
      layer,
      arrow: Bounds.create({
        top: trigger.bottom - ARROW_SIZE,
        left: trigger.left + trigger.width / 2 - ARROW_SIZE / 2,
        right: trigger.left + trigger.width / 2 + ARROW_SIZE / 2,
        bottom: trigger.bottom,
        height: ARROW_SIZE,
        width: ARROW_SIZE
      }),
      parent: scrollContainer,
      window,
      scrollContainers: [window, scrollContainer]
    },
    false
  );

  const offsets: Offsets = {
    arrow: 0,
    container: 0,
    trigger: 0
  };

  const placement = new Placement(
    BoundSide.bottom,
    Side.center,
    sb,
    null,
    offsets
  );

  it("checks whether the layer visually fits within the scroll-containers given it's current position", () => {
    expect(placement.fitsContainer).toBe(true);

    // lets decrease the size of the scroll-container, so that the layer no longer fits...
    const newContainers = sb.scrollContainers.slice(0);
    newContainers[1] = Bounds.create({
      top: 0,
      left: 0,
      right: 200,
      bottom: 200,
      width: 200,
      height: 200
    });
    const newPlacement = new Placement(
      BoundSide.bottom,
      Side.center,
      sb.merge({
        scrollContainers: newContainers
      }),
      null,
      offsets
    );

    expect(newPlacement.fitsContainer).toBe(false);
  });

  it("Gives back the correct closest offsets to the scroll-containers", () => {
    expect(placement.getContainerOffsets()).toEqual(
      new BoundsOffsets({
        top: layer.top - scrollContainer.top,
        left: layer.left - scrollContainer.left,
        right: scrollContainer.right - layer.right,
        bottom: scrollContainer.bottom - layer.bottom
      })
    );
  });

  it("returns the layer-bounds given its current placement", () => {
    expect(placement.getLayerBounds()).toEqual(layer);

    // checking another placement -> left-start
    const otherPlacement = new Placement(
      BoundSide.left,
      Side.top,
      sb,
      null,
      offsets
    );
    expect(otherPlacement.getLayerBounds()).toEqual(
      Bounds.create({
        top: trigger.top,
        left: trigger.left - layer.width,
        right: trigger.left,
        bottom: trigger.top + layer.height,
        width: layer.width,
        height: layer.height
      })
    );
  });

  it("checks whether the trigger has a bigger size on the secondary side", () => {
    expect(placement.triggerIsBigger).toEqual(false);
  });

  it("returns the visible surface", () => {
    expect(placement.visibleSurface).toEqual(layer.width * layer.height);

    // checking another placement -> left-start
    const otherPlacement = new Placement(
      BoundSide.left,
      Side.top,
      sb,
      null,
      offsets
    );

    expect(otherPlacement.visibleSurface).toEqual(20_000); // trigger.left * layer.height
  });

  it("returns the secondary side with the most negative offset to its scroll-container", () => {
    // left side should be -100
    const placementWithNegativeLeft = new Placement(
      BoundSide.bottom,
      Side.right,
      sb,
      null,
      offsets
    );

    expect(placementWithNegativeLeft.secondaryOffsetSide).toEqual(Side.left);
  });
});
