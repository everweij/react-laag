import { useCallback, useRef, useEffect } from "react";
import warning from "tiny-warning";
import { ResizeObserverClass, ScrollOffsets, BorderOffsets } from "./types";
import {
  useTrackRef,
  useMutableStore,
  useEventSubscriptions,
  useIsomorphicLayoutEffect
} from "./hooks";
import { getPixelValue } from "./util";
import { IBounds } from "./Bounds";

/**
 * Utility to get the correct ResizeObserver class
 */
export function getResizeObserver(
  environment: Window | undefined,
  polyfill: ResizeObserverClass | undefined
): ResizeObserverClass | undefined {
  if (typeof environment === "undefined") {
    return undefined;
  }

  return polyfill || (environment as any).ResizeObserver;
}

/**
 * Utility function that given a element traverses up in the html-hierarchy
 * to find and return all ancestors that have scroll behavior
 */
export function findScrollContainers(
  element: HTMLElement | null,
  environment?: Window
): HTMLElement[] {
  const result: HTMLElement[] = [];

  if (!element || !environment || element === document.body) {
    return result;
  }

  const { overflow, overflowX, overflowY } = environment.getComputedStyle(
    element
  );

  if (
    [overflow, overflowX, overflowY].some(prop =>
      ["auto", "scroll"].includes(prop)
    )
  ) {
    result.push(element);
  }

  return [
    ...result,
    ...findScrollContainers(element.parentElement, environment)
  ];
}

function createReferenceError(subject: string) {
  return `react-laag: Could not find a valid reference for the ${subject} element. There might be 2 causes:
   - Make sure that the 'ref' is set correctly on the ${subject} element when isOpen: true. Also make sure your component forwards the ref with "forwardRef()".
   - Make sure that you are actually rendering the ${subject} when the isOpen prop is set to true`;
}

export type OnChangeElements = {
  layer: HTMLElement;
  trigger: HTMLElement;
  arrow: HTMLElement | null;
  scrollContainers: HTMLElement[];
};

export type UseTrackElementsProps = {
  enabled: boolean;
  onChange: (
    elements: OnChangeElements,
    scrollOffsets: ScrollOffsets,
    borderOffsets: BorderOffsets
  ) => void;
  environment: Window | undefined;
  ResizeObserverPolyfill: ResizeObserverClass | undefined;
  overflowContainer: boolean;
  triggerOption?: {
    getBounds: () => IBounds;
    getParent?: () => HTMLElement;
  };
};

type UseTrackElementsReturnValue = {
  triggerRef: (element: HTMLElement | null) => void;
  layerRef: (element: HTMLElement | null) => void;
  arrowRef: React.MutableRefObject<HTMLElement | null>;
  closestScrollContainer: HTMLElement | null;
};

/**
 * This hook has the responsibility to track the bounds of:
 * - the trigger element
 * - the layer element
 * - the arrow element
 * - the scroll-containers of which the trigger element is a descendant of
 *
 * It will call the `onChange` callback with a collection of these elements when any
 * of the tracked elements bounds have changed
 *
 * It will detect these changes by listening:
 * - when the reference of the trigger element changes
 * - when the reference of the layer element changes
 * - when the trigger, layer or document body changes in size
 * - when the user scrolls the page, or any of the scroll containers
 */
