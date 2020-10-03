import {
  SubjectsBounds,
  Bounds,
  MutableBounds,
  Offsets,
  Placement,
  BoundSide,
  Side,
  Direction,
  OffsetType,
  Borders
} from "./types";
import { getPlacementProperties } from "./placement";
import { getPixelValue, limit } from "./util";

export const BOUND_SIDES: BoundSide[] = [
  BoundSide.top,
  BoundSide.left,
  BoundSide.bottom,
  BoundSide.right
];

// converts a ClientRect (or DOMRect) to a plain js-object
// This is necessary in order to do stuff like:
// const merged = { ...clientRect, width: 100 };
export function clientRectToBounds({
  top,
  left,
  right,
  bottom,
  width,
  height
}: ClientRect): Bounds {
  return {
    top,
    left,
    right,
    bottom,
    width,
    height
  };
}

export function createEmptyBounds(): MutableBounds {
  return {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0
  };
}

// creates a ClientRect-like object from the viewport's dimensions
export function getWindowBounds(environment?: Window): Bounds {
  const { innerWidth = 0, innerHeight = 0 } = environment || {};

  return {
    ...createEmptyBounds(),
    right: innerWidth,
    width: innerWidth,
    bottom: innerHeight,
    height: innerHeight
  };
}

// returns a Bounds object with the scrollbars substracted
export function subtractScrollbars(
  bounds: Bounds,
  clientWidth: number,
  clientHeight: number
) {
  const { width, height, right, bottom } = bounds;

  const scrollbarWidth = width - clientWidth;
  const scrollbarHeight = height - clientHeight;

  return {
    ...bounds,
    width: width - scrollbarWidth,
    right: right - scrollbarWidth,
    height: height - scrollbarHeight,
    bottom: bottom - scrollbarHeight
  };
}

export function getBorderOffsets(
  element: HTMLElement,
  environment: Window
): Borders {
  const { borderLeftWidth, borderTopWidth } = environment.getComputedStyle(
    element
  );

  return {
    left: getPixelValue(borderLeftWidth) || 0,
    top: getPixelValue(borderTopWidth) || 0
  };
}

// When calculating the position of the layer for instance, we don't
// want the layers transform properties to intervene, like animating
// `translate` or `scale`.
export function getBoundsWithoutTransform(
  element: HTMLElement,
  environment: Window
): Bounds {
  const bounds = clientRectToBounds(element.getBoundingClientRect());

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

  function sumOfPropertyValues(...propertyValues: string[]) {
    return propertyValues.reduce(
      (sum, propertyValue) =>
        sum + (propertyValue ? getPixelValue(propertyValue!) : 0),
      0
    );
  }

  return {
    ...bounds,
    width:
      boxSizing === "border-box"
        ? getPixelValue(width!)
        : sumOfPropertyValues(
            width,
            borderLeft,
            borderRight,
            paddingLeft,
            paddingRight
          ),
    height:
      boxSizing === "border-box"
        ? getPixelValue(height!)
        : sumOfPropertyValues(
            height,
            borderTop,
            borderBottom,
            paddingTop,
            paddingBottom
          )
  };
}

// determines of we should add or subtract a value depending on
// the side
function addOrSubstract(value: number, side: Side): number {
  return value * ([Side.right, Side.bottom].includes(side) ? 1 : -1);
}

// converts Side enum to boundary key
function getBoundSideProperty(side: Side): BoundSide {
  return BoundSide[Side[side] as BoundSide];
}

