import * as React from "react";
import warning from "tiny-warning";
import { ResizeObserverClass, SubjectsBounds, Scroll, Borders } from "./types";
import {
  clientRectToBounds,
  getWindowBounds,
  subtractScrollbars,
  createEmptyBounds,
  getBoundsWithoutTransform,
  getBorderOffsets
} from "./bounds";

import {
  findScrollContainers,
  getResizeObserver,
  useMutableState,
  useRefChange,
  useSubscriptions,
  useIsomorphicLayoutEffect
} from "./util";

type ElementState = {
  scrollContainers: HTMLElement[];
  triggerElement: HTMLElement | null;
  layerElement: HTMLElement | null;
};

export type UseTrackBoundsProps = {
  enabled: boolean;
  ignoreUpdate: boolean;
  onBoundsChange: (
    subjectsBounds: SubjectsBounds,
    scroll: Scroll,
    borders: Borders
  ) => void;
  environment: Window | undefined;
  ResizeObserverPolyfill: ResizeObserverClass | undefined;
  fixedMode: boolean;
};

type UseTrackBoundsReturnValue = {
  triggerRef: (element: HTMLElement | null) => void;
  layerRef: (element: HTMLElement | null) => void;
  arrowRef: React.MutableRefObject<HTMLElement | null>;
  closestScrollContainer: HTMLElement | null;
};

function createReferenceError(subject: string) {
  return `react-laag: Could not find a valid reference for the ${subject} element. There might be 2 causes:
   - Make sure that the 'ref' is set correctly on the ${subject} element when isOpen: true. Also make sure your component forwards the ref with "forwardRef()".
   - Make sure that you are actually rendering the ${subject} when the isOpen prop is set to true`;
}

/**
 * This hook has the responsibility to track the bounds of:
 * - the trigger element
 * - the layer element
 * - the arrow element
 * - the scroll-containers of which the trigger element is a descendant of
 *
 * It will call the `onBoundsChange` callback with a collection of these `Bounds` when any
 * of the tracks elements bounds have changed
 *
 * It will detect these changes by listening:
 * - when the reference of the trigger element changes
 * - when the reference of the layer element changes
 * - when the trigger, layer or document body changes in size
 * - when the user scrolls the page, or any of the scroll containers
 */
