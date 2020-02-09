import { ResultingStyles } from "./types";

export const EMPTY_STYLE: React.CSSProperties = {};

export function isSet<T>(value: T) {
  return value !== undefined && value !== null;
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

export function shouldUpdateStyles(
  prev: ResultingStyles,
  next: ResultingStyles
) {
  if (
    areStylesTheSame(prev.layer, next.layer) &&
    areStylesTheSame(prev.arrow, next.arrow)
  ) {
    return false;
  }

  return true;
}

// creates a ClientRect-like object from the viewport's dimensions
export function getWindowClientRect(environment?: Window): ClientRect {
  return {
    top: 0,
    left: 0,
    right: environment ? environment.innerWidth : 0,
    bottom: environment ? environment.innerHeight : 0,
    height: environment ? environment.innerHeight : 0,
    width: environment ? environment.innerWidth : 0
  };
}

const convertFloat = (value: string) => parseFloat(value.replace("px", ""));

// get the outer width / height of an element
// We effectively want the same width / height that `getBoundingClientRect()`
// gives, minus optional `scale` transforms
export function getContentBox(element: HTMLElement, environment?: Window) {
  if (!environment) {
    return { width: 0, height: 0 };
  }

  const {
    width,
    height,
    boxSizing,
    borderLeft,
    borderRight,
    borderTop,
    borderBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom
  } = environment.getComputedStyle(element);

  return {
    width:
      boxSizing === "border-box"
        ? convertFloat(width!)
        : [width, borderLeft, borderRight, paddingLeft, paddingRight].reduce(
            (total, value) => total + (value ? convertFloat(value!) : 0),
            0
          ),
    height:
      boxSizing === "border-box"
        ? convertFloat(height!)
        : [height, borderTop, borderBottom, paddingTop, paddingBottom].reduce(
            (total, value) => total + (value ? convertFloat(value!) : 0),
            0
          )
  };
}

// converts a ClientRect (or DOMRect) to a plain js-object
// usefull for destructuring for instance
export function clientRectToObject(clientRect: ClientRect): ClientRect {
  return {
    top: clientRect.top,
    left: clientRect.left,
    right: clientRect.right,
    bottom: clientRect.bottom,
    width: clientRect.width,
    height: clientRect.height
  };
}

export function getElementFromAnchorNode(anchorNode: Node): HTMLElement | null {
  let currentElement = anchorNode as HTMLElement;

  while (!currentElement.getBoundingClientRect) {
    if (!currentElement.parentElement) {
      return null;
    }

    currentElement = currentElement.parentElement;
  }

  return currentElement;
}

export function minMax(
  value: number,
  { min, max }: { min: number; max: number }
): number {
  return value < min ? min : value > max ? max : value;
}
