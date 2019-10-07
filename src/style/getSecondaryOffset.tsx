import { Rects, AnchorEnum, OffsetSide } from "../types";
import {
  getLayerOffsetsToScrollParentsByAnchor,
  getNegativeOffsetSides,
  doesAnchorFitWithinScrollParents,
  reduceOffsets
} from "../rect";
import {
  splitAnchor,
  getPrimaryDirection,
  getSecondaryAnchorOptionsByPrimary
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
   * Check wether there are other anchors available
   * If not, skip secondary offset
   */
  const secondaryAnchorOptions = getSecondaryAnchorOptionsByPrimary(
    primary,
    anchorOptions
  );

  if (secondaryAnchorOptions.length === 1) {
    return 0;
  }

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
    scrollOffset
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
      scrollOffset
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

  // ensure `secondaryOffset` is always negative or 0
  let secondaryOffset = Math.min(-currentOffsets[affectedSide], 0);

  // when current anchor is center, make `secondaryOffset` positive
  // when affectedSide is bottom or right
  const isCenter = anchor.includes("_CENTER");
  if (isCenter && (affectedSide === "bottom" || affectedSide === "left")) {
    secondaryOffset = -secondaryOffset;
  }

  return secondaryOffset;
}
