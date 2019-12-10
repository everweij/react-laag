export default function findScrollContainers(
  element: HTMLElement | null,
  environment?: Window
): HTMLElement[] {
  const result: HTMLElement[] = [];

  if (!element || !environment) {
    return result;
  }

  if (element === document.body) {
    return result;
  }

  const { overflow, overflowX, overflowY } = environment.getComputedStyle(
    element
  );

  if (
    [overflow, overflowX, overflowY].some(
      prop => prop === "auto" || prop === "scroll"
    )
  ) {
    result.push(element);
  }

  return [
    ...result,
    ...findScrollContainers(element.parentElement, environment)
  ];
}
