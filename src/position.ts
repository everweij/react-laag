import {
  Options,
  SubjectsBounds,
  Side,
  Placement,
  LayerDimensions,
  Offsets,
  Bounds,
  Direction,
  BoundSide,
  OffsetType,
  DisappearType,
  SizeProperty,
  Styles,
  Scroll,
  Borders
} from "./types";
import {
  getListOfPlacementsByPriority,
  getPlacementProperties,
  getPlacementsOfSameSide
} from "./placement";
import {
  getCollisionBoundsOfLayerByPlacement,
  getBoundsOfLayerByPlacement,
  getVisibleLayerSurface,
  getDistanceBetweenBounds,
  combineMultipleBoundsIntoOne,
  BOUND_SIDES
} from "./bounds";
import { getArrowStyle } from "./getArrowStyle";

export type PositionConfig = Required<
  Pick<
    Options,
    | "placement"
    | "snap"
    | "auto"
    | "layerDimensions"
    | "arrowOffset"
    | "containerOffset"
    | "triggerOffset"
    | "possiblePlacements"
    | "preferX"
    | "preferY"
    | "overflowContainer"
  >
> & { subjectsBounds: SubjectsBounds; scroll: Scroll; borders: Borders };

/**
 * Handles all positioning related stuff based on props set by the user
 * and element boundaries from the DOM
 */
export function position({
  subjectsBounds,
  placement,
  possiblePlacements,
  preferX,
  preferY,
  auto,
  snap,
  containerOffset,
  triggerOffset,
  arrowOffset,
  layerDimensions,
  overflowContainer,
  scroll,
  borders
}: PositionConfig) {
  // create a getter function that will give the correct subjects bounds
  // based on the placement (layerSide actually)
  const getAnticipatedSubjectsBoundsByPlacement = createAnticipatedSubjectsBounds(
    {
      ...subjectsBounds,
      // when overflowContainer only account for the boundaries of the window
      SCROLL_CONTAINERS: overflowContainer
        ? [subjectsBounds.WINDOW]
        : [subjectsBounds.WINDOW, ...subjectsBounds.SCROLL_CONTAINERS]
    },
    layerDimensions
  );

  // create collection of offsets which we will pass to various helper functions
  const offsets: Offsets = {
    [OffsetType.container]: containerOffset,
    [OffsetType.trigger]: triggerOffset,
    [OffsetType.secondary]: 0,
    [OffsetType.arrow]: arrowOffset
  };

  // some calculations and behavior alter when one or both are the case
  const triggerHasBiggerHeight =
    subjectsBounds.TRIGGER.height > subjectsBounds.LAYER.height;
  const triggerHasBiggerWidth =
    subjectsBounds.TRIGGER.width > subjectsBounds.LAYER.width;

  // get a list of possible placements based on props set by user
  const placementsByPriority = getListOfPlacementsByPriority(
    Placement[placement],
    possiblePlacements.map(key => Placement[key]),
    Side[preferX],
    Side[preferY],
    triggerHasBiggerHeight,
    triggerHasBiggerWidth
  );

  // if `auto` find best suitable placement based on
  // window and scroll-containers position
  const suitablePlacement = auto
    ? getSuitablePlacement(
        placementsByPriority,
        getAnticipatedSubjectsBoundsByPlacement,
        offsets
      )
    : Placement[placement];

  // calculate a secondary offset when `auto` is set
  // and `snap` is not.
  // Basically it creates a visual effect where it seems that
  // the layer has been "glued" to it's parents sides
  // Note: `offsetSecondary` is disabled when placement is "center"
  const offsetSecondary =
    auto && !snap && placement !== Placement[Placement.center]
      ? getSecondaryOffset(
          suitablePlacement,
          placementsByPriority,
          getAnticipatedSubjectsBoundsByPlacement,
          offsets
        )
      : 0;

  // get the actual boundaries of the new position
  const layerBounds = getBoundsOfLayerByPlacement(
    suitablePlacement,
    getAnticipatedSubjectsBoundsByPlacement(suitablePlacement),
    {
      ...offsets,
      [OffsetType.secondary]: offsetSecondary
    }
  );

  const layerStyleBase: React.CSSProperties = {
    willChange: "top, bottom, left, right, width, height"
  };

  const layerSide = getPlacementProperties(suitablePlacement).primary;

  const styles: Styles = {
    arrow: getArrowStyle(
      {
        ...subjectsBounds,
        LAYER: layerBounds
      },
      layerSide,
      arrowOffset
    ),
    layer: overflowContainer
      ? {
          ...layerStyleBase,
          position: "fixed",
          top: layerBounds.top,
          left: layerBounds.left
        }
      : {
          ...layerStyleBase,
          position: "absolute",
          top:
            layerBounds.top -
            subjectsBounds.PARENT.top +
            scroll.top -
            borders.top,
          left:
            layerBounds.left -
            subjectsBounds.PARENT.left +
            scroll.left -
            borders.left
        }
  };

  return {
    styles,
    // extract the layerSide from the most suitable placement
    layerSide: getPlacementProperties(suitablePlacement).primary,
    placement: suitablePlacement,
    layerBounds,
    hasDisappeared: getHasDisappeared(
      overflowContainer ? subjectsBounds.TRIGGER : layerBounds,
      [subjectsBounds.WINDOW, ...subjectsBounds.SCROLL_CONTAINERS]
    )
  };
}

