export default function findFirstRelativeParent(
  element: HTMLElement | null
): HTMLElement | null {
  /* istanbul ignore if  */
  if (!element) {
    return null;
  }

  const elementPosition = window.getComputedStyle(element).position;

  if (elementPosition === "relative" || elementPosition === "absolute") {
    return element;
  }

  if (!element.parentElement) {
    return null;
  }

  return findFirstRelativeParent(element.parentElement);
}
