import { getListOfPlacementsByPriority, ALL_PLACEMENTS } from "./placement";
import { Placement, Side } from "./types";

const allPossiblePlacements = ALL_PLACEMENTS.map(key => Placement[key]);

describe("getListOfPlacementsByPriority()", () => {
  it("returns the correct order -> bottom-center", async () => {
    const actual = getListOfPlacementsByPriority(
      Placement["bottom-center"],
      allPossiblePlacements,
      Side.right,
      Side.bottom,
      false,
      false
    );

    expect(actual).toEqual([
      Placement["bottom-center"],
      Placement["bottom-end"],
      Placement["bottom-start"],
      Placement["right-start"],
      Placement["right-center"],
      Placement["right-end"],
      Placement["left-start"],
      Placement["left-center"],
      Placement["left-end"],
      Placement["top-center"],
      Placement["top-end"],
      Placement["top-start"]
    ]);
  });

  it("returns the correct order -> bottom-start", async () => {
    const actual = getListOfPlacementsByPriority(
      Placement["bottom-start"],
      allPossiblePlacements,
      Side.right,
      Side.bottom,
      false,
      false
    );

    expect(actual).toEqual([
      Placement["bottom-start"],
      Placement["bottom-center"],
      Placement["bottom-end"],
      Placement["right-start"],
      Placement["right-center"],
      Placement["right-end"],
      Placement["left-start"],
      Placement["left-center"],
      Placement["left-end"],
      Placement["top-start"],
      Placement["top-center"],
      Placement["top-end"]
    ]);
  });

  it("returns the correct order -> left-end", async () => {
    const actual = getListOfPlacementsByPriority(
      Placement["left-end"],
      allPossiblePlacements,
      Side.left,
      Side.top,
      false,
      false
    );

    expect(actual).toEqual([
      Placement["left-end"],
      Placement["left-center"],
      Placement["left-start"],
      Placement["top-end"],
      Placement["top-center"],
      Placement["top-start"],
      Placement["bottom-end"],
      Placement["bottom-center"],
      Placement["bottom-start"],
      Placement["right-end"],
      Placement["right-center"],
      Placement["right-start"]
    ]);
  });

  it("returns the correct order -> CENTER", async () => {
    const actual = getListOfPlacementsByPriority(
      Placement.center,
      allPossiblePlacements,
      Side.right,
      Side.bottom,
      false,
      false
    );

    expect(actual).toEqual([
      Placement["center"],
      Placement["bottom-end"],
      Placement["bottom-center"],
      Placement["bottom-start"],
      Placement["right-start"],
      Placement["right-center"],
      Placement["right-end"],
      Placement["left-start"],
      Placement["left-center"],
      Placement["left-end"],
      Placement["top-end"],
      Placement["top-center"],
      Placement["top-start"]
    ]);
  });

  it("reacts when trigger is higher", async () => {
    const actual = getListOfPlacementsByPriority(
      Placement["bottom-center"],
      allPossiblePlacements,
      Side.right,
      Side.bottom,
      true,
      false
    );

    expect(actual).toEqual([
      Placement["bottom-center"],
      Placement["bottom-end"],
      Placement["bottom-start"],
      Placement["right-end"],
      Placement["right-center"],
      Placement["right-start"],
      Placement["left-end"],
      Placement["left-center"],
      Placement["left-start"],
      Placement["top-center"],
      Placement["top-end"],
      Placement["top-start"]
    ]);
  });

  it("reacts when trigger is wider", async () => {
    const actual = getListOfPlacementsByPriority(
      Placement["left-end"],
      allPossiblePlacements,
      Side.right,
      Side.bottom,
      false,
      true
    );

    expect(actual).toEqual([
      Placement["left-end"],
      Placement["left-center"],
      Placement["left-start"],
      Placement["bottom-start"],
      Placement["bottom-center"],
      Placement["bottom-end"],
      Placement["top-start"],
      Placement["top-center"],
      Placement["top-end"],
      Placement["right-end"],
      Placement["right-center"],
      Placement["right-start"]
    ]);
  });

  it("only returns placements that are included in `possiblePlacements`", async () => {
    const actual = getListOfPlacementsByPriority(
      Placement["left-end"],
      [
        Placement["left-end"],
        Placement["left-center"],
        Placement["left-start"]
      ],
      Side.right,
      Side.bottom,
      false,
      false
    );

    expect(actual).toEqual([
      Placement["left-end"],
      Placement["left-center"],
      Placement["left-start"]
    ]);
  });

  it("only returns placements that are included in `possiblePlacements` + always the `preferredPlacement`", async () => {
    const actual = getListOfPlacementsByPriority(
      Placement["left-end"],
      [Placement["left-center"], Placement["left-start"]],
      Side.right,
      Side.bottom,
      false,
      false
    );

    expect(actual).toEqual([
      Placement["left-end"],
      Placement["left-center"],
      Placement["left-start"]
    ]);
  });
});