export function useTrackElements({
  // should we track the bounds?
  enabled,
  // call this callback when the bounds have changed
  onChange,
  // optional environment (i.e. when using iframes)
  environment,
  // optionally inject a polyfill when the browser does not support it
  // out of the box
  ResizeObserverPolyfill,
  // behavior will alter slightly when `overflowContainer` is enabled
  overflowContainer,
  // the optional trigger-option provided by the user
  triggerOption
}: UseTrackElementsProps): UseTrackElementsReturnValue {
  // get the correct reference to the ResizeObserver class
  const ResizeObserver = getResizeObserver(environment, ResizeObserverPolyfill);

  // warn the user when no valid ResizeObserver class could be found
  useEffect(() => {
    warning(
      ResizeObserver,
      `This browser does not support ResizeObserver out of the box. We recommend to add a polyfill in order to utilize the full capabilities of react-laag. See: https://link`
    );
  }, [ResizeObserver]);

  // keep reference of the optional arrow-component
  const arrowRef = useRef<HTMLElement | null>(null);

  // if user has provided the trigger-option we should ingore certain things elsewhere
  const hasTriggerOption = Boolean(triggerOption);

  // Keep track of mutable element related state
  // It is generally better to use React.useState, but unfortunately that causes to many re-renders
  const [get, set] = useMutableStore<{
    scrollContainers: HTMLElement[];
    trigger: HTMLElement | null;
    layer: HTMLElement | null;
  }>({
    scrollContainers: [],
    trigger: null,
    layer: null
  });

  // utility to keep track of the scroll and resize listeners and how to unsubscribe them
  const {
    hasEventSubscriptions,
    addEventSubscription,
    removeAllEventSubscriptions
  } = useEventSubscriptions();

  // All scroll and resize changes eventually end up here, where the collection of bounds (subjectsBounds) is
  // constructed in order to notifiy the `onBoundsChange` callback
  const handleChange = useCallback(
    function handleChange() {
      const { layer, trigger, scrollContainers } = get();
      const closestScrollContainer = scrollContainers[0];

      if (!layer) {
        throw new Error(createReferenceError("layer"));
      }
      // ignore when user has provided the trigger-option
      if (!trigger && !hasTriggerOption) {
        throw new Error(createReferenceError("trigger"));
      }

      let scrollOffsets: ScrollOffsets = { top: 0, left: 0 };
      if (closestScrollContainer) {
        const { scrollLeft, scrollTop } = closestScrollContainer;
        scrollOffsets = {
          top: scrollTop,
          left: scrollLeft
        };
      }

      let borderOffsets: BorderOffsets = { left: 0, top: 0 };
      if (closestScrollContainer) {
        const {
          borderLeftWidth,
          borderTopWidth
        } = environment!.getComputedStyle(closestScrollContainer);

        borderOffsets = {
          left: getPixelValue(borderLeftWidth) || 0,
          top: getPixelValue(borderTopWidth) || 0
        };
      }

      onChange(
        {
          layer,
          trigger: trigger!,
          scrollContainers,
          arrow: arrowRef.current
        },
        scrollOffsets,
        borderOffsets
      );
    },
    [get, onChange, environment, arrowRef, hasTriggerOption]
  );

  // responsible for adding the scroll and resize listeners to the correct
  // html elements
  const addEventListeners = useCallback(
    function addEventListeners() {
      const { trigger, layer, scrollContainers } = get();

      if (!layer) {
        throw new Error(createReferenceError("layer"));
      }
      if (!trigger && !hasTriggerOption) {
        // ignore when user has provided the trigger-option
        throw new Error(createReferenceError("trigger"));
      }

      if (ResizeObserver) {
        let ignoredInitialCall = false;
        const observerCallback = () => {
          if (!ignoredInitialCall) {
            ignoredInitialCall = true;
            return;
          }

          handleChange();
        };

        const observer = new ResizeObserver(observerCallback);
        for (const element of [trigger, layer, document.body]) {
          if (element) observer.observe(element);
        }

        addEventSubscription(() => {
          for (const element of [trigger, layer, document.body]) {
            if (element) observer.unobserve(element);
          }
          observer.disconnect();
        });
      }

      const listenForScrollElements = [environment!, ...scrollContainers];
      for (const element of listenForScrollElements) {
        element.addEventListener("scroll", handleChange);

        addEventSubscription(() =>
          element.removeEventListener("scroll", handleChange)
        );
      }
    },
    [
      get,
      addEventSubscription,
      handleChange,
      environment,
      ResizeObserver,
      hasTriggerOption
    ]
  );

  // when either the reference to the trigger or layer element changes
  // we should reset the event listeners and trigger a `onChange`
  const resetWhenReferenceChangedWhileTracking = useCallback(
    (previous: HTMLElement | null, next: HTMLElement) => {
      if (enabled && previous && previous !== next) {
        removeAllEventSubscriptions();
        addEventListeners();
        handleChange();
      }
    },
    [removeAllEventSubscriptions, addEventListeners, handleChange, enabled]
  );

  // Logic when reference to layer changes
  const layerRef = useTrackRef(
    useCallback(
      layer => {
        const { layer: previousLayer } = get();

        // store new reference
        set(state => ({
          ...state,
          layer
        }));

        // check if we should reset the event listeners
        resetWhenReferenceChangedWhileTracking(previousLayer, layer);
      },
      [get, set, resetWhenReferenceChangedWhileTracking]
    )
  );

  const getScrollContainers = useCallback(
    function handleScrollContainers(element: HTMLElement) {
      const scrollContainers = findScrollContainers(element, environment);

      const closestScrollContainer = scrollContainers[0];

      if (closestScrollContainer) {
        // Check if we should warn the user about 'position: relative; stuff...'
        const position = environment!.getComputedStyle(closestScrollContainer)
          .position;

        const closestScrollContainerHasCorrectStyling =
          ["relative", "absolute", "fixed"].includes(position) ||
          overflowContainer;

        if (!closestScrollContainerHasCorrectStyling) {
          closestScrollContainer.style.position = "relative";
        }

        warning(
          closestScrollContainerHasCorrectStyling,
          `react-laag: Set the 'position' style of the nearest scroll-container to 'relative', 'absolute' or 'fixed', or set the 'overflowContainer' prop to true. This is needed in order to position the layer properly. Currently the scroll-container is positioned: "${position}". For now, "position: relative;" is added for you, but this behavior might be removed in the future. Visit https://react-laag.com/docs/#position-relative for more info.`
        );
      }
      return scrollContainers;
    },
    [environment, overflowContainer]
  );

  // Logic when reference to trigger changes
  // Note: this will have no effect when user provided the trigger-option
  const triggerRef = useTrackRef(
    useCallback(
      trigger => {
        // collect list of scroll containers
        const scrollContainers = getScrollContainers(trigger);

        const { trigger: previousTrigger } = get();

        // store new references
        set(state => ({
          ...state,
          trigger,
          scrollContainers
        }));

        // check if we should reset the event listeners
        resetWhenReferenceChangedWhileTracking(previousTrigger, trigger);
      },
      [get, set, resetWhenReferenceChangedWhileTracking, getScrollContainers]
    )
  );

  // when user has provided the trigger-option, it monitors the optional parent-element
  // in order to determine the scroll-containers
  const triggerOptionParent = triggerOption?.getParent?.();
  useIsomorphicLayoutEffect(() => {
    if (!triggerOptionParent) {
      return;
    }
    set(state => ({
      ...state,
      scrollContainers: getScrollContainers(triggerOptionParent)
    }));
  }, [triggerOptionParent, set, getScrollContainers]);

  useIsomorphicLayoutEffect(() => {
    if (enabled) {
      // add event listeners if necessary
      if (!hasEventSubscriptions()) {
        addEventListeners();
      }
    }

    return () => {
      if (hasEventSubscriptions()) {
        removeAllEventSubscriptions();
      }
    };
  }, [
    enabled,
    hasEventSubscriptions,
    addEventListeners,
    removeAllEventSubscriptions
  ]);

  // run this effect after every render
  useIsomorphicLayoutEffect(() => {
    if (enabled) {
      // eventually call `handleChange` with latest elements-refs
      handleChange();
    }
  });

  return {
    triggerRef,
    layerRef,
    arrowRef,
    closestScrollContainer: get().scrollContainers[0] || null
  };
}