export function useTrackBounds({
  // should we track the bounds?
  enabled,
  // should we call the callback after render?
  ignoreUpdate,
  // call this callback when the bounds have changed
  onBoundsChange,
  // optional environment (i.e. when using iframes)
  environment,
  // optionally inject a polyfill when the browser does not support it
  // out of the box
  ResizeObserverPolyfill,
  // behavior will alter slightly when `fixedMode` is enabled
  fixedMode
}: UseTrackBoundsProps): UseTrackBoundsReturnValue {
  // get the correct reference to the ResizeObserver class
  const ResizeObserver = getResizeObserver(environment, ResizeObserverPolyfill);

  // warn the user when no valid ResizeObserver class could be found
  React.useEffect(() => {
    warning(
      ResizeObserver,
      `This browser does not support ResizeObserver out of the box. We recommend to add a polyfill in order to utilize the full capabilities of react-laag. See: https://link`
    );
  }, [ResizeObserver]);

  // keep reference of the optional arrow-component
  const arrowRef = React.useRef<HTMLElement | null>(null);

  // Keep track of mutable element related state
  // It is generally better to use React.useState, but unfortunately that causes to many re-renders
  const [getElementState, setElementState] = useMutableState<ElementState>({
    scrollContainers: [],
    triggerElement: null,
    layerElement: null
  });

  // utility to keep track of the scroll and resize listeners and how to unsubscribe them
  const {
    hasSubscriptions,
    addSubscription,
    removeAllSubscriptions
  } = useSubscriptions();

  // All scroll and resize changes eventually end up here, where the collection of bounds (subjectsBounds) is
  // constructed in order to notifiy the `onBoundsChange` callback
  const prepareOnBoundsChange = React.useCallback(
    function prepareOnBoundsChange() {
      const {
        layerElement,
        triggerElement,
        scrollContainers
      } = getElementState();
      const closestScrollContainer = scrollContainers[0] || document.body;

      if (!layerElement) {
        throw new Error(createReferenceError("layer"));
      }
      if (!triggerElement) {
        throw new Error(createReferenceError("trigger"));
      }
      const subjectsBounds: SubjectsBounds = {
        LAYER: getBoundsWithoutTransform(layerElement, environment!),
        TRIGGER: clientRectToBounds(triggerElement.getBoundingClientRect()),
        ARROW: arrowRef.current
          ? clientRectToBounds(arrowRef.current.getBoundingClientRect())
          : createEmptyBounds(),
        PARENT: clientRectToBounds(
          closestScrollContainer.getBoundingClientRect()
        ),
        WINDOW: getWindowBounds(environment),
        SCROLL_CONTAINERS: scrollContainers.map(container =>
          subtractScrollbars(
            clientRectToBounds(container.getBoundingClientRect()),
            container.clientWidth,
            container.clientHeight
          )
        )
      };

      const { scrollLeft, scrollTop } = closestScrollContainer;

      onBoundsChange(
        subjectsBounds,
        closestScrollContainer === document.body
          ? { top: 0, left: 0 }
          : {
              top: scrollTop,
              left: scrollLeft
            },
        getBorderOffsets(closestScrollContainer, environment!)
      );
    },
    [getElementState, onBoundsChange, environment, arrowRef]
  );

  // responsible for adding the scroll and resize listeners to the correct
  // html elements
  const addEventListeners = React.useCallback(
    function addEventListeners() {
      const {
        triggerElement,
        layerElement,
        scrollContainers
      } = getElementState();

      if (!layerElement) {
        throw new Error(createReferenceError("layer"));
      }
      if (!triggerElement) {
        throw new Error(createReferenceError("trigger"));
      }

      if (ResizeObserver) {
        let ignoredInitialCall = false;
        const observerCallback = () => {
          if (!ignoredInitialCall) {
            ignoredInitialCall = true;
            return;
          }
          prepareOnBoundsChange();
        };

        const observer = new ResizeObserver(observerCallback);
        for (const element of [triggerElement, layerElement, document.body]) {
          observer.observe(element);
        }

        addSubscription(() => {
          for (const element of [triggerElement, layerElement, document.body]) {
            observer.unobserve(element);
          }
          observer.disconnect();
        });
      }

      const listenForScrollElements = [environment!, ...scrollContainers];
      for (const element of listenForScrollElements) {
        element.addEventListener("scroll", prepareOnBoundsChange);

        addSubscription(() =>
          element.removeEventListener("scroll", prepareOnBoundsChange)
        );
      }
    },
    [
      getElementState,
      addSubscription,
      prepareOnBoundsChange,
      environment,
      ResizeObserver
    ]
  );

  // when either the reference to the trigger or layer element changes
  // we should reset the event listeners and trigger a `onBoundsChange`
  const resetWhenReferenceChangedWhileTracking = React.useCallback(
    (previous: HTMLElement | null, next: HTMLElement) => {
      if (enabled && previous && previous !== next) {
        removeAllSubscriptions();
        addEventListeners();
        prepareOnBoundsChange();
      }
    },
    [removeAllSubscriptions, addEventListeners, prepareOnBoundsChange, enabled]
  );

  // Logic when reference to layer changes
  const [layerRef] = useRefChange(
    React.useCallback(
      nextLayerElement => {
        const { layerElement: previousLayerElement } = getElementState();

        // store new reference
        setElementState(state => ({
          ...state,
          layerElement: nextLayerElement
        }));

        // check if we should reset the event listeners
        resetWhenReferenceChangedWhileTracking(
          previousLayerElement,
          nextLayerElement
        );
      },
      [getElementState, setElementState, resetWhenReferenceChangedWhileTracking]
    )
  );

  // Logic when reference to trigger changes
  const [triggerRef] = useRefChange(
    React.useCallback(
      nextTriggerElement => {
        // collect list of scroll containers
        const scrollContainers = findScrollContainers(
          nextTriggerElement,
          environment
        );

        const closestScrollContainer = scrollContainers[0] || document.body;

        if (closestScrollContainer === document.body) {
          // if the closestScrollContainer is the documents body
          // enforce that it's position is always 'relative'
          document.body.style.position = "relative";
        } else if (environment) {
          // Check if we should warn the user about 'position: relative; stuff...'
          const position = environment.getComputedStyle(closestScrollContainer)
            .position;

          const closestScrollContainerHasCorrectStyling =
            ["relative", "absolute", "fixed"].includes(position) || fixedMode;

          if (!closestScrollContainerHasCorrectStyling) {
            closestScrollContainer.style.position = "relative";
          }

          warning(
            closestScrollContainerHasCorrectStyling,
            `react-laag: Set the 'position' style of the nearest scroll-container to 'relative', 'absolute' or 'fixed', or set the 'overflowContainer' prop to true. This is needed in order to position the layer properly. Currently the scroll-container is positioned: "${position}". For now, "position: relative;" is added for you, but this behavior might be removed in the future. Visit https://react-laag.com/docs/#position-relative for more info.`
          );
        }

        const { triggerElement: previousTriggerElement } = getElementState();

        // store new references
        setElementState(state => ({
          ...state,
          triggerElement: nextTriggerElement,
          scrollContainers
        }));

        // check if we should reset the event listeners
        resetWhenReferenceChangedWhileTracking(
          previousTriggerElement,
          nextTriggerElement
        );
      },
      [
        getElementState,
        setElementState,
        fixedMode,
        environment,
        resetWhenReferenceChangedWhileTracking
      ]
    )
  );

  useIsomorphicLayoutEffect(() => {
    if (enabled) {
      // add event listeners if necessary
      if (!hasSubscriptions()) {
        addEventListeners();
      }
    }

    return () => {
      if (hasSubscriptions()) {
        removeAllSubscriptions();
      }
    };
  }, [
    enabled,
    hasSubscriptions,
    addEventListeners,
    removeAllSubscriptions,
    getElementState,
    setElementState
  ]);

  // run this effect after every render
  useIsomorphicLayoutEffect(() => {
    // eventually call `onBoundsChange` with updated bounds
    if (enabled && !ignoreUpdate) {
      prepareOnBoundsChange();
    }
  });

  return {
    triggerRef,
    layerRef,
    arrowRef,
    closestScrollContainer: getElementState().scrollContainers[0] || null
  };
}
