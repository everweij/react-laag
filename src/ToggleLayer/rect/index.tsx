import {
  Rects,
  AnchorEnum,
  OffsetSide,
  LayerDimensions,
  LayerSide
} from "../types";
import getLayerRectByAnchor from "./getLayerRectByAnchor";

const ALL_OFFSET_SIDES: OffsetSide[] = ["bottom", "top", "left", "right"];

type LayerOffsets = Record<OffsetSide, number>;

function getLayerOffsetsToParent(
  layer: ClientRect,
  parent: ClientRect
): LayerOffsets {
  return {
    top: layer.top - parent.top,
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

  const { width, height } = ALL_OFFSET_SIDES.filter(
    side => offsets[side] < 0
  ).reduce((rect, side) => {
    const affectedProperty: "width" | "height" =
      side === "top" || side === "bottom" ? "height" : "width";

    return {
      ...rect,
      [affectedProperty]: rect[affectedProperty] + offsets[side]
    };
  }, layer);

  const result = width * height;

  return width < 0 && height < 0 ? -result : result;
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
  scrollOffset: number,
  layerDimensions: LayerDimensions | null
) {
  const layerRect = getLayerRectByAnchor({
    anchor,
    trigger: rects.trigger,
    layer: rects.layer,
    triggerOffset,
    scrollOffset,
    layerDimensions
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
      scrollOffset,
      layerDimensions: null
    }),
    rects.scrollParents
  );
}

export function triggerIsBiggerThanLayer(
  layerSide: LayerSide,
  layer: ClientRect,
  trigger: ClientRect
): boolean {
  return (
    ((layerSide === "top" || layerSide === "bottom") &&
      trigger.width > layer.width) ||
    ((layerSide === "left" || layerSide === "right") &&
      trigger.height > layer.height)
  );
}
