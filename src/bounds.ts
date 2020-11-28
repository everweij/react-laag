import { BoundSide, BoundSideProp, BoundSideType } from "./Sides";
import { BoundsOffsets } from "./BoundsOffsets";
import { getPixelValue } from "./util";

/**
 * Utility function that returns sum of various computed styles
 * @param propertyValues list of computed styles (ie. '12px')
 */
function sumOfPropertyValues(...propertyValues: string[]) {
  return propertyValues.reduce(
    (sum, propertyValue) =>
      sum + (propertyValue ? getPixelValue(propertyValue!) : 0),
    0
  );
}

export interface IBounds {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

function boundsToObject({
  top,
  left,
  right,
  bottom,
  width,
  height
}: IBounds): IBounds {
  return { top, left, right, bottom, width, height };
}

const EMPTY: IBounds = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0
};

/**
 * A class containing the positional properties of the native DOM's ClientRect
 * (`element.getBoundingClientRect()`), together with some utility methods
 */
export class Bounds implements IBounds {
  top!: number;
  left!: number;
  right!: number;
  bottom!: number;
  width!: number;
  height!: number;

  /**
   * Creates a new Bounds class
   * @param bounds An object that adheres to the `IBounds` interface
   */
  static create(bounds: IBounds): Bounds {
    return new Bounds(bounds);
  }

  /**
   * Creates a new Bounds class from a DOM-element
   * @param element reference to the DOM-element
   * @param options optional options object
   */
  static fromElement(
    element: HTMLElement,
    options: {
      /** should transforms like 'scale' taken into account? Defaults to `true` */
      withTransform?: boolean;
      /** reference to the window-object (needed when working with iframes for instance). Defaults to `window` */
      environment?: Window;
      /** should the elements scrollbars be included? Defaults to `true` */
      withScrollbars?: boolean;
    } = {}
  ): Bounds {
    const {
      withTransform = true,
      environment = window,
      withScrollbars = true
    } = options;

    const plain: IBounds = boundsToObject(element.getBoundingClientRect());

    let bounds: Bounds = new Bounds(plain);

    if (!withTransform) {
      const {
        width,
        height,
        boxSizing,
        borderLeft,
        borderRight,
        borderTop,
        borderBottom,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom
      } = environment.getComputedStyle(element);

      const boxWidth =
        boxSizing === "border-box"
          ? getPixelValue(width!)
          : sumOfPropertyValues(
              width,
              borderLeft,
              borderRight,
              paddingLeft,
              paddingRight
            );

      const boxHeight =
        boxSizing === "border-box"
          ? getPixelValue(height!)
          : sumOfPropertyValues(
              height,
              borderTop,
              borderBottom,
              paddingTop,
              paddingBottom
            );

      bounds = new Bounds({
        ...bounds,
        width: boxWidth,
        height: boxHeight
      });
    }

    if (!withScrollbars) {
      const scrollbarWidth = bounds.width - element.clientWidth;
      const scrollbarHeight = bounds.height - element.clientHeight;
      return bounds.substract({
        right: scrollbarWidth,
        bottom: scrollbarHeight
      });
    }

    return bounds;
  }

  /**
   * Creates an empty Bounds class
   */
  static empty(): Bounds {
    return new Bounds();
  }

  /**
   * Creates a Bounds class from the window's dimensions
   * @param environment reference to the window-object (needed when working with iframes for instance). Defaults to `window`
   */
  static fromWindow(environment?: Window): Bounds {
    const { innerWidth: width = 0, innerHeight: height = 0 } =
      environment || {};
    return new Bounds({ width, height, right: width, bottom: height });
  }

  protected constructor(bounds: Partial<IBounds> = {}) {
    return Object.assign(this, EMPTY, bounds);
  }

  /**
   * Returns the square surface of the bounds in pixels
   */
  get surface(): number {
    return this.width * this.height;
  }

  /**
   * Returns a plain object containing only positional properties
   */
  toObject(): IBounds {
    return boundsToObject(this);
  }

  /**
   * Returns a new Bounds instance by merging two bounds
   * @param bounds partial bounds which should be merged
   */
  merge(bounds: Partial<IBounds>): Bounds;
  /**
   * Returns a new Bounds instance by merging two bounds
   * @param mergeFn callback which takes the current bounds and returns new merged bounds
   */
  merge(mergeFn: (current: IBounds) => Partial<IBounds>): Bounds;
  merge(partialBoundsOrMergeFn: unknown): Bounds {
    const current = this.toObject();
    return new Bounds({
      ...current,
      ...(typeof partialBoundsOrMergeFn === "function"
        ? partialBoundsOrMergeFn(current)
        : partialBoundsOrMergeFn)
    });
  }

  /**
   * Return a new Bounds instance by subtracting each property of the provided IBounds object
   * @param bounds partial IBounds object to substract with
   */
  substract(bounds: Partial<IBounds>): Bounds {
    const result = this.toObject();

    const entries = Object.entries(bounds) as [keyof IBounds, number][];

    for (const [prop, value] of entries) {
      if (prop in BoundSide) {
        // if `prop` is one of 'top', 'left', 'bottom' or 'right'...
        const boundSide = BoundSide[prop as BoundSideProp];
        // decide if we should add or substract
        result[prop] += boundSide.factor(value);
        // make sure that the size-properties are also updated
        result[boundSide.isHorizontal ? "width" : "height"] -= value;
      } else {
        // prop is 'width' or 'height'
        result[prop] -= value || 0;
      }
    }

    return new Bounds(result);
  }

  /**
   * Returns a new BoundsOffsets instance by determining the distance for each bound-side:
   * (child -> parent)
   * @param child child bounds instance
   */
  offsetsTo(child: Bounds): BoundsOffsets {
    return new BoundsOffsets({
      top: child.top - this.top,
      bottom: this.bottom - child.bottom,
      left: child.left - this.left,
      right: this.right - child.right
    });
  }

  /**
   * Return a new Bounds instance by mapping over each bound-side
   * @param mapper callback that takes a boundSide + value in pixels, returning a new value for that side
   */
  mapSides(
    mapper: (boundSide: BoundSideType, value: number) => number
  ): Bounds {
    const result = this.toObject();
    const boundSides = Object.values(BoundSide) as BoundSideType[];
    for (const boundSide of boundSides) {
      result[boundSide.prop] = mapper(boundSide, result[boundSide.prop]);
    }
    return new Bounds(result);
  }
}
