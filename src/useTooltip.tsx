import * as React from "react";

import useHover, { HoverOptions } from "./useHover";
import useToggleLayer from "./ToggleLayer/useToggleLayer";
import { ToggleLayerOptions, RenderLayer } from "./ToggleLayer/types";

export type TooltipOptions = HoverOptions & ToggleLayerOptions;

export default function useTooltip(
  renderLayer: RenderLayer,
  { delayEnter, delayLeave, hideOnScroll, ...rest }: TooltipOptions = {}
) {
  const triggerRef = React.useRef<any>();

  const [element, { openFromRef, close }] = useToggleLayer(renderLayer, rest);

  const hoverProps = useHover({
    delayEnter,
    delayLeave,
    hideOnScroll,
    onShow: () => openFromRef(triggerRef),
    onHide: close
  });

  const triggerProps = {
    ref: triggerRef,
    ...hoverProps
  };

  return [element, triggerProps] as const;
}
