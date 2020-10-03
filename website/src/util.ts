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
