import {
  useRef,
  useMemo,
  useLayoutEffect,
  useEffect,
  MutableRefObject,
  useState,
  MouseEvent
} from "react";
import { IBounds } from "./Bounds";

/**
 * Utility hook to track the reference of a html-element.
 * It notifies the listener when a change occured, so it can act
 * on the change
 */
export function useTrackRef(
  onRefChange: (element: HTMLElement) => void
): (node: HTMLElement | null) => void {
  const storedReference = useRef<HTMLElement | null>(null);

  // this is de function that actually gets passed to the `ref` prop
  // on the html element. I.e.:
  // <div ref={setter} />
  function setter(element: HTMLElement | null) {
    if (!element || element === storedReference.current) {
      return;
    }

    storedReference.current = element;
    onRefChange(element);
  }

  return setter;
}

/**
 * Utility hook that stores mutable state.
 * Since a getter function is used, it will always return the most
 * up-to-date state. This is useful when you want to get certain state within
 * an effect, without triggering the same effect when the same state changes.
 * Note: may be seen as an anti-pattern.
 */
export function useMutableStore<State>(
  initialState: State
): readonly [
  () => State,
  {
    (setter: (state: State) => State): void;
    (setter: State): void;
  }
] {
  const state = useRef<State>(initialState);

  return useMemo(() => {
    function set(setter: (state: State) => State): void;
    function set(setter: State): void;
    function set(setter: any): void {
      if (typeof setter === "function") {
        state.current = setter(state.current);
      } else {
        state.current = setter;
      }
    }

    function get() {
      return state.current;
    }

    return [get, set] as const;
  }, []);
}

/**
 * Utility hook that keeps track of active event listeners and how
 * to remove these listeners
 */
export function useEventSubscriptions() {
  const subscriptions = useRef<Array<() => void>>([]);

  return useMemo(() => {
    function hasEventSubscriptions() {
      return subscriptions.current.length > 0;
    }

    function removeAllEventSubscriptions() {
      for (const unsubscribe of subscriptions.current!) {
        unsubscribe();
      }

      subscriptions.current = [];
    }

    function addEventSubscription(unsubscriber: () => void) {
      subscriptions.current.push(unsubscriber);
    }

    return {
      hasEventSubscriptions,
      removeAllEventSubscriptions,
      addEventSubscription
    };
  }, []);
}

/**
 * SSR-safe effect hook
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Utility hook that tracks an state object.
 * If `enabled=false` it will discard changes and reset the lastState to `null`
 */
export function useLastState<T extends unknown>(
  currentState: T,
  enabled: boolean
): MutableRefObject<T | null> {
  const lastState = useRef<T | null>(currentState);

  if (!enabled) {
    lastState.current = null;
    return lastState;
  }

  lastState.current = currentState;
  return lastState;
}

export type UseMousePositionAsTriggerOptions = {
  /**
   * @description Should the position be actively tracked?
   * @default true
   */
  enabled?: boolean;
  /**
   * @description Should `handleMouseEvent` preventDefault()?
   * @default true
   */
  preventDefault?: boolean;
};

export type UseMousePositionAsTriggerProps = {
  hasMousePosition: boolean;
  resetMousePosition: () => void;
  handleMouseEvent: (evt: MouseEvent) => void;
  trigger: {
    getBounds: () => IBounds;
    getParent?: () => HTMLElement;
  };
  parentRef: MutableRefObject<any>;
};

const EMPTY_BOUNDS: IBounds = {
  top: 0,
  left: 0,
  right: 1,
  bottom: 1,
  width: 1,
  height: 1
};

/**
 * @description Utility hook that lets you use the mouse-position as source of the trigger.
 * This is useful in scenario's like context-menu's.
 *
 * @example
 * ```tsx
 * const {
 *  hasMousePosition,
 *  resetMousePosition,
 *  handleMouseEvent,
 *  trigger
 *  } = useMousePositionAsTrigger();
 *
 * const { renderLayer, layerProps } = useLayer({
 *  isOpen: hasMousePosition,
 *  trigger,
 *  onOutsideClick: resetMousePosition
 * });
 *
 * return (
 *  <>
 *   {isOpen && renderLayer(<div {...layerProps} />)}
 *   <div onContextMenu={handleMouseEvent} />
 *  </>
 * );
 * ```
 */
export function useMousePositionAsTrigger({
  enabled = true,
  preventDefault = true
}: UseMousePositionAsTriggerOptions = {}): UseMousePositionAsTriggerProps {
  const parentRef = useRef<any>(null);

  const [mouseBounds, setMouseBounds] = useState<IBounds>(EMPTY_BOUNDS);

  function resetMousePosition() {
    setMouseBounds(EMPTY_BOUNDS);
  }

  const hasMousePosition = mouseBounds !== EMPTY_BOUNDS;

  function handleMouseEvent(evt: MouseEvent) {
    if (!enabled) {
      return;
    }

    if (preventDefault) {
      evt.preventDefault();
    }
    const { clientX: left, clientY: top } = evt;
    setMouseBounds({
      top,
      left,
      width: 1,
      height: 1,
      right: left + 1,
      bottom: top + 1
    });
  }

  return {
    hasMousePosition,
    resetMousePosition,
    handleMouseEvent,
    trigger: {
      getBounds: () => mouseBounds!,
      getParent: parentRef.current ? () => parentRef.current : undefined
    },
    parentRef
  };
}
