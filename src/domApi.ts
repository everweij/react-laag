export function safeWindow<A, B>(getter: (window: Window) => A, fallback: B) {
  if (typeof window === "undefined") {
    return fallback;
  }

  return getter(window);
}
