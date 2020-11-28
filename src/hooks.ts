import { useRef, useMemo, useLayoutEffect, useEffect } from "react";

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
 * Utility hook that tracks an state object and will tell you each render if the tracked state object
 * was changed in respect to the previous render.
 * If `enabled=false` it will discard changes
 */
export function useDidStateChange<T extends unknown>(
  currentState: T,
  enabled: boolean
): boolean {
  const lastState = useRef<T | null>(currentState);

  if (!enabled) {
    lastState.current = null;
    return false;
  }

  const didChange =
    lastState.current !== null && currentState !== lastState.current;
  lastState.current = currentState;
  return didChange;
}
