import { DisappearType, Options } from "../src/types";
import { PLACEMENT_TYPES } from "../src/PlacementType";

export type TestCaseOptions = Required<
  Omit<
    Options,
    | "isOpen"
    | "ResizeObserver"
    | "environment"
    | "onDisappear"
    | "onOutsideClick"
    | "onParentClose"
    | "container"
    | "trigger"
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
