import { Bounds } from "../src/Bounds";
import { act } from "@testing-library/react";

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  style: Partial<CSSStyleDeclaration> = {},
  rest: Record<string, string> = {},
  children: HTMLElement[] = []
) {
  const element = document.createElement(tag);

  for (const [key, value] of Object.entries(style)) {
    (element as any).style[key] = value;
  }
  for (const [key, value] of Object.entries(rest)) {
    (element as any)[key] = value;
  }
  for (const child of children) {
    element.appendChild(child);
  }

  return element;
}

export function clearBody() {
  Array.from(document.body.children).forEach(child => {
    document.body.removeChild(child);
  });
}

export function boundsByDimensions(width: number, height: number) {
  return Bounds.create({
    left: 0,
    top: 0,
    right: width,
    bottom: height,
    width,
    height
  });
}

export function scroll(
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

export function mockFn() {
  let callCount = 0;
  let lastArgs: any = null;

  function mock() {
    callCount++;
    lastArgs = arguments;
  }

  mock.callCount = () => callCount;
  mock.lastArgs = () => lastArgs;
  return mock;
}
