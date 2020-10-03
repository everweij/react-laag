export type Offset = number;

export enum OffsetType {
  trigger,
  container,
  secondary,
  arrow
}

export type Offsets = Record<OffsetType, Offset>;

export type Bounds = {
  readonly top: number;
  readonly left: number;
  readonly right: number;
  readonly bottom: number;
  readonly width: number;
  readonly height: number;
};

export type MutableBounds = {
  -readonly [P in keyof Bounds]: Bounds[P];
};

export type CssSide = "top" | "left";

export enum BoundSide {
  top = "top",
  right = "right",
  left = "left",
  bottom = "bottom"
}

export type SubjectsBounds = {
  readonly TRIGGER: Bounds;
  readonly LAYER: Bounds;
  readonly PARENT: Bounds;
  readonly ARROW: Bounds;
  readonly SCROLL_CONTAINERS: Bounds[];
  readonly WINDOW: Bounds;
};

export enum Placement {
  "bottom-start",
  "bottom-end",
  "bottom-center",
  "top-start",
  "top-center",
  "top-end",
  "left-end",
  "left-center",
  "left-start",
  "right-end",
  "right-center",
  "right-start",
  "center"
}

export type PlacementKey = keyof typeof Placement;

export enum Side {
  left,
  right,
  top,
  bottom,
  center
}

export type LayerSide = keyof typeof Side;

export enum SizeProperty {
  width = "width",
  height = "height"
}

export enum Direction {
  VERTICAL,
  HORIZONTAL
}

export type Scroll = {
  readonly top: number;
  readonly left: number;
};

export type Borders = Scroll;

export type DisappearType = "partial" | "full";

export type RefCallback = (element: any) => void;

export declare type ResizeObserverCallback = (
  entries: any[],
  observer: ResizeObserver
) => void;
export interface ResizeObserver {
  observe(target: Element, options?: any): void;
  unobserve(target: Element): void;
  disconnect(): void;
}

export type ResizeObserverClass = {
  new (cb: ResizeObserverCallback): ResizeObserver;
};

export type LayerDimensions = (
  layerSide: keyof typeof Side
) => { width: number; height: number } | { width: number; height: number };

export type Options = {
  /**
   * signals whether the layer is open or closed
   */
  isOpen: boolean;
  /**
   * should the layer be contained within the closest scroll-container (false)
   * or is the layer allowed to overflow its closest scroll-container (true)?
   * default is `true`
   */
  overflowContainer?: boolean;
  /**
   * useful when working with iframes for instance, when things like
   * event-listeners should be attached to anonther context (environment)
   * default is `window`
   */
  environment?: Window;
  /**
   * let the use pass a polyfill when the browser does not support ResizeObserver
   * out of the box
   */
  ResizeObserver?: ResizeObserverClass;
  /**
   * preferred placement of the layer
   * default is `top-center`
   */
  placement?: PlacementKey;
  /**
   * in case of `auto=true` -> describes which placements are possible
   * default are all placements ("top-center", "bottom-left", ...etc)
   */
  possiblePlacements?: PlacementKey[];
  /**
   * when both left and right sides are available -> which one is preferred?
   * default is `"right"`
   */
  preferX?: "left" | "right";
  /**
   * when both top and bottom sides are available -> which one is preferred?
   * default is `"bottom"`
   */
  preferY?: "top" | "bottom";
  /**
   * should we switch automatically to a placement that is more visible
   * on the screen?
   * default is `false`
   */
  auto?: boolean;
  /**
   * should we gradually move between two placements (false)?
   * default is `false`
   */
  snap?: boolean;
  /**
   * distance in pixels between layer and trigger
   * default is `0`
   */
  triggerOffset?: number;
  /**
   * distance in pixels between layer and scroll-containers
   * default is `10`
   */
  containerOffset?: number;
  /**
   * minimal distance between arrow and edges of layer and trigger
   * default is `0`
   */
  arrowOffset?: number;
  /**
   * lets you anticipate on the dimensions of the layer. Usefull when the dimensions
   * of the layer differ per side, preventing an infinite loop of re-positioning
   *
   * Example:
   * ```tsx
   * layerDimenions={(layerSide) => ({ width: layerside === "top" ? 200 : 100: height: 50 })}
   * ```
   */
  layerDimensions?: LayerDimensions | null;
  /**
   * gets called when the layer or trigger partially or fully disappears from the screen
   * when the layer is open.
   *
   * If `overflowContainer` is set to true, it looks at the trigger element.
   * If `overflowContainer` is set to false, it looks at the layer element.
   *
   * Example:
   * ```tsx
   * onDisappear={type => type === "partial" && setOpen(false)}
   * ```
   */
  onDisappear?: (type: DisappearType) => void;
  /**
   * gets called when user clicks somewhere except the trigger or layer when the layer is open
   */
  onOutsideClick?: () => void;
  /**
   * Useful when working with nested layers. It is used by the parent layer to signal
   * child layers that their layers should close
   *
   * Example:
   * ```tsx
   * onParentClose={() => setOpen(false)}
   * ```
   */
  onParentClose?: () => void;
};

export type Styles = {
  readonly layer: React.CSSProperties;
  readonly arrow: React.CSSProperties;
};
