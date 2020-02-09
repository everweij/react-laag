import { Rects, AnchorEnum, OffsetSide } from "../types";
import {
  getLayerOffsetsToScrollParentsByAnchor,
  getNegativeOffsetSides,
  doesAnchorFitWithinScrollParents,
  reduceOffsets,
  triggerIsBiggerThanLayer
} from "../rect";
import {
  splitAnchor,
  getPrimaryDirection,
  getSecondaryAnchorOptionsByPrimary,
  getLayerSideByAnchor
} from "../anchor";

// finds out which side of the layer will be affected
function getSecondaryOffsetSide(
  currentAnchor: AnchorEnum,
  firstAnchorThatDoesNotFit: AnchorEnum,
  rects: Rects,
  triggerOffset: number,
  scrollOffset: number
): OffsetSide | undefined {
  const primaryDirection = getPrimaryDirection(currentAnchor);

  const offsets = getLayerOffsetsToScrollParentsByAnchor(
    firstAnchorThatDoesNotFit,
    rects,
    triggerOffset,
    scrollOffset
  );

  const sides = getNegativeOffsetSides(offsets);

  return sides.find(side => {
    if (primaryDirection === "X") {
      return side === "top" || side === "bottom";
    }

    return side === "left" || side === "right";
  });
}

export default function findSecondaryOffset(
  anchor: AnchorEnum,
  anchorOptions: AnchorEnum[],
  rects: Rects,
  triggerOffset: number,
  scrollOffset: number
) {
  const { primary } = splitAnchor(anchor);

  /**
   * A.
   * Check which other anchors available
   */
  const secondaryAnchorOptions = getSecondaryAnchorOptionsByPrimary(
    primary,
    anchorOptions
  );

  /**
   * B.
   * Check whether current anchor is the preffered anchor and whether
   * it fits
   * If so, skip secondary offset
   */
  const currentAnchorHasHighestPriority =
    secondaryAnchorOptions.indexOf(anchor) === 0;
  const currentAnchorFits = doesAnchorFitWithinScrollParents(
    anchor,
    rects,
    triggerOffset,
    scrollOffset,
    null
  );

  if (currentAnchorHasHighestPriority && currentAnchorFits) {
    return 0;
  }

  /**
   * C.
   * Retrieve the first anchor on same primary side (by priority) that
   * does not fit.
   * Check if there's a relevant side that has a negative offset.
   * If not, skip secondary offset
   */
  const firstAnchorThatDoesNotFit = secondaryAnchorOptions.find(anchor => {
    return !doesAnchorFitWithinScrollParents(
      anchor,
      rects,
      triggerOffset,
      scrollOffset,
      null
    );
  })!;

  const affectedSide = getSecondaryOffsetSide(
    anchor,
    firstAnchorThatDoesNotFit,
    rects,
    triggerOffset,
    scrollOffset
  );

  if (!affectedSide) {
    return 0;
  }

  /**
   * Determine the final secondary offset
   */
  const currentOffsets = reduceOffsets(
    getLayerOffsetsToScrollParentsByAnchor(
      anchor,
      rects,
      triggerOffset,
      scrollOffset
    )
  );

  let secondaryOffset = -currentOffsets[affectedSide];

  const triggerIsBigger = triggerIsBiggerThanLayer(
    getLayerSideByAnchor(anchor),
    rects.layer,
    rects.trigger
  );

  const isCenter = anchor.includes("_CENTER");
  const isLeft = anchor.includes("_LEFT");
  const isTop = anchor.includes("_TOP");

  // when trigger is bigger, make `secondaryOffset` positive
  // conditionally
  if (
    triggerIsBigger &&
    ((isLeft && affectedSide === "right") ||
      affectedSide === "left" ||
      (isTop && affectedSide === "bottom") ||
      affectedSide === "top")
  ) {
    secondaryOffset = -secondaryOffset;
  } else if (
    // when current anchor is center, make `secondaryOffset` positive
    // when affectedSide is top or right
    !triggerIsBigger &&
    (isCenter && (affectedSide === "top" || affectedSide === "left"))
  ) {
    secondaryOffset = -secondaryOffset;
  }

  return secondaryOffset;
}