function getHasDisappeared(
  bounds: Bounds,
  scrollContainersBounds: Bounds[]
): DisappearType | null {
  const boundOffsetsToContainers: Bounds[] = scrollContainersBounds.map(
    scrollContainerBounds =>
      getDistanceBetweenBounds(scrollContainerBounds, bounds)
  );

  const boundOffsets = combineMultipleBoundsIntoOne(
    boundOffsetsToContainers,
    Math.min
  );

  if (
    BOUND_SIDES.some(
      side =>
        boundOffsets[side] <=
        -bounds[
          [BoundSide.left, BoundSide.right].includes(side)
            ? SizeProperty.width
            : SizeProperty.height
        ]
    )
  ) {
    return "full";
  }
  if (BOUND_SIDES.some(side => boundOffsets[side] < 0)) {
    return "partial";
  }

  return null;
}

type GetAnticipatedSubjectsBounds = (placement: Placement) => SubjectsBounds;

// TODO: why not create an object where for all placements the bounds are pre-calculated?

/**
 * Factory function that return a getter function that will give the
 * correct subjects bounds based on the placement (layerSide actually)
 */
function createAnticipatedSubjectsBounds(
  subjectsBounds: SubjectsBounds,
  layerDimensions: LayerDimensions | null
) {
  return function getAnticipatedSubjectsBoundsByPlacement(
    placement: Placement
  ): SubjectsBounds {
    if (!layerDimensions) {
      return subjectsBounds;
    }

    const dimensions =
      // if the user passed a callback, call it with the layerSide corresponding to
      // the placement
      typeof layerDimensions === "function"
        ? layerDimensions(
            Side[getPlacementProperties(placement).primary] as keyof typeof Side
          )
        : layerDimensions;

    // return new SubjectBounds together with anticipated layer dimensions
    return {
      ...subjectsBounds,
      LAYER: {
        ...subjectsBounds.LAYER,
        ...dimensions
      }
    };
  };
}

// returns a list of boundaries representing the distances between the layer
// and the respectable scroll-container
function getLayerOffsetsToContainers(
  placement: Placement,
  subjectsBounds: SubjectsBounds,
  offsets: Offsets
) {
  const layerBounds = getCollisionBoundsOfLayerByPlacement(
    placement,
    subjectsBounds,
    offsets
  );

  const layerOffsetsToContainers: Bounds[] = subjectsBounds.SCROLL_CONTAINERS.map(
    scrollContainerBounds =>
      getDistanceBetweenBounds(scrollContainerBounds, layerBounds)
  );

  return layerOffsetsToContainers;
}

