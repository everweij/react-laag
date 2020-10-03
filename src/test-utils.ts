import { act } from "@testing-library/react";

export async function scroll(
  element: HTMLElement,
  options: { top?: number; left?: number }
) {
  act(() => {
    if (options.top) {
      element.scrollTop = options.top;
    }
    if (options.left) {
      element.scrollLeft = options.left;
    }
  });
}

export function createSpy() {
  let callCount = 0;
  let lastArgs: any = null;

  function spy() {
    callCount++;
    lastArgs = arguments;
  }

  spy.callCount = () => callCount;
  spy.lastArgs = () => lastArgs;
  return spy;
}
