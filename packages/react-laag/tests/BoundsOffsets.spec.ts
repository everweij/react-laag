import expect from "expect";

import { BoundsOffsets } from "../src/BoundsOffsets";

describe("BoundsOffsets", () => {
  it("instantiates a new intance", () => {
    expect(
      () => new BoundsOffsets({ top: 1, bottom: 2, left: 3, right: 4 })
    ).not.toThrowError();
  });

  it("creates a new instance based on other instances by picking the smallest value for each side", () => {
    const a = new BoundsOffsets({ top: 10, bottom: 20, left: 30, right: 40 });
    const b = new BoundsOffsets({ top: 5, bottom: 50, left: 500, right: 100 });
    const c = new BoundsOffsets({ top: 20, bottom: 10, left: 10, right: 10 });

    expect(BoundsOffsets.mergeSmallestSides([a, b, c])).toEqual(
      new BoundsOffsets({ top: 5, bottom: 10, left: 10, right: 10 })
    );
  });

  it("creates a new instance based on other instances by picking the smallest value for each side", () => {
    const a = new BoundsOffsets({ top: 10, bottom: 20, left: 30, right: 40 });
    const b = new BoundsOffsets({ top: 5, bottom: 50, left: 500, right: 100 });
    const c = new BoundsOffsets({ top: 20, bottom: 10, left: 10, right: -10 });

    expect(BoundsOffsets.mergeSmallestSides([a, b, c])).toEqual(
      new BoundsOffsets({ top: 5, bottom: 10, left: 10, right: -10 })
    );
  });

  it("checks whether all sides are positive", () => {
    expect(
      new BoundsOffsets({ top: 20, bottom: 10, left: 10, right: -10 })
        .allSidesArePositive
    ).toEqual(false);
    expect(
      new BoundsOffsets({ top: 20, bottom: 10, left: 10, right: 10 })
        .allSidesArePositive
    ).toEqual(true);
  });

  it("returns a partial IBoundsOffsets-object with only the negative sides", () => {
    expect(
      new BoundsOffsets({ top: 20, bottom: 10, left: 10, right: -10 })
        .negativeSides
    ).toEqual({ right: -10 });
  });
});
