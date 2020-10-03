import * as React from "react";
import { createPortal } from "react-dom";

import {
  Placement,
  RefCallback,
  SubjectsBounds,
  Options,
  Scroll,
  Side,
  LayerSide,
  Styles,
  Borders
} from "./types";
import { useTrackBounds } from "./useTrackBounds";
import { useGroup, GroupProvider } from "./useGroup";
import {
  useDidValueChange,
  shouldUpdateStyles,
  isSet,
  mergeRefs
} from "./util";
import { ALL_PLACEMENTS, getPlacementProperties } from "./placement";
import { position } from "./position";

export type UseLayerProps = {
  renderLayer: (children: React.ReactNode) => React.ReactPortal | null;
  triggerProps: { ref: RefCallback };
  layerProps: { ref: RefCallback; style: React.CSSProperties };
  arrowProps: {
    ref: React.MutableRefObject<any>;
    layerSide: LayerSide;
    style: React.CSSProperties;
  };
  layerSide: LayerSide;
  triggerBounds: ClientRect | null;
};

type State = {
  layerSide: Side;
  styles: Styles;
};

export const DEFAULT_OPTIONS: Required<Omit<
  Options,
  | "ResizeObserver"
  | "environment"
  | "onParentClose"
  | "onOutsideClick"
  | "onDisappear"
  | "isOpen"
  | "layerDimensions"
>> = {
  auto: false,
  arrowOffset: 0,
  containerOffset: 10,
  triggerOffset: 0,
  overflowContainer: true,
  placement: "top-center",
  possiblePlacements: ALL_PLACEMENTS,
  preferX: "right",
  preferY: "bottom",
  snap: false
};

/**
 * TODO:
 * - Cross-browser testing
 * - create and add es5 build to rollup
 */

export function useLayer({
  isOpen = false,
  overflowContainer = DEFAULT_OPTIONS.overflowContainer,
  environment = typeof window !== "undefined" ? window : undefined,
  ResizeObserver: ResizeObserverPolyfill,
  placement = DEFAULT_OPTIONS.placement,
  possiblePlacements = DEFAULT_OPTIONS.possiblePlacements,
  preferX = DEFAULT_OPTIONS.preferX,
  preferY = DEFAULT_OPTIONS.preferY,
  auto = DEFAULT_OPTIONS.auto,
  snap = DEFAULT_OPTIONS.snap,
  triggerOffset = DEFAULT_OPTIONS.triggerOffset,
  containerOffset = DEFAULT_OPTIONS.containerOffset,
  arrowOffset = DEFAULT_OPTIONS.arrowOffset,
  layerDimensions = null,
  onDisappear,
  onOutsideClick,
  onParentClose
}: Options): UseLayerProps {
  // initialize styles
  const [state, setState] = React.useState<State>({
    layerSide: getPlacementProperties(Placement[placement]).primary,
    styles: {
      layer: {
        position: overflowContainer ? "fixed" : "absolute",
        top: 0,
        left: 0
      },
      arrow: {
        position: "absolute",
        top: 0,
        left: 0
      }
    }
  });

  const triggerBoundsRef = React.useRef<HTMLElement>(null!);

  // check whether a re-render was caused by us updating the style
  // this prevents an infinite loop of updates
  const [rerenderCausedByStyleUpdate, lastState] = useDidValueChange(
    state,
    !isOpen
  );

  // Most important function regarding positioning
  // It receives boundaries collected by `useTrackBounds`, does some calculations,
  // sets new styles when needed, and handles when a layer has disappeared.
  const handlePositionChange = React.useCallback(
    function handlePositionChange(
      subjectsBounds: SubjectsBounds,
      scroll: Scroll,
      borders: Borders
    ) {
      const { styles, layerSide, hasDisappeared } = position({
        placement,
        possiblePlacements,
        auto,
        layerDimensions,
        arrowOffset,
        containerOffset,
        triggerOffset,
        preferX,
        preferY,
        snap,
        subjectsBounds,
        overflowContainer,
        scroll,
        borders
      });

      // only update when styles have actually changed
      if (shouldUpdateStyles(lastState.current?.styles ?? null, styles)) {
        setState({
          layerSide,
          styles
        });
      }

      if (isSet(hasDisappeared) && isSet(onDisappear)) {
        onDisappear(hasDisappeared);
      }
    },
    [
      placement,
      possiblePlacements,
      auto,
      layerDimensions,
      arrowOffset,
      containerOffset,
      triggerOffset,
      preferX,
      preferY,
      snap,
      overflowContainer,
      lastState,
      onDisappear
    ]
  );

  const {
    triggerRef,
    layerRef,
    arrowRef,
    closestScrollContainer
  } = useTrackBounds({
    ResizeObserverPolyfill,
    environment,
    enabled: isOpen,
    ignoreUpdate: rerenderCausedByStyleUpdate,
    fixedMode: overflowContainer,
    onBoundsChange: handlePositionChange
  });

  const { closeOnOutsideClickRefs, registrations } = useGroup({
    isOpen,
    onOutsideClick,
    onParentClose
  });

  const layerSide = Side[state.layerSide] as LayerSide;

  const props: UseLayerProps = {
    triggerProps: {
      ref: mergeRefs(
        triggerRef,
        closeOnOutsideClickRefs.trigger,
        triggerBoundsRef
      )
    },
    layerProps: {
      ref: mergeRefs(layerRef, closeOnOutsideClickRefs.layer),
      style: state.styles.layer
    },
    arrowProps: {
      ref: arrowRef,
      style: state.styles.arrow,
      layerSide
    },
    layerSide,
    triggerBounds:
      isOpen && triggerBoundsRef.current
        ? triggerBoundsRef.current.getBoundingClientRect()
        : null,
    renderLayer: children =>
      typeof document !== "undefined"
        ? createPortal(
            <GroupProvider registrations={registrations}>
              {children}
            </GroupProvider>,
            overflowContainer || !closestScrollContainer
              ? document.body
              : closestScrollContainer
          )
        : null
  };

  return props;
}
