import {
  useCallback,
  useState,
  useRef,
  createElement,
  ReactNode,
  ReactPortal,
  MutableRefObject
} from "react";
import { createPortal } from "react-dom";

import {
  Options,
  LayerSide,
  Styles,
  ScrollOffsets,
  BorderOffsets,
  PositionConfig,
  RefCallback
} from "./types";
import { useTrackElements, OnChangeElements } from "./useTrackElements";
import { useGroup, GroupProvider } from "./useGroup";
import { PlacementType, PLACEMENT_TYPES } from "./PlacementType";
import { Placements } from "./Placements";
import { SubjectsBounds } from "./SubjectsBounds";
import { useDidStateChange } from "./hooks";
import { isSet, mergeRefs } from "./util";

export type LayerProps = { ref: RefCallback; style: Styles["layer"] };
export type TriggerProps = { ref: RefCallback };
export type UseLayerArrowProps = {
  ref: MutableRefObject<any> | RefCallback;
  layerSide: LayerSide;
  style: Styles["arrow"];
};

export type UseLayerProps = {
  renderLayer: (children: ReactNode) => ReactPortal | null;
  triggerProps: TriggerProps;
  layerProps: LayerProps;
  arrowProps: UseLayerArrowProps;
  layerSide: LayerSide;
  triggerBounds: ClientRect | null;
};

type State = {
  layerSide: LayerSide;
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
  possiblePlacements: (PLACEMENT_TYPES as unknown) as PlacementType[],
  preferX: "right",
  preferY: "bottom",
  snap: false
};

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
  const [state, setState] = useState<State>(() => ({
    layerSide: Placements.getSidesFromPlacementType(placement)[0].prop,
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
  }));

  const triggerBoundsRef = useRef<HTMLElement>(null!);

  // check whether a re-render was caused by us updating the style
  // this prevents an infinite loop of updates
  const rerenderCausedByStyleUpdate = useDidStateChange(state, isOpen);

  // Most important function regarding positioning
  // It receives boundaries collected by `useTrackElements`, does some calculations,
  // sets new styles, and handles when a layer has disappeared.
  const handlePositioning = useCallback(
    function handlePositioning(
      { arrow, layer, scrollContainers, trigger }: OnChangeElements,
      scrollOffsets: ScrollOffsets,
      borderOffsets: BorderOffsets
    ) {
      const parent = scrollContainers[0] || document.body;

      const subjectsBounds = SubjectsBounds.create(
        environment!,
        layer,
        trigger,
        parent,
        arrow,
        scrollContainers,
        overflowContainer
      );

      const config: PositionConfig = {
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
        overflowContainer
      };

      const { hasDisappeared, layerSide, styles } = Placements.create(
        subjectsBounds,
        config
      ).result(scrollOffsets, borderOffsets);

      setState({
        layerSide,
        styles
      });

      if (isSet(hasDisappeared) && isSet(onDisappear)) {
        onDisappear(hasDisappeared);
      }
    },
    [
      arrowOffset,
      auto,
      containerOffset,
      environment,
      layerDimensions,
      onDisappear,
      overflowContainer,
      placement,
      possiblePlacements,
      preferX,
      preferY,
      snap,
      triggerOffset
    ]
  );

  const {
    triggerRef,
    layerRef,
    arrowRef,
    closestScrollContainer
  } = useTrackElements({
    ResizeObserverPolyfill,
    environment,
    enabled: isOpen,
    ignoreUpdate: rerenderCausedByStyleUpdate,
    overflowContainer,
    onChange: handlePositioning
  });

  const { closeOnOutsideClickRefs, registrations } = useGroup({
    isOpen,
    onOutsideClick,
    onParentClose
  });

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
      layerSide: state.layerSide
    },
    layerSide: state.layerSide,
    triggerBounds: isOpen
      ? triggerBoundsRef.current?.getBoundingClientRect()
      : null,
    renderLayer: children =>
      typeof document !== "undefined"
        ? createPortal(
            createElement(GroupProvider, { registrations, children }),

            overflowContainer || !closestScrollContainer
              ? document.body // @TODO -> mount this in a dedicated container
              : closestScrollContainer
          )
        : null
  };

  return props;
}
