import { Rects, AnchorEnum, OffsetSide, LayerSide } from "../types";
import getLayerRectByAnchor from "./getLayerRectByAnchor";

const ALL_OFFSET_SIDES: OffsetSide[] = ["bottom", "top", "left", "right"];

type LayerOffsets = Record<OffsetSide, number>;

function getLayerOffsetsToParent(
  layer: ClientRect,
  parent: ClientRect
): LayerOffsets {
  return {
    top: layer.top - parent.top,
    // bottom: parent.top + parent.height - (layer.top + layer.height),
    bottom: parent.bottom - layer.bottom,
    left: layer.left - parent.left,
    right: parent.right - layer.right
  };
}

function getLayerOffsetsToParents(layer: ClientRect, parents: ClientRect[]) {
  return parents.map(parent => getLayerOffsetsToParent(layer, parent));
}

export function isLayerCompletelyInvisible(
  layer: ClientRect,
  parents: ClientRect[]
) {
  return parents.some(parent => {
    return (
      layer.bottom <= parent.top ||
      layer.right <= parent.left ||
      layer.top >= parent.bottom ||
      layer.left >= parent.right
    );
  });
}

export function doesEntireLayerFitWithinScrollParents(
  layer: ClientRect,
  parents: ClientRect[]
) {
  const parentOffsets = getLayerOffsetsToParents(layer, parents);

  return parentOffsets.every(offsets => {
    return ALL_OFFSET_SIDES.every(side => offsets[side] >= 0);
  });
}

export function reduceOffsets(parentOffsets: LayerOffsets[]): LayerOffsets {
  const parentOffsetsCombined = parentOffsets.reduce(
    (result, offsets) => {
      ALL_OFFSET_SIDES.forEach(side => {
        result[side] = [...result[side], offsets[side]];
      });
      return result;
    },
    {
      top: [] as number[],
      bottom: [] as number[],
      left: [] as number[],
      right: [] as number[]
    }
  );

  return ALL_OFFSET_SIDES.reduce(
    (result, side) => {
      result[side] = parentOffsetsCombined[side].sort((a, b) => a - b)[0];
      return result;
    },
    {} as LayerOffsets
  );
}

export function getNegativeOffsetSides(parentOffsets: LayerOffsets[]) {
  const offsets = reduceOffsets(parentOffsets);

  return ALL_OFFSET_SIDES.filter(side => offsets[side] < 0);
}

function getVisibleLayerSurface(layer: ClientRect, parent: ClientRect) {
  const offsets = getLayerOffsetsToParent(layer, parent);

  const visibleRect = ALL_OFFSET_SIDES.filter(side => offsets[side] < 0).reduce(
    (rect, side) => {
      const affectedProperty: "width" | "height" =
        side === "top" || side === "bottom" ? "height" : "width";

      return {
        ...rect,
        [affectedProperty]: rect[affectedProperty] + offsets[side]
      };
    },
    layer
  );

  return visibleRect.width * visibleRect.height;
}

export function getVisibleLayerSurfaceWithinScrollParent(
  layer: ClientRect,
  parents: ClientRect[]
) {
  const surfaces = parents.map(parent => getVisibleLayerSurface(layer, parent));

  // pick smallest
  return surfaces.sort((a, b) => a - b)[0];
}

export function doesAnchorFitWithinScrollParents(
  anchor: AnchorEnum,
  rects: Rects,
  triggerOffset: number,
  scrollOffset: number
) {
  const layerRect = getLayerRectByAnchor({
    anchor,
    trigger: rects.trigger,
    layer: rects.layer,
    triggerOffset,
    scrollOffset
  });
  return doesEntireLayerFitWithinScrollParents(layerRect, rects.scrollParents);
}

export function getLayerOffsetsToScrollParentsByAnchor(
  anchor: AnchorEnum,
  rects: Rects,
  triggerOffset: number,
  scrollOffset: number
) {
  return getLayerOffsetsToParents(
    getLayerRectByAnchor({
      anchor,
      trigger: rects.trigger,
      layer: rects.layer,
      triggerOffset,
      scrollOffset
    }),
    rects.scrollParents
  );
}

export function getLayerSide(
  layer: ClientRect,
  trigger: ClientRect
): LayerSide {
  if (layer.top >= trigger.bottom) {
    return "bottom";
  }
  if (layer.left >= trigger.right) {
    return "right";
  }
  if (layer.bottom <= trigger.top) {
    return "top";
  }

  return "left";
}
