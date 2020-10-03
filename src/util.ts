import * as React from "react";
import { ResizeObserverClass, Styles } from "./types";

export function limit(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

export function mergeRefs(...refs: any[]) {
  return (element: HTMLElement | null) => {
    for (const ref of refs) {
      if (!ref) {
        continue;
      }

      if (typeof ref === "function") {
        ref(element);
      } else {
        ref.current = element!;
      }
    }
  };
}

export function isSet<T>(value: T | null | undefined): value is T {
  return value === null || value === undefined ? false : true;
}

export function getPixelValue(value: string) {
  return parseFloat(value.replace("px", ""));
}

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
 * Utility hook to track the reference of a html-element.
 * It notifies the listener when a change occured, so it can act
 * on the change
 */
export function useRefChange(
  onRefChange: (element: HTMLElement) => void
): readonly [
  (node: HTMLElement | null) => void,
  React.MutableRefObject<HTMLElement | null>
] {
  const storedReference = React.useRef<HTMLElement | null>(null);

  // this is de function that actually gets passed to the `ref` prop
  // on the html element. I.e.:
  // <div ref={setter} />
  function setter(node: HTMLElement | null) {
    if (!node || node === storedReference.current) {
      return;
    }

    storedReference.current = node;
    onRefChange(node);
  }

  return [setter, storedReference] as const;
}

/**
 * Utility hook that stores mutable state.
 * Since a getter function is used, it will always return the most
 * up-to-date state. This is useful when you want to get certain state within
 * an effect, without triggering the same effect when the same state changes.
 * Note: may be seen as an anti-pattern.
 */
export function useMutableState<State>(
  initialState: State
): readonly [
  () => State,
  {
    (setter: (state: State) => State): void;
    (setter: State): void;
  }
] {
  const state = React.useRef<State>(initialState);

  return React.useMemo(() => {
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

type Subscription = () => void;

// Utility hook that keeps track of active event listeners and how
// to remove this listener
export function useSubscriptions() {
  const subscriptions = React.useRef<Subscription[] | null>(null);

  return React.useMemo(() => {
    function hasSubscriptions() {
      return subscriptions.current !== null;
    }

    function removeAllSubscriptions() {
      if (hasSubscriptions()) {
        for (const unsubscribe of subscriptions.current!) {
          unsubscribe();
        }

        subscriptions.current = null;
      }
    }

    function addSubscription(unsubscriber: Subscription) {
      if (subscriptions.current === null) {
        subscriptions.current = [];
      }

      subscriptions.current.push(unsubscriber);
    }

    return {
      hasSubscriptions,
      removeAllSubscriptions,
      addSubscription
    };
  }, [subscriptions]);
}

export function useDidValueChange<T extends unknown>(value: T, reset: boolean) {
  const lastValue = React.useRef<T | null>(value);

  if (reset) {
    lastValue.current = null;
    return [false, lastValue] as const;
  }

  const didChange = lastValue.current !== null && value !== lastValue.current;
  lastValue.current = value;
  return [didChange, lastValue] as const;
}

function areStylesTheSame(a: React.CSSProperties, b: React.CSSProperties) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (let i = 0; i < Math.max(aKeys.length, bKeys.length); i++) {
    const key: keyof React.CSSProperties = aKeys[i] || (bKeys[i] as any);

    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}

export function shouldUpdateStyles(prev: Styles | null, next: Styles) {
  if (!prev) {
    return true;
  }

  if (
    areStylesTheSame(prev.layer, next.layer) &&
    areStylesTheSame(prev.arrow, next.arrow)
  ) {
    return false;
  }

  return true;
}

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;