// returns a single boundary object representing the most negative
// distance between the layer and the scroll-containers
function getLayerOffsetToContainer(
  placement: Placement,
  subjectsBounds: SubjectsBounds,
  offsets: Offsets
) {
  const layerOffsetsToContainers = getLayerOffsetsToContainers(
    placement,
    subjectsBounds,
    offsets
  );

  return combineMultipleBoundsIntoOne(layerOffsetsToContainers, Math.min);
}

// given a list of possible placements ordered by preference
// return the placement that best fits the screen
function getSuitablePlacement(
  placements: Placement[],
  getSubjectsBounds: GetAnticipatedSubjectsBounds,
  offsets: Offsets
): Placement {
  // STRATEGY A
  // find first placement that fits container entirely
  for (const placement of placements) {
    const layerOffsetsToContainers = getLayerOffsetsToContainers(
      placement,
      getSubjectsBounds(placement),
      offsets
    );

    const placementDoesFitAllContainers = layerOffsetsToContainers.every(
      bounds => BOUND_SIDES.every(side => bounds[side] >= 0)
    );

    if (placementDoesFitAllContainers) {
      return placement;
    }
  }

  // STRATEGY B
  // find first with biggest surface
  const [{ placement: placementWithBiggestSurface }] = placements
    .map(placement => {
      // get boundaries of subjects based on this placement
      const subjectsBounds = getSubjectsBounds(placement);

      // get some sense how this will affect the layer boundary-wise
      const layerBounds = getBoundsOfLayerByPlacement(
        placement,
        subjectsBounds,
        offsets
      );

      // given all scroll-containers, what is the smallest visible surface?
      const [
        smallestVisibleSurface
      ] = subjectsBounds.SCROLL_CONTAINERS.map(scrollContainerBounds =>
        getVisibleLayerSurface(layerBounds, scrollContainerBounds)
      ).sort((a, b) => a - b);

      return {
        placement,
        surface: smallestVisibleSurface
      };
    })
    // sort -> biggest surface first
    .sort((a, b) => b.surface - a.surface);

  return placementWithBiggestSurface;
}

// finds the biggest negative side of the placement that did not fit
function getSecondaryOffsetSideProperty(
  placement: Placement,
  subjectsBounds: SubjectsBounds,
  offsets: Offsets
): BoundSide | null {
  const { direction } = getPlacementProperties(placement);

  const layerOffsetToContainer = getLayerOffsetToContainer(
    placement,
    subjectsBounds,
    offsets
  );

  // check for each relevant side if it is negative, and return the most
  // negative side
  const result = BOUND_SIDES.map(side => {
    const amountOfPx = layerOffsetToContainer[side];

    if (amountOfPx >= 0) {
      return null;
    }

    if (
      direction === Direction.HORIZONTAL &&
      ["top", "bottom"].includes(side)
    ) {
      return {
        side,
        amountOfPx
      };
    }
    if (direction === Direction.VERTICAL && ["left", "right"].includes(side)) {
      return {
        side,
        amountOfPx
      };
    }

    return null;
  })
    .filter(Boolean)
    .sort((a, b) => b!.amountOfPx - a!.amountOfPx) as Array<{
    side: BoundSide;
    amountOfPx: number;
  }>;

  return result[0]?.side ?? null;
}

