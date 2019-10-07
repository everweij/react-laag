export default function findScrollContainers(
  element: HTMLElement
): HTMLElement[] {
  const result: HTMLElement[] = [];

  /* istanbul ignore if */
  if (!element.parentElement) {
    return result;
  }

  if (element === document.body) {
    return result;
  }

  const parent = element.parentElement;

  const { overflow, overflowX, overflowY } = window.getComputedStyle(parent);

  if (
    [overflow, overflowX, overflowY].some(
      prop => prop === "auto" || prop === "scroll"
    )
  ) {
    result.push(parent);
  }

  return [...result, ...findScrollContainers(parent)];
}
