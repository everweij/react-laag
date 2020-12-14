import expect from "expect";
import { PLACEMENT_TYPES } from "../src/PlacementType";
import { Bounds } from "../src/Bounds";
import { Placements } from "../src/Placements";
import { SubjectsBounds } from "../src/SubjectsBounds";
import { boundsByDimensions } from "./test-util";
import { PositionConfig } from "../src/types";
import { Placement } from "../src/Placement";

function getType(placement: Placement) {
  return placement.type;
}

describe("Placements", () => {
  const window = Bounds.create({
    top: 0,
    left: 0,
    right: 800,
    bottom: 600,
    width: 800,
    height: 600
  });

  // @ts-expect-error
  const sb: SubjectsBounds = new SubjectsBounds({
    trigger: boundsByDimensions(100, 100),
    layer: boundsByDimensions(300, 300),
    arrow: Bounds.empty(),
    parent: boundsByDimensions(600, 600),
    window,
    scrollContainers: [window, boundsByDimensions(600, 600)]
  });

  const baseConfig: PositionConfig = {
    placement: "top-start",
    arrowOffset: 0,
    containerOffset: 0,
    triggerOffset: 0,
    layerDimensions: null,
    auto: true,
    overflowContainer: false,
    snap: false,
    possiblePlacements: PLACEMENT_TYPES as any,
    preferX: "right",
    preferY: "bottom"
  };

  describe("placement priority", () => {
    it("returns the correct priority when placement is 'top-start'", () => {
      const { placements } = Placements.create(sb, {
        ...baseConfig,
        placement: "top-start"
      });
      expect(placements.map(getType)).toEqual([
        "top-start",
        "top-center",
        "top-end",
        "right-end",
        "right-center",
        "right-start",
        "left-end",
        "left-center",
        "left-start",
        "bottom-start",
        "bottom-center",
        "bottom-end"
      ]);
    });

    it("returns the correct priority when placement is 'left-center'", () => {
      const { placements } = Placements.create(sb, {
        ...baseConfig,
        placement: "left-center"
      });
      expect(placements.map(getType)).toEqual([
        "left-center",
        "left-end",
        "left-start",
        "bottom-end",
        "bottom-center",
        "bottom-start",
        "top-end",
        "top-center",
        "top-start",
        "right-center",
        "right-end",
        "right-start"
      ]);
    });

    it("returns the correct priority when the trigger is bigger", () => {
      const { placements } = Placements.create(
        sb.merge({ trigger: boundsByDimensions(800, 800) }),
        baseConfig
      );
      expect(placements.map(getType)).toEqual([
        "top-start",
        "top-center",
        "top-end",
        "right-start",
        "right-center",
        "right-end",
        "left-start",
        "left-center",
        "left-end",
        "bottom-start",
        "bottom-center",
        "bottom-end"
      ]);
    });

    it("returns the correct priority when preffered sides are swapped", () => {
      const { placements } = Placements.create(
        sb.merge({ trigger: boundsByDimensions(800, 800) }),
        {
          ...baseConfig,
          preferX: "left",
          preferY: "top"
        }
      );
      expect(placements.map(getType)).toEqual([
        "top-start",
        "top-center",
        "top-end",
        "left-start",
        "left-center",
        "left-end",
        "right-start",
        "right-center",
        "right-end",
        "bottom-start",
        "bottom-center",
        "bottom-end"
      ]);
    });
  });

  describe("results", () => {
    it("returns proper results about positioning", () => {
      const placements = Placements.create(sb, baseConfig);
      const result = placements.result(
        { top: 0, left: 0 },
        { top: 0, left: 0 }
      );

      expect(result.placement.type).toBe("right-start");
      expect(result.styles).toEqual({
        arrow: {
          position: "absolute",
          willChange: "top, left",
          left: null,
          right: "100%",
          top: 50,
          bottom: null
        },
        layer: {
          willChange: "top, left, width, height",
          position: "absolute",
          top: 0,
          left: 100
        }
      });

      expect(result.layerSide).toBe("right");
      expect(result.layerBounds).toEqual({
        top: 0,
        left: 100,
        right: 400,
        bottom: 300,
        width: 300,
        height: 300
      });
      expect(result.hasDisappeared).toBe(null);
    });
  });
});