// Depending on a couple of variables, sometimes we need to substract the secondary
// offset from the eventual layer-boundaries, instead of adding it.
function shouldMakeSecondaryOffsetNegative(
  placement: Placement,
  firstPlacementThatDoesNotFit: Placement,
  secondaryOffsetProperty: BoundSide,
  subjectsBounds: SubjectsBounds
) {
  const { secondary, oppositeSizeProperty } = getPlacementProperties(placement);

  const triggerIsBigger =
    subjectsBounds.TRIGGER[oppositeSizeProperty] >
    subjectsBounds.LAYER[oppositeSizeProperty];

  if (triggerIsBigger) {
    return [BoundSide.top, BoundSide.left].includes(secondaryOffsetProperty);
  }

  if (firstPlacementThatDoesNotFit === placement) {
    return (
      ((secondary === Side.center ||
        [Side.bottom, Side.right].includes(secondary)) &&
        ![BoundSide.bottom, BoundSide.right].includes(
          secondaryOffsetProperty
        )) ||
      ([Side.top, Side.left].includes(secondary) &&
        [BoundSide.top, BoundSide.left].includes(secondaryOffsetProperty))
    );
  }

  return (
    secondary === Side.left ||
    ([Side.top, Side.center].includes(secondary) &&
      ![BoundSide.bottom, BoundSide.right].includes(secondaryOffsetProperty))
  );
}

/**
 * secondary offset: the number of pixels between the edge of the
 * scroll-container and the current placement, on the side of the layer
 * that didn't fit.
 * Eventually this secondary offset gets added / subtracted from the
 * placement that does fit in order to move the layer closer to the
 * position of the placement that just would not fit.
 * This creates the effect that the layer is moving gradually from one
 * placement to the next as the users scrolls the page or scroll-container
 */
export default function getSecondaryOffset(
  placement: Placement,
  possiblePlacements: Placement[],
  getSubjectsBounds: GetAnticipatedSubjectsBounds,
  offsets: Offsets
) {
  const { primary } = getPlacementProperties(placement);

  // utility that checks whether a placement will fit given a certain
  // placement
  function doesPlacementFit(placement: Placement) {
    const layerOffsetsToContainers = getLayerOffsetsToContainers(
      placement,
      getSubjectsBounds(placement),
      offsets
    );

    const placementDoesFitAllContainers = layerOffsetsToContainers.every(
      bounds => BOUND_SIDES.every(side => bounds[side] >= 0)
    );

    return placementDoesFitAllContainers;
  }

  /**
   * Check which other placements are available on the same side
   */
  const placementsOnSameSide = getPlacementsOfSameSide(
    primary,
    possiblePlacements
  );

  /**
   * Check whether current placement is the preffered placement and whether
   * it fits
   * If so, return early -> no secondary offset necccesary
   */
  const currentPlacementHasHighestPriority =
    placementsOnSameSide.indexOf(placement) === 0;

  if (currentPlacementHasHighestPriority && doesPlacementFit(placement)) {
    return 0;
  }

  /**
   * Retrieve the first placement on same primary side (by priority) that
   * does not fit.
   * Check if there's a relevant side that has a negative offset.
   */
  const firstPlacementThatDoesNotFit = placementsOnSameSide.find(
    placement => !doesPlacementFit(placement)
  )!;

  const secondaryOffsetProperty = getSecondaryOffsetSideProperty(
    firstPlacementThatDoesNotFit,
    getSubjectsBounds(firstPlacementThatDoesNotFit),
    offsets
  );

  // apparently we could not find a secondaryOffsetProperty
  // returning early
  if (!secondaryOffsetProperty) {
    return 0;
  }

  const subjectsBounds = getSubjectsBounds(placement);

  const layerOffsetsToContainer = getLayerOffsetToContainer(
    placement,
    subjectsBounds,
    offsets
  );

  // get number of pixels between placement that did not fit and current
  // placement
  const secondaryOffset = layerOffsetsToContainer[secondaryOffsetProperty];

  return (
    secondaryOffset *
    (shouldMakeSecondaryOffsetNegative(
      placement,
      firstPlacementThatDoesNotFit,
      secondaryOffsetProperty,
      subjectsBounds
    )
      ? -1
      : 1)
  );
}
