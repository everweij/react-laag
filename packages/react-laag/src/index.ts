export {
  useLayer,
  DEFAULT_OPTIONS,
  setGlobalContainer
} from "./useLayer";
// eslint-disable-next-line prettier/prettier
export type { 
  UseLayerProps,
  LayerProps,
  TriggerProps,
  UseLayerArrowProps
} from './useLayer';
export { Arrow } from "./Arrow";
export type { ArrowProps } from './Arrow';
export {
  useHover
} from "./useHover";
export type  {
  UseHoverProps,
  UseHoverOptions,
  PlainCallback
} from "./useHover";

export type {
  LayerSide,
  DisappearType,
  ResizeObserverClass,
  Options as UseLayerOptions
} from "./types";
export { PLACEMENT_TYPES } from "./PlacementType";
export type { PlacementType as Placement } from "./PlacementType";
export { mergeRefs } from "./util";
export type { IBounds } from "./Bounds";
export {
  useMousePositionAsTrigger
} from "./hooks";
export type {
  UseMousePositionAsTriggerOptions,
  UseMousePositionAsTriggerProps
} from "./hooks";
export { Transition } from "./Transition";
export type { TransitionProps } from "./Transition";
