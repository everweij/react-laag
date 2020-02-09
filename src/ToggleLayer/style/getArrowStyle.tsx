import { LayerSide } from "../types";
import { triggerIsBiggerThanLayer } from "../rect";
import { minMax } from "../util";

function getOffsets(layer: ClientRect, trigger: ClientRect, arrow: ClientRect) {
  const left = layer.left + layer.width / 2 - trigger.left - arrow.width / 2;
  const right = layer.right - layer.width / 2 - trigger.right + arrow.width / 2;
  const top = layer.top + layer.height / 2 - trigger.top - arrow.height / 2;
  const bottom =
    layer.bottom - layer.height / 2 - trigger.bottom + arrow.height / 2;

  return {
    left: left < 0 ? -left : 0,
    right: right > 0 ? -right : 0,
    top: top < 0 ? -top : 0,
    bottom: bottom > 0 ? -bottom : 0
  };
}

export default function getArrowStyle(
  layer: ClientRect,
  trigger: ClientRect,
  layerSide: LayerSide,
  arrow: ClientRect
): React.CSSProperties {
  const triggerIsBigger = triggerIsBiggerThanLayer(layerSide, layer, trigger);

  const limitsDefault = {
    left: {
      min: arrow.width / 2,
      max: layer.width - arrow.width / 2
    },
    top: {
      min: arrow.height / 2,
      max: layer.height - arrow.height / 2
    }
  };

  const offsets = getOffsets(layer, trigger, arrow);

  if (layerSide === "bottom") {
    return {
      bottom: "100%",
      top: null,
      left: minMax(
        triggerIsBigger
          ? layer.width / 2 + (offsets.left + offsets.right)
          : trigger.left + trigger.width / 2 - layer.left,
        limitsDefault.left
      ),
      right: null
    } as any;
  }
  if (layerSide === "right") {
    return {
      right: "100%",
      left: null,
      top: minMax(
        triggerIsBigger
          ? layer.height / 2 + (offsets.top + offsets.bottom)
          : trigger.top + trigger.height / 2 - layer.top,
        limitsDefault.top
      ),
      bottom: null
    } as any;
  }
  if (layerSide === "top") {
    return {
      top: "100%",
      bottom: null,
      left: minMax(
        triggerIsBigger
          ? layer.width / 2 + (offsets.left + offsets.right)
          : trigger.left + trigger.width / 2 - layer.left,
        limitsDefault.left
      ),
      right: null
    } as any;
  }

  return {
    left: "100%",
    right: null,
    top: minMax(
      triggerIsBigger
        ? layer.height / 2 + (offsets.top + offsets.bottom)
        : trigger.top + trigger.height / 2 - layer.top,
      limitsDefault.top
    ),
    bottom: null
  } as any;
}
