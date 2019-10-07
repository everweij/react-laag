import { Rects, AnchorEnum, PreferedX, PreferedY } from "../types";

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
  snapToAnchor
}: GetAutoAdjustStyleArgs): {
  layerStyle: React.CSSProperties;
  layerRect: ClientRect;
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
        scrollOffset
      )
    : preferedAnchor;

  // calculate a secondary offset when `autoAdjust` is set
  // and `snapToAnchor` is not.
  // Basically it created a visual effect where it seems that
  // the layer has glued to it's parents sides
  const offsetSecondary =
    autoAdjust && !snapToAnchor
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
    offsetSecondary
  });

  return {
    layerStyle,
    layerRect
  };
}
