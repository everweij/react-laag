import { Rects, AnchorEnum } from "../types";
import { getPrimaryDirection } from "../anchor";
import {
  doesAnchorFitWithinScrollParents,
  getVisibleLayerSurfaceWithinScrollParent
} from "../rect";
import getLayerRectByAnchor from "../rect/getLayerRectByAnchor";

function getOffsetSurface(
  anchor: AnchorEnum,
  layer: ClientRect,
  triggerOffset: number,
  scrollOffset: number
) {
  const primaryDirection = getPrimaryDirection(anchor);

  const primarySize =
    layer[primaryDirection === "X" ? "width" : "height"] -
    triggerOffset -
    scrollOffset * 2;

  const secondarySize =
    layer[primaryDirection === "X" ? "height" : "width"] -
    triggerOffset -
    scrollOffset * 2;

  return primarySize * secondarySize;
}

function findAnchorByLayerSurface(
  rects: Rects,
  anchorOptions: AnchorEnum[],
  triggerOffset: number,
  scrollOffset: number
): AnchorEnum {
  const result = anchorOptions
    .map(anchor => {
      // get layerRect based on all offsets
      const layerRect = getLayerRectByAnchor({
        anchor,
        layer: rects.layer,
        trigger: rects.trigger,
        scrollOffset,
        triggerOffset
      });

      // get smallest visible layer surface for current anchor
      const surface = getVisibleLayerSurfaceWithinScrollParent(
        layerRect,
        rects.scrollParents
      );

      // get surface of the offsets
      // offsets are important for collision detection, but
      // eventually we are interested in the 'meat' of the layer
      const offsetSurface = getOffsetSurface(
        anchor,
        layerRect,
        triggerOffset,
        scrollOffset
      );

      return {
        anchor,
        square: surface - offsetSurface
      };
    })
    // sort -> biggest surface first
    .sort((a, b) => b.square - a.square);

  return result[0].anchor;
}

export default function findBestSuitableAnchor(
  rects: Rects,
  anchorOptions: AnchorEnum[],
  triggerOffset: number,
  scrollOffset: number
): AnchorEnum {
  // STRATEGY A
  // find first that fits parent
  const anchor = anchorOptions.find(anchor =>
    doesAnchorFitWithinScrollParents(anchor, rects, triggerOffset, scrollOffset)
  );

  if (anchor) {
    return anchor;
  }

  // STRATEGY B
  // find first with biggest surface
  return findAnchorByLayerSurface(
    rects,
    anchorOptions,
    triggerOffset,
    scrollOffset
  );
}
