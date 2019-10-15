import {
  Rects,
  AnchorEnum,
  PreferedX,
  PreferedY,
  LayerDimensions
} from "../types";

import { getAnchorPriority } from "../anchor";

import getAbsolutePositions from "./getAbsolutePositions";
import getSuitableAnchor from "./getSuitableAnchor";
import getSecondaryOffset from "./getSecondaryOffset";
import getLayerRectByAnchor from "../rect/getLayerRectByAnchor";

export { default as getArrowStyle } from "./getArrowStyle";

type GetAutoAdjustStyleArgs = {
  rects: Rects;
  scrollbarWidth: number;
  scrollbarHeight: number;
  scrollTop: number;
  scrollLeft: number;
  triggerOffset: number;
  scrollOffset: number;
  preferedAnchor: AnchorEnum;
  preferedX: PreferedX;
  preferedY: PreferedY;
  possibleAnchors: AnchorEnum[];
  autoAdjust: boolean;
  snapToAnchor: boolean;
  layerDimensions?: LayerDimensions;
};

export default function getAbsoluteStyle({
  rects,
  scrollbarWidth,
  scrollbarHeight,
  scrollTop,
  scrollLeft,
  triggerOffset,
  scrollOffset,
  possibleAnchors,
  preferedAnchor,
  preferedX,
  preferedY,
  autoAdjust,
  snapToAnchor,
  layerDimensions
}: GetAutoAdjustStyleArgs): {
  layerStyle: React.CSSProperties;
  layerRect: ClientRect;
  anchor: AnchorEnum;
} {
  // get a list of possible anchors bases on user set props
  const possibleAnchorsByPriority = getAnchorPriority(
    preferedAnchor,
    possibleAnchors,
    preferedX,
    preferedY
  );

  // on `autoAdjust` find best suitable anchor based on
  // window's / scrollParent's position
  const anchor = autoAdjust
    ? getSuitableAnchor(
        rects,
        possibleAnchorsByPriority,
        triggerOffset,
        scrollOffset,
        layerDimensions
      )
    : preferedAnchor;

  // calculate a secondary offset when `autoAdjust` is set
  // and `snapToAnchor` is not.
  // Basically it creates a visual effect where it seems that
  // the layer has glued to it's parents sides
  // Note: `offsetSecondary` is disabled when anchor is CENTER
  const offsetSecondary =
    autoAdjust && !snapToAnchor && anchor !== "CENTER"
      ? getSecondaryOffset(
          anchor,
          possibleAnchorsByPriority,
          rects,
          triggerOffset,
          scrollOffset
        )
      : 0;

  const layerStyle = getAbsolutePositions({
    anchor,
    rects,
    triggerOffset,
    offsetSecondary,
    scrollLeft,
    scrollTop,
    scrollbarWidth,
    scrollbarHeight
  });

  const layerRect = getLayerRectByAnchor({
    anchor,
    trigger: rects.trigger,
    layer: rects.layer,
    triggerOffset,
    offsetSecondary,
    layerDimensions
  });

  if (layerDimensions) {
    layerStyle.width = layerRect.width;
    layerStyle.height = layerRect.height;
  }

  return {
    layerStyle,
    layerRect,
    anchor
  };
}
