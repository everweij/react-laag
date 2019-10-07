import { ResultingStyles } from "./ToggleLayer";

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

export function getWindowClientRect(): ClientRect {
  return {
    top: 0,
    left: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
    height: window.innerHeight,
    width: window.innerWidth
  };
}
