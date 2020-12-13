import { UseLayerOptions, DisappearType, PLACEMENT_TYPES } from "../src";

export type TestCaseOptions = Required<
  Omit<
    UseLayerOptions,
    | "isOpen"
    | "ResizeObserver"
    | "environment"
    | "onDisappear"
    | "onOutsideClick"
    | "onParentClose"
  > & {
    closeOnDisappear?: false | DisappearType;
    closeOnOutsideClick?: boolean;
    triggerIsBigger?: boolean;
    initialOpen?: boolean;
  }
>;

export const baseOptions: TestCaseOptions = {
  auto: false,
  layerDimensions: null,
  closeOnDisappear: false,
  closeOnOutsideClick: false,
  overflowContainer: true,
  placement: "top-center",
  possiblePlacements: PLACEMENT_TYPES,
  preferX: "right",
  preferY: "bottom",
  snap: false,
  arrowOffset: 8,
  triggerOffset: 12,
  containerOffset: 16,
  triggerIsBigger: false,
  initialOpen: false
};
