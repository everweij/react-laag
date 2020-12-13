import { SideProp } from "./Sides";
import { PlacementType } from "./PlacementType";
import { IBounds } from "./Bounds";

export type PositionConfig = Required<
  Pick<
    Options,
    | "placement"
    | "snap"
    | "auto"
    | "layerDimensions"
    | "arrowOffset"
    | "containerOffset"
    | "triggerOffset"
    | "possiblePlacements"
    | "preferX"
    | "preferY"
    | "overflowContainer"
  >
>;

export interface Offsets {
  readonly trigger: number;
  readonly container: number;
  readonly arrow: number;
}

export interface ScrollOffsets {
  left: number;
  top: number;
}

export interface BorderOffsets extends ScrollOffsets {}

export type DisappearType = "partial" | "full";

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

export type LayerSide = SideProp;

export type LayerDimensions = (
  layerSide: LayerSide
) => { width: number; height: number } | { width: number; height: number };

export type Options = {
  /**
   * @description signals whether the layer is open or closed
   */
  isOpen: boolean;
  /**
   * @description should the layer be contained within the closest scroll-container (false)
   * or is the layer allowed to overflow its closest scroll-container (true)?
   * @default true
   */
  overflowContainer?: boolean;
  /**
   * @description useful when working with iframes for instance, when things like
   * event-listeners should be attached to anonther context (environment)
   * default is `window`
   */
  environment?: Window;
  /**
   * @description let the use pass a polyfill when the browser does not support ResizeObserver
   * out of the box
   */
  ResizeObserver?: ResizeObserverClass;
  /**
   * @description preferred placement of the layer
   * @default "top-center"
   */
  placement?: PlacementType;
  /**
   * @description in case of `auto=true` -> describes which placements are possible.
   * default are all placements ("top-center", "bottom-left", ...etc)
   * @default allPlacements
   */
  possiblePlacements?: PlacementType[];
  /**
   * @description when both left and right sides are available -> which one is preferred?
   * @default "right"
   */
  preferX?: "left" | "right";
  /**
   * @description when both top and bottom sides are available -> which one is preferred?
   * @default "bottom"
   */
  preferY?: "top" | "bottom";
  /**
   * @description should we switch automatically to a placement that is more visible
   * on the screen?
   * @default false
   */
  auto?: boolean;
  /**
   * @description should we gradually move between two placements (false)?
   * @default false
   */
  snap?: boolean;
  /**
   * @description distance in pixels between layer and trigger
   * @default 0
   */
  triggerOffset?: number;
  /**
   * @description distance in pixels between layer and scroll-containers
   * @default 10
   */
  containerOffset?: number;
  /**
   * @description minimal distance between arrow and edges of layer and trigger
   * @default 0
   */
  arrowOffset?: number;
  /**
   * @description lets you anticipate on the dimensions of the layer. Usefull when the dimensions
   * of the layer differ per side, preventing an infinite loop of re-positioning
   * @default null
   *
   * @example
   * ```tsx
   * const layerDimenions = (layerSide) => ({
   *    width: layerside === "top" ? 200 : 100:
   *    height: 50
   * });
   * ```
   */
  layerDimensions?: LayerDimensions | null;
  /**
   * @description gets called when the layer or trigger partially or fully disappears from the screen
   * when the layer is open.
   *
   * If `overflowContainer` is set to true, it looks at the trigger element.
   * If `overflowContainer` is set to false, it looks at the layer element.
   *
   * @default null
   *
   * @example
   * ```tsx
   * const onDisappear = (type) =>
   *    type === "partial" && setOpen(false);
   * ```
   */
  onDisappear?: (type: DisappearType) => void;
  /**
   * @description gets called when user clicks somewhere except the trigger or layer when the layer is open
   * @default undefined
   */
  onOutsideClick?: () => void;
  /**
   * @description Useful when working with nested layers. It is used by the parent layer to signal
   * child layers that their layers should close
   *
   * @default undefined
   *
   * @example
   * ```tsx
   * const onParentClose = () => setOpen(false);
   * ```
   */
  onParentClose?: () => void;
  /**
   * @description (optional) Specify in which container (html-element) the layers should mount into
   * when `overflowContainer` is set to true or when there's no scroll-container found.
   * By default, in such cases the layers are mounted into a generated div#layers which gets attached
   * to the body of the document.
   * This prop accepts various values. When an string is passed, it is interpreted as the id of an element.
   *
   * @example
   * ```tsx
   * const container = 'my-layer-container'; // interpreted as element-id
   * const container = document.getElementById('my-layer-container');
   * const container = () => document.getElementById('my-layer-container');
   * ```
   */
  container?: string | HTMLElement | (() => HTMLElement);
  /**
   * @description This prop let's you specify information about the trigger you don't know beforehand.
   * This is typically for situations like context-clicks (right-mouse-clicks) and text-selection.
   * By using this prop the returning `triggerProps` of this hook will have no effect.
   */
  trigger?: {
    /**
     * @description A callback function that returns the bounds of the trigger.
     *
     * @example
     * ```tsx
     * const getBounds = () => myTextRange.getBoundingClientRect();
     * ```
     */
    getBounds: () => IBounds;
    /**
     * @description A callback function that returns the parent element.
     * This is optional but may be needed in cases where you'll want to prevent overflow
     * of the layer. In other words, if you use the default option `overflowContainer=true`, this
     * callback will have no effect. The returning element is used to position the layer relatively
     * and to register event-listeners.
     *
     * @example
     * ```tsx
     * const parentRef = React.useRef();
     * const getParent = () => parentRef.current;
     * ```
     */
    getParent?: () => HTMLElement;
  };
};

export type Container = string | HTMLElement | (() => HTMLElement);

export type Styles = {
  readonly layer: React.CSSProperties;
  readonly arrow: React.CSSProperties;
};

export type RefCallback = (element: any) => void;
