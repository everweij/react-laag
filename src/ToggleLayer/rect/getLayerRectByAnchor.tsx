import {
  Direction,
  Primary,
  Side,
  AnchorEnum,
  LayerDimensions
} from "../types";

import {
  splitAnchor,
  getPrimaryDirection,
  getLayerSideByAnchor
} from "../anchor";

import { clientRectToObject } from "../util";

// if user provided `layerDimensions` to the `placement` prop,
// anticipate the width / height based on the current anchor
function fixLayerDimensions(
  originalLayer: ClientRect,
  anchor: AnchorEnum,
  layerDimensions: LayerDimensions
): ClientRect {
  const dimensions =
    typeof layerDimensions === "function"
      ? layerDimensions(getLayerSideByAnchor(anchor))
      : layerDimensions;

  return {
    ...clientRectToObject(originalLayer),
    ...dimensions
  };
}

const propMap = {
  TOP: { side1: "bottom", side2: "top", size: "height", factor: -1 },
  BOTTOM: { side1: "top", side2: "bottom", size: "height", factor: 1 },
  LEFT: { side1: "right", side2: "left", size: "width", factor: -1 },
  RIGHT: { side1: "left", side2: "right", size: "width", factor: 1 }
};

function getPrimaryRect(
  primary: Primary,
  trigger: ClientRect,
  layer: ClientRect,
  triggerOffset: number
) {
  const { side1, side2, size, factor } = propMap[primary];

  const value = trigger[side2] + triggerOffset * factor;

  return {
    [side1]: value,
    [side2]: value + layer[size] * factor
  };
}

function getCenter(
  trigger: ClientRect,
  layer: ClientRect,
  offsetSecondary: number,
  prop: "top" | "left",
  size: "width" | "height"
) {
  const value =
    trigger[prop] + trigger[size] / 2 - layer[size] / 2 - offsetSecondary;

  return {
    [prop]: value,
    [prop === "left" ? "right" : "bottom"]: value + layer[size]
  };
}

function getSecondaryRect(
  secondary: Side,
  trigger: ClientRect,
  layer: ClientRect,
  offsetSecondary: number,
  primaryDirection: Direction
) {
  if (secondary === "CENTER") {
    const prop = primaryDirection === "X" ? "top" : "left";
    const size = primaryDirection === "X" ? "height" : "width";

    return getCenter(trigger, layer, offsetSecondary, prop, size);
  }

  const { side1, side2, size, factor } = propMap[secondary];

  const value = trigger[side2] - offsetSecondary * factor;

  return {
    [side2]: value,
    [side1]: value - layer[size] * factor
  };
}

type GetLayerRectArgs = {
  trigger: ClientRect;
  layer: ClientRect;
  anchor: AnchorEnum;
  triggerOffset: number;
  scrollOffset?: number;
  offsetSecondary?: number;
  layerDimensions: LayerDimensions | null;
};

export default function getLayerRectByAnchor({
  trigger,
  layer,
  anchor,
  triggerOffset,
  scrollOffset = 0,
  offsetSecondary = 0,
  layerDimensions
}: GetLayerRectArgs): ClientRect {
  let primaryRect: Partial<ClientRect>;
  let secondaryRect: Partial<ClientRect>;

  // get the correct anticipated ClientRect based on the provided Anchor
  const layerRect = layerDimensions
    ? fixLayerDimensions(layer, anchor, layerDimensions)
    : layer;

  if (anchor === "CENTER") {
    primaryRect = getCenter(trigger, layerRect, 0, "top", "height");
    secondaryRect = getCenter(trigger, layerRect, 0, "left", "width");
  } else {
    const { primary, secondary } = splitAnchor(anchor);

    const primaryDirection = getPrimaryDirection(anchor);

    primaryRect = getPrimaryRect(primary, trigger, layerRect, triggerOffset);
    secondaryRect = getSecondaryRect(
      secondary,
      trigger,
      layerRect,
      offsetSecondary,
      primaryDirection
    );
  }

  const result = {
    ...layerRect,
    ...primaryRect,
    ...secondaryRect
  };

  // correct scrollOffsets
  result.top = result.top - scrollOffset;
  result.right = result.right + scrollOffset;
  result.left = result.left - scrollOffset;
  result.bottom = result.bottom + scrollOffset;

  return result;
}
