import {
  useCallback,
  useState,
  useRef,
  createElement,
  ReactNode,
  ReactPortal,
  MutableRefObject,
  CSSProperties,
  useEffect
} from "react";
import { createPortal } from "react-dom";
import warning from "tiny-warning";
import {
  Options,
  LayerSide,
  Styles,
  ScrollOffsets,
  BorderOffsets,
  PositionConfig,
  RefCallback,
  Container
} from "./types";
import { useTrackElements, OnChangeElements } from "./useTrackElements";
import { useGroup, GroupProvider } from "./useGroup";
import { PlacementType, PLACEMENT_TYPES } from "./PlacementType";
import { Placements } from "./Placements";
import { SubjectsBounds } from "./SubjectsBounds";
import { useLastState } from "./hooks";
import { isSet, mergeRefs } from "./util";

let GLOBAL_CONTAINER: HTMLElement | null = null;

export function setGlobalContainer(container: Container) {
  if (typeof document === "undefined") {
    return;
  }

  warning(
    !(GLOBAL_CONTAINER instanceof HTMLElement),
    `react-laag: You've called 'setGlobalContainer() previously'. It is recommended to only set the global container once, otherwise this may lead to unexpected behaviour.`
  );

  if (typeof container === "function") {
    GLOBAL_CONTAINER = container();
  } else if (typeof container === "string") {
    GLOBAL_CONTAINER = document.getElementById(container);
  } else {
    GLOBAL_CONTAINER = container;
  }

  warning(
    GLOBAL_CONTAINER instanceof HTMLElement,
    `react-laag: You've called 'setGlobalContainer()', but it didn't result in a valid html-element`
  );
}

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
  snap: false,
  container: undefined!,
  trigger: undefined!
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
  container = DEFAULT_OPTIONS.container,
  layerDimensions = null,
  onDisappear,
  onOutsideClick,
  onParentClose,
  trigger: triggerOption
}: Options): UseLayerProps {
  // initialize styles
  const [state, setState] = useState<State>(() => ({
    layerSide:
      placement === "center"
        ? "center"
        : Placements.getSidesFromPlacementType(placement)[0].prop,
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

  // tracks state in order for us to use read inside functions that require dependencies,
  // like `useCallback`, without triggering an update
  const lastState = useLastState(state, isOpen);

  // keeps track of scheduled animation-frames
  const raf = useRef<any>(null);
  useEffect(() => {
    return () => {
      // when this hook unmounts, make sure to cancel any scheduled animation-frames
      if (raf.current) {
        cancelAnimationFrame(raf.current);
        raf.current = null;
      }
    };
  }, []);

  // Most important function regarding positioning
  // It receives boundaries collected by `useTrackElements`, does some calculations,
  // sets new styles, and handles when a layer has disappeared.
  const handlePositioning = useCallback(
    function handlePositioning(
      { arrow, layer, scrollContainers, trigger }: OnChangeElements,
      scrollOffsets: ScrollOffsets,
      borderOffsets: BorderOffsets
    ) {
      const parent = scrollContainers[0];

      const subjectsBounds = SubjectsBounds.create(
        environment!,
        layer,
        trigger,
        parent,
        arrow,
        scrollContainers,
        overflowContainer,
        triggerOption?.getBounds
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

      const newState: State = {
        layerSide,
        styles
      };

      if (!lastState.current || didStateChange(lastState.current, newState)) {
        lastState.current = newState; // optimistically update lastState to prevent infinite loop

        /**
         * We're using requestAnimationFrame-features here to ensure that position updates will
         * happen max once per frame.
         * If during a frame there's already an update scheduled, the existing update will be cancelled
         * and the new update will take precedence.
         */
        if (raf.current) {
          cancelAnimationFrame(raf.current);
        }

        raf.current = requestAnimationFrame(() => {
          setState(newState);
          raf.current = null;
        });
      }

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
      triggerOffset,
      lastState,
      triggerOption
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
    overflowContainer,
    onChange: handlePositioning,
    triggerOption
  });

  const { closeOnOutsideClickRefs, registrations } = useGroup({
    isOpen,
    onOutsideClick,
    onParentClose
  });

  const props: UseLayerProps = {
    triggerProps: Boolean(triggerOption)
      ? ({} as any) // when using the `trigger` option, make `triggerProps` useless
      : {
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
      ? triggerOption
        ? triggerOption.getBounds()
        : triggerBoundsRef.current?.getBoundingClientRect()
      : null,
    renderLayer: children =>
      typeof document !== "undefined"
        ? createPortal(
            createElement(GroupProvider, { registrations, children }),
            overflowContainer || !closestScrollContainer
              ? getContainerElement(container)
              : closestScrollContainer
          )
        : null
  };

  return props;
}

function didStateChange(previous: State, next: State): boolean {
  if (previous.layerSide !== next.layerSide) {
    return true;
  }

  const styleProps: Array<keyof CSSProperties> = [
    "position",
    "top",
    "left",
    "right",
    "bottom"
  ];
  for (const prop of styleProps) {
    if (
      previous.styles.layer[prop] !== next.styles.layer[prop] ||
      previous.styles.arrow[prop] !== next.styles.arrow[prop]
    ) {
      return true;
    }
  }

  return false;
}

const DEFAULT_CONTAINER_ID = "layers";

function getContainerElement(container?: Container): HTMLElement {
  let element: HTMLElement;

  if (typeof container === "function") {
    element = container();
    if (!element || !(element instanceof HTMLElement)) {
      throw new Error(
        `react-laag: You've passed a function to the 'container' prop, but it returned no valid HTMLElement`
      );
    }
  } else if (container instanceof HTMLElement) {
    element = container;
  } else if (typeof container === "string") {
    element = document.getElementById(container)!;
    if (!element) {
      throw new Error(
        `react-laag: You've passed element with id '${container}' to the 'container' prop, but it returned no valid HTMLElement`
      );
    }
  } else if (GLOBAL_CONTAINER instanceof HTMLElement) {
    return GLOBAL_CONTAINER;
  } else {
    element = document.getElementById(DEFAULT_CONTAINER_ID)!;
    if (!element) {
      element = document.createElement("div");
      element.id = DEFAULT_CONTAINER_ID;
      element.style.cssText = `
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
      `;
      document.body.appendChild(element);
    }
  }

  return element;
}
