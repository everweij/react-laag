/**
 * Convert a pixel value into a numeric value
 * @param value string value (ie. '12px')
 */
export function getPixelValue(value: string) {
  return parseFloat(value.replace("px", ""));
}

/**
 * Returns a numeric value that doesn't exceed min or max
 */
export function limit(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

/**
 * Utility function which ensures whether a value is truthy
 */
export function isSet<T>(value: T | null | undefined): value is T {
  return value === null || value === undefined ? false : true;
}

/**
 * Utility function that let's you assign multiple references to a 'ref' prop
 * @param refs list of MutableRefObject's and / or callbacks
 */
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
