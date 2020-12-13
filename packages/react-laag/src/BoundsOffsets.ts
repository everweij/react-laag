export interface IBoundsOffsets {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

const SIDES = ["top", "left", "bottom", "right"] as (keyof IBoundsOffsets)[];

/**
 * A class containing the positional properties which represent the distance
 * between two Bounds instances for each side
 */
export class BoundsOffsets implements IBoundsOffsets {
  top!: number;
  left!: number;
  right!: number;
  bottom!: number;

  constructor(offsets: IBoundsOffsets) {
    return Object.assign(this, offsets);
  }

  /**
   * Takes multiple BoundsOffets instances and creates a new BoundsOffsets instance
   * by taking the smallest value for each side
   * @param boundsOffsets list of BoundsOffsets instances
   */
  static mergeSmallestSides(boundsOffsets: BoundsOffsets[]): BoundsOffsets {
    const [first, ...rest] = boundsOffsets;

    if (!first) {
      throw new Error(
        "Please provide at least 1 bounds objects in order to merge"
      );
    }

    const result: IBoundsOffsets = Object.fromEntries(
      SIDES.map(side => [side, first[side]])
    ) as any;

    for (const boundsOffset of rest) {
      for (const side of SIDES) {
        result[side] = Math.min(result[side], boundsOffset[side]);
      }
    }

    return new BoundsOffsets(result);
  }

  /**
   * Checks whether all sides sides are positive, meaning the corresponding Bounds instance
   * fits perfectly within a parent Bounds instance
   */
  get allSidesArePositive(): boolean {
    return SIDES.every(side => this[side] >= 0);
  }

  /**
   * Returns a partial IBoundsOffsets with sides that are negative, meaning sides aren't entirely
   * visible in respect to a parent Bounds instance
   */
  get negativeSides(): Partial<IBoundsOffsets> {
    return Object.fromEntries(
      SIDES.filter(side => this[side] < 0).map(side => [side, this[side]])
    ) as Partial<IBoundsOffsets>;
  }
}
