import { getArrowStyle } from "./getArrowStyle";
import { Bounds, SubjectsBounds, Side } from "./types";
import { createEmptyBounds } from "./bounds";

const ARROW_SIZE = 10;

const ARROW_BOUNDS: Bounds = {
  ...createEmptyBounds(),
  width: ARROW_SIZE,
  height: ARROW_SIZE
};

const DEFAULT_SUBJECTS_BOUNDS: SubjectsBounds = {
  ARROW: ARROW_BOUNDS,
  LAYER: createEmptyBounds(),
  TRIGGER: createEmptyBounds(),
  PARENT: createEmptyBounds(),
  SCROLL_CONTAINERS: [],
  WINDOW: createEmptyBounds()
};

describe("getArrowStyle()", () => {
  it("puts arrow in center when placement is bottom-center and layer is bigger than trigger", () => {
    const triggerSize = 100;
    const layerSize = 200;

    const triggerLeft = (layerSize - triggerSize) / 2;

    const bottomCenterBounds = {
      ...DEFAULT_SUBJECTS_BOUNDS,
      TRIGGER: {
        top: 0,
        bottom: triggerSize,
        height: triggerSize,
        left: triggerLeft,
        right: triggerLeft + triggerSize,
        width: triggerSize
      },
      LAYER: {
        top: triggerSize,
        bottom: triggerSize + layerSize,
        height: layerSize,
        left: 0,
        right: layerSize,
        width: layerSize
      }
    };

    const style = getArrowStyle(bottomCenterBounds, Side.bottom, 0);

    expect(style.left).toBe(layerSize / 2);
    expect(style.bottom).toBe("100%");
  });

  it("puts arrow in center when placement is bottom-center and trigger is bigger than layer", () => {
    const triggerSize = 200;
    const layerSize = 100;

    const layerLeft = (triggerSize - layerSize) / 2;

    const bottomCenterBounds = {
      ...DEFAULT_SUBJECTS_BOUNDS,
      TRIGGER: {
        top: 0,
        bottom: triggerSize,
        height: triggerSize,
        left: 0,
        right: triggerSize,
        width: triggerSize
      },
      LAYER: {
        top: triggerSize,
        bottom: triggerSize + layerSize,
        height: layerSize,
        left: layerLeft,
        right: layerLeft + layerSize,
        width: layerSize
      }
    };

    const style = getArrowStyle(bottomCenterBounds, Side.bottom, 0);

    expect(style.left).toBe(layerSize / 2);
    expect(style.bottom).toBe("100%");
  });

  it("puts arrow in center when placement is right-center and layer is bigger than trigger", () => {
    const triggerSize = 100;
    const layerSize = 200;

    const triggerTop = (layerSize - triggerSize) / 2;

    const rightCenterBounds = {
      ...DEFAULT_SUBJECTS_BOUNDS,
      TRIGGER: {
        top: triggerTop,
        bottom: triggerTop + triggerSize,
        height: triggerSize,
        left: 0,
        right: triggerSize,
        width: triggerSize
      },
      LAYER: {
        top: 0,
        bottom: layerSize,
        height: layerSize,
        left: triggerSize,
        right: triggerSize + layerSize,
        width: layerSize
      }
    };

    const style = getArrowStyle(rightCenterBounds, Side.right, 0);

    expect(style.right).toBe("100%");
    expect(style.top).toBe(layerSize / 2);
  });

  it("puts arrow in center when placement is right-center and trigger is bigger than layer", () => {
    const triggerSize = 200;
    const layerSize = 100;

    const triggerTop = (triggerSize - layerSize) / 2;

    const rightCenterBounds = {
      ...DEFAULT_SUBJECTS_BOUNDS,
      TRIGGER: {
        top: 0,
        bottom: triggerSize,
        height: triggerSize,
        left: 0,
        right: triggerSize,
        width: triggerSize
      },
      LAYER: {
        top: triggerTop,
        bottom: triggerTop + layerSize,
        height: layerSize,
        left: triggerSize,
        right: triggerSize + layerSize,
        width: layerSize
      }
    };

    const style = getArrowStyle(rightCenterBounds, Side.right, 0);

    expect(style.right).toBe("100%");
    expect(style.top).toBe(layerSize / 2);
  });

  it("points to the center of trigger when layer is bigger than trigger", () => {
    const triggerSize = 100;
    const layerSize = 200;

    const triggerLeft = (layerSize - triggerSize) / 2;

    const offset = 20;

    const bottomCenterBounds = {
      ...DEFAULT_SUBJECTS_BOUNDS,
      TRIGGER: {
        top: 0,
        bottom: triggerSize,
        height: triggerSize,
        left: triggerLeft,
        right: triggerLeft + triggerSize,
        width: triggerSize
      },
      LAYER: {
        top: triggerSize,
        bottom: triggerSize + layerSize,
        height: layerSize,
        left: 0 + offset,
        right: layerSize + offset,
        width: layerSize
      }
    };

    const style = getArrowStyle(bottomCenterBounds, Side.bottom, 0);

    expect(style.left).toBe(layerSize / 2 - offset);
  });

  it("respects arrowOffset", () => {
    const triggerSize = 200;
    const layerSize = 100;

    const pixelsOffscreen = triggerSize / 2 + layerSize / 2;

    const arrowOffset = 10;

    const bottomStartBounds = {
      ...DEFAULT_SUBJECTS_BOUNDS,
      TRIGGER: {
        top: 0,
        bottom: triggerSize,
        height: triggerSize,
        left: -pixelsOffscreen,
        right: triggerSize - pixelsOffscreen,
        width: triggerSize
      },
      LAYER: {
        top: triggerSize,
        bottom: triggerSize + layerSize,
        height: layerSize,
        left: 0,
        right: layerSize,
        width: layerSize
      }
    };

    const style = getArrowStyle(bottomStartBounds, Side.bottom, arrowOffset);

    expect(style.left).toBe(layerSize / 2 - ARROW_SIZE / 2 - arrowOffset);
    expect(style.bottom).toBe("100%");
  });
});
