import { LayerSide } from "../types";
import { triggerIsBiggerThanLayer } from "../rect";

export default function getArrowStyle(
  layer: ClientRect,
  trigger: ClientRect,
  layerSide: LayerSide
): React.CSSProperties {
  const triggerIsBigger = triggerIsBiggerThanLayer(layerSide, layer, trigger);

  if (layerSide === "bottom") {
    return {
      bottom: "100%",
      top: null,
      left: triggerIsBigger
        ? "50%"
        : trigger.left + trigger.width / 2 - layer.left,
      right: null
    } as any;
  }
  if (layerSide === "right") {
    return {
      right: "100%",
      left: null,
      top: triggerIsBigger
        ? "50%"
        : trigger.top + trigger.height / 2 - layer.top,
      bottom: null
    } as any;
  }
  if (layerSide === "top") {
    return {
      top: "100%",
      bottom: null,
      left: triggerIsBigger
        ? "50%"
        : trigger.left + trigger.width / 2 - layer.left,
      right: null
    } as any;
  }

  return {
    left: "100%",
    right: null,
    top: triggerIsBigger ? "50%" : trigger.top + trigger.height / 2 - layer.top,
    bottom: null
  } as any;
}
