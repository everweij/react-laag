import React from "react";

function isChildOf(parent: HTMLElement, target: HTMLElement) {
  if (parent === target) {
    return true;
  }

  const hasChildren = parent.children && parent.children.length > 0;

  if (hasChildren) {
    // tslint:disable-next-line
    for (let i = 0; i < parent.children.length; i++) {
      const child = parent.children[i];
      if (child && isChildOf(child as HTMLElement, target)) {
        return true;
      }
    }
  }

  return false;
}

function useOutsideClick(
  refs: Array<React.RefObject<HTMLElement | null | undefined>>,
  callback: () => void
) {
  React.useEffect(() => {
    function onClick(evt: any) {
      for (const ref of refs) {
        if (!ref.current) {
          continue;
        }

        if (isChildOf(ref.current, evt.target as HTMLElement)) {
          return;
        }
      }

      callback();
    }

    document.addEventListener("click", onClick);
    document.addEventListener("touchstart", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("touchstart", onClick);
    };
  });
}

export default useOutsideClick;