// This function is used to anticipate the bounds of the layer
// given a certain placement
export function getBoundsOfLayerByPlacement(
  placement: Placement,
  subjectsBounds: SubjectsBounds,
  offsets: Offsets
): Bounds {
  const { TRIGGER, LAYER, ARROW } = subjectsBounds;

  const {
    primary,
    secondary,
    opposite,
    direction,
    sizeProperty,
    oppositeSizeProperty,
    cssProperties
  } = getPlacementProperties(placement);

  const result = createEmptyBounds();

  // treat `Placement.center` differently
  if (placement === Placement.center) {
    result.top = TRIGGER.top + TRIGGER.height / 2 - LAYER.height / 2;
    result.bottom = result.top + LAYER.height;
    result.left = TRIGGER.left + TRIGGER.width / 2 - LAYER.width / 2;
    result.right = result.left + LAYER.width;
  }
  // "Default" scenario
  // Let's take the "top-start" placement as an example
  else {
    // Translates to:
    // result.bottom = TRIGGER.top + offsets.trigger

    result[getBoundSideProperty(opposite.primary)] =
      TRIGGER[getBoundSideProperty(primary)] +
      addOrSubstract(offsets[OffsetType.trigger], primary);

    // Translates to:
    // result.top = result.bottom - LAYER.height
    result[getBoundSideProperty(primary)] =
      result[getBoundSideProperty(opposite.primary)] +
      addOrSubstract(LAYER[sizeProperty], primary);

    const arrowOffsetBase = offsets[OffsetType.arrow] * 2;

    let limitMin =
      TRIGGER[cssProperties.secondary] -
      (LAYER[oppositeSizeProperty] - ARROW[oppositeSizeProperty]) +
      arrowOffsetBase;
    let limitMax =
      TRIGGER[cssProperties.secondary] +
      (TRIGGER[oppositeSizeProperty] - ARROW[oppositeSizeProperty]) -
      arrowOffsetBase;
    if ([Side.right, Side.bottom].includes(secondary)) {
      limitMin += LAYER[oppositeSizeProperty];
      limitMax += LAYER[oppositeSizeProperty];
    }

    if (secondary === Side.center) {
      const propertyA =
        direction === Direction.VERTICAL ? BoundSide.left : BoundSide.top;
      const propertyB =
        direction === Direction.VERTICAL ? BoundSide.right : BoundSide.bottom;

      result[propertyA] = limit(
        TRIGGER[propertyA] +
          TRIGGER[oppositeSizeProperty] / 2 -
          LAYER[oppositeSizeProperty] / 2 +
          offsets[OffsetType.secondary],
        limitMin,
        limitMax
      );
      result[propertyB] = result[propertyA] + LAYER[oppositeSizeProperty];
    } else {
      // Translates to:
      // result.left = trigger.left - offsets.secondary
      result[getBoundSideProperty(secondary)] = limit(
        TRIGGER[getBoundSideProperty(secondary)] +
          offsets[OffsetType.secondary],
        limitMin,
        limitMax
      );

      // Translates to:
      // result.right = result.left + LAYER.width
      result[getBoundSideProperty(opposite.secondary)] =
        result[getBoundSideProperty(secondary)] +
        addOrSubstract(LAYER[oppositeSizeProperty], secondary) * -1;
    }
  }

  // Set the resulting width and height
  result.width = result.right - result.left;
  result.height = result.bottom - result.top;

  return result;
}

// returns getBoundsOfLayerByPlacement(), including container offsets
export function getCollisionBoundsOfLayerByPlacement(
  placement: Placement,
  subjectsBounds: SubjectsBounds,
  offsets: Offsets
): Bounds {
  const layerBounds = getBoundsOfLayerByPlacement(
    placement,
    subjectsBounds,
    offsets
  ) as MutableBounds;

  // Add container offsets for each side
  for (const side of BOUND_SIDES) {
    layerBounds[side] += addOrSubstract(
      offsets[OffsetType.container],
      Side[BoundSide[side]]
    );
  }

  layerBounds.width = layerBounds.width + offsets[OffsetType.container] * 2;
  layerBounds.height = layerBounds.height + offsets[OffsetType.container] * 2;

  return layerBounds;
}

export function getDistanceBetweenBounds(
  parent: Bounds,
  child: Bounds
): Bounds {
  return {
    top: child.top - parent.top,
    bottom: parent.bottom - child.bottom,
    left: child.left - parent.left,
    right: parent.right - child.right,
    height: parent.height - child.height,
    width: parent.width - child.width
  };
}

// returns the visible surface of the layer by calculating the impact
// of sides which have a negative distance between the layer and
// scroll-container
export function getVisibleLayerSurface(layer: Bounds, container: Bounds) {
  const boundsDiffs = getDistanceBetweenBounds(container, layer);

  const negativeSides = BOUND_SIDES.filter(side => boundsDiffs[side] < 0);

  let width = layer.width;
  let height = layer.height;

  // for each negative side, substract it from the current width or height
  for (const negativeSide of negativeSides) {
    if ([BoundSide.top, BoundSide.bottom].includes(negativeSide)) {
      height += boundsDiffs[negativeSide];
    } else {
      width += boundsDiffs[negativeSide];
    }
  }

  // since negative * negative makes positive, we must make the surface negative
  // when both sides (completely) are invisible
  const isInvisible = width < 0 && height < 0;
  const surface = width * height * (isInvisible ? -1 : 1);
  return surface;
}

// utility function that merges multiple bounds into one boundary
// with the help of a callback function
// i.e.:
// combineMultipleBoundsIntoOne(
//   [boundA, boundB],
//   (valueA, valueB) => Math.min(valueA, valueB)
// );
export function combineMultipleBoundsIntoOne(
  multipleBounds: Bounds[],
  mergeFn: (valueA: number, valueB: number) => number
): Bounds {
  const [firstBounds, ...otherBounds] = multipleBounds;
  const result = { ...firstBounds };

  for (const currentBounds of otherBounds) {
    for (const side of BOUND_SIDES) {
      result[side] = mergeFn(result[side], currentBounds[side]);
    }
  }

  return result;
}
