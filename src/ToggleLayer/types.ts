import { ReactNode } from "react";

export type { ToggleLayerProps } from './ToggleLayer';
export type { ArrowProps } from './Arrow';

/**
 * Client Rect stuff
 */
export type Rects = {
  trigger: ClientRect;
  relativeParent: ClientRect;
  layer: ClientRect;
  arrow: ClientRect;
  scrollParents: ClientRect[];
};

/**
 * Anchor stuff
 */
export type AnchorEnum =
  | "BOTTOM_LEFT"
  | "BOTTOM_RIGHT"
  | "BOTTOM_CENTER"
  | "TOP_LEFT"
  | "TOP_RIGHT"
  | "TOP_CENTER"
  | "LEFT_BOTTOM"
  | "LEFT_TOP"
  | "LEFT_CENTER"
  | "RIGHT_BOTTOM"
  | "RIGHT_TOP"
  | "RIGHT_CENTER"
  | "CENTER";

export type Primary = Exclude<Side, "CENTER">;
export type Side = "TOP" | "BOTTOM" | "LEFT" | "RIGHT" | "CENTER";
export type Direction = "Y" | "X";

export type PreferedX = "LEFT" | "RIGHT";
export type PreferedY = "TOP" | "BOTTOM";

export type OffsetSide = "left" | "right" | "top" | "bottom";
export type LayerSide = OffsetSide | "center";

export type RenderLayerProps = {
  layerProps: {
    ref: (element: HTMLElement | null) => void;
    style: React.CSSProperties;
  };
  arrowStyle: React.CSSProperties;
  layerSide: LayerSide;
  triggerRect: ClientRect | null;
  isOpen: boolean;
  close: () => void;
};

export type RenderLayer = (props: RenderLayerProps) => ReactNode;

export type LayerDimensions = (
  layerSide: LayerSide
) => { width: number; height: number } | { width: number; height: number };

export type Placement = {
  anchor?: AnchorEnum;
  triggerOffset?: number;
  scrollOffset?: number;
  arrowOffset?: number;
  possibleAnchors?: AnchorEnum[];
  autoAdjust?: boolean;
  snapToAnchor?: boolean;
  preferX?: PreferedX;
  preferY?: PreferedY;
  layerDimensions?: LayerDimensions | null;
};

export type ResultingStyles = {
  layer: React.CSSProperties;
  arrow: React.CSSProperties;
  layerSide: LayerSide;
};

export type DisappearType = "partial" | "full";

export type OnStyle = (
  layerStyle: React.CSSProperties,
  arrowStyle: React.CSSProperties,
  layerSide: LayerSide
) => void;

export type Container = HTMLElement | (() => HTMLElement);

export type ToggleLayerOptions = {
  placement?: Placement;
  onStyle?: OnStyle;
  isOpen?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnDisappear?: DisappearType;
  onOutsideClick?: () => void;
  onDisappear?: (type: DisappearType) => void;
  ResizeObserver?: any;
  fixed?: boolean;
  container?: Container;
  environment?: Window;
  triggerRef?: React.MutableRefObject<any>;
};
