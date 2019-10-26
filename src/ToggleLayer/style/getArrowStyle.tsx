import { LayerSide } from "../types";

export default function getArrowStyle(
  layer: ClientRect,
  trigger: ClientRect,
  layerSide: LayerSide
): React.CSSProperties {
  if (layerSide === "bottom") {
    return {
      bottom: "100%",
      top: null,
      left: trigger.left + trigger.width / 2 - layer.left,
      right: null
    } as any;
  }
  if (layerSide === "right") {
    return {
      right: "100%",
      left: null,
      top: trigger.top + trigger.height / 2 - layer.top,
      bottom: null
    } as any;
  }
  if (layerSide === "top") {
    return {
      top: "100%",
      bottom: null,
      left: trigger.left + trigger.width / 2 - layer.left,
      right: null
    } as any;
  }

  return {
    left: "100%",
    right: null,
    top: trigger.top + trigger.height / 2 - layer.top,
    bottom: null
  } as any;
}
