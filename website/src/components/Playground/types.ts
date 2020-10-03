import { Options as UseLayerOptions } from "../../../../src";

export type Options = Required<
  Omit<
    UseLayerOptions,
    | "isOpen"
    | "onOutsideClick"
    | "ResizeObserver"
    | "onDisappear"
    | "environment"
    | "onParentClose"
    | "layerDimensions"
  >
> & {
  closeOnOutsideClick: boolean;
  closeOnDisappear: false | "partial" | "full";
};

export type LayerSettings = {
  width: number;
  height: number;
  color: "light" | "dark";
  arrowSize: number;
  arrowRoundness: number;
};
