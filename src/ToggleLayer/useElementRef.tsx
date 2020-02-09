import * as React from "react";

/**
 * Tracks an element and keeps it in state
 * (together with other relevant state that depends on the element)
 */
function useElementRef<T = HTMLElement | null>(
  initialState?: T,
  elementToState?: (element: HTMLElement) => T
) {
  const [state, setState] = React.useState<T | null>(initialState || null);

  const lastElement = React.useRef<HTMLElement | null>(null);

  const setRef = React.useCallback(node => {
    if (node && node !== lastElement.current) {
      lastElement.current = node;
      if (elementToState) {
        setState(elementToState(node));
      } else {
        setState(node);
      }
    }
  }, []);

  return [setRef, state, lastElement] as [
    any,
    T,
    React.MutableRefObject<HTMLElement | null>
  ];
}

export default useElementRef;
