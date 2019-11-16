import React from "react";

import useEvent from "./useEvent";

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
  const [events] = React.useState(["click"]);

  useEvent(
    typeof document !== "undefined" ? document : null,
    events,
    React.useCallback(
      (evt: any) => {
        for (const ref of refs) {
          if (!ref.current) {
            continue;
          }

          if (isChildOf(ref.current, evt.target as HTMLElement)) {
            return;
          }
        }

        callback();
      },
      [callback]
    ),
    true,

    true
  );
}

export default useOutsideClick;
