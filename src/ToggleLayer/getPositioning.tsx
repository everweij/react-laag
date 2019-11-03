import { Placement, ResultingStyles } from "./types";
import { getWindowClientRect, getContentBox, EMPTY_STYLE } from "./util";
import { POSSIBLE_ANCHORS, getLayerSideByAnchor } from "./anchor";
import getAbsoluteStyle, { getArrowStyle } from "./style";

function compensateScrollbars(
  rect: ClientRect,
  clientWidth: number,
  clientHeight: number
) {
  const scrollbarWidth = rect.width - clientWidth;
  const scrollbarHeight = rect.height - clientHeight;

  return {
    left: rect.left,
    top: rect.top,
    width: rect.width - scrollbarWidth,
    right: rect.right - scrollbarWidth,
    height: rect.height - scrollbarHeight,
    bottom: rect.bottom - scrollbarHeight
  };
}

export const defaultPlacement: Required<Placement> = {
  autoAdjust: false,
  snapToAnchor: false,
  anchor: "TOP_CENTER",
  layerDimensions: null,
  possibleAnchors: POSSIBLE_ANCHORS,
  preferX: "RIGHT",
  preferY: "BOTTOM",
  scrollOffset: 10,
  triggerOffset: 0
};

type CalculateStyleProps = {
  triggerRect: ClientRect;
  layerElement: HTMLElement | null;
  relativeParentElement: HTMLElement | null;
  scrollParents: HTMLElement[];
  placement: Placement;
  fixed: boolean | undefined;
};

export default function getPositioning({
  triggerRect,
  layerElement,
  relativeParentElement,
  scrollParents,
  placement = {},
  fixed
}: CalculateStyleProps) {
  /**
   * A.
   * Calculate new layer positions
   */

  // sometimes ResizeObserver calls this function when all values in the
  // trigger ClientRect are 0. Return early in that case
  if (triggerRect.height === 0) {
    return;
  }

  if (!layerElement) {
    return;
  }

  // gather all scroll parents (including the window ClientRect)
  // in order to check for collisions
  const scrollParentRects = fixed
    ? [getWindowClientRect()]
    : [
        ...scrollParents.map(parent =>
          compensateScrollbars(
            parent.getBoundingClientRect(),
            parent.clientWidth,
            parent.clientHeight
          )
        ),
        getWindowClientRect()
      ];

  const options = {
    autoAdjust: placement.autoAdjust || defaultPlacement.autoAdjust,
    snapToAnchor: placement.snapToAnchor || defaultPlacement.snapToAnchor,
    triggerOffset: placement.triggerOffset || defaultPlacement.triggerOffset,
    scrollOffset: placement.scrollOffset || defaultPlacement.scrollOffset,
    possibleAnchors:
      placement.possibleAnchors || defaultPlacement.possibleAnchors,
    preferedAnchor: placement.anchor || defaultPlacement.anchor,
    preferedX: placement.preferX || defaultPlacement.preferX,
    preferedY: placement.preferY || defaultPlacement.preferY,
    scrollLeft:
      relativeParentElement === document.body
        ? 0
        : relativeParentElement!.scrollLeft,
    scrollTop:
      relativeParentElement === document.body
        ? 0
        : relativeParentElement!.scrollTop,
    relativeParentElement,
    layerDimensions:
      placement.layerDimensions || defaultPlacement.layerDimensions
  };

  const layerBox = layerElement.getBoundingClientRect();

  // construct layerRect
  const layer = {
    top: layerBox.top,
    left: layerBox.left,
    right: layerBox.right,
    bottom: layerBox.bottom,

    // use `window.getComputedProperty` for width / height in order
    // to handle things like scale-transforms
    ...getContentBox(layerElement!)
  };

  const rects = {
    layer,
    relativeParent: relativeParentElement!.getBoundingClientRect(),
    scrollParents: scrollParentRects,
    trigger: triggerRect
  };

  const { layerRect, layerStyle, anchor } = getAbsoluteStyle({
    rects,
    ...options
  });

  if (fixed) {
    layerStyle.top = layerRect.top;
    layerStyle.left = layerRect.left;
  }

  // determine in which side to layer will be relative to
  // the trigger
  const layerSide = getLayerSideByAnchor(anchor);

  // get optional arrow positions
  // anchor-style is pointless when rendered anchor is CENTER
  const arrowStyle =
    anchor === "CENTER"
      ? EMPTY_STYLE
      : getArrowStyle(layerRect, triggerRect, layerSide);

  const styles: ResultingStyles = {
    layer: layerStyle,
    arrow: arrowStyle,
    layerSide
  };

  return {
    styles,
    layerRect
  };
}
