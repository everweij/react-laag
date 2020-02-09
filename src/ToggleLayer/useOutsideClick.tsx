import React from "react";

import useEvent from "./useEvent";

export const OutsideClickContext = React.createContext({} as (
  layer: React.RefObject<HTMLElement | null | undefined>
) => void);

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

type OutsideClickGroupProviderProps = {
  refs: React.MutableRefObject<
    Set<React.RefObject<HTMLElement | null | undefined>>
  >;
  children: any;
};

export function OutsideClickGroupProvider({
  refs,
  children
}: OutsideClickGroupProviderProps) {
  const isPartOfGroup =
    typeof React.useContext(OutsideClickContext) === "function";

  if (isPartOfGroup) {
    return children;
  }

  return (
    <OutsideClickContext.Provider
      value={React.useCallback(layerRef => {
        refs.current.add(layerRef);
      }, [])}
    >
      {children}
    </OutsideClickContext.Provider>
  );
}

function useRegisterGroup(
  refs: React.MutableRefObject<
    Set<React.RefObject<HTMLElement | null | undefined>>
  >
) {
  const registerRefToGroup = React.useContext(OutsideClickContext);

  React.useEffect(() => {
    const [layerRef] = refs.current.values();

    if (typeof registerRefToGroup === "function" && layerRef) {
      registerRefToGroup(layerRef);
    }
  }, [registerRefToGroup, refs]);
}

function useOutsideClick(
  refs: React.MutableRefObject<
    Set<React.RefObject<HTMLElement | null | undefined>>
  >,
  callback: () => void
) {
  const [events] = React.useState(["click"]);

  useRegisterGroup(refs);

  useEvent(
    typeof document !== "undefined" ? document : null,
    events,
    React.useCallback(
      (evt: any) => {
        for (const ref of refs.current) {
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
