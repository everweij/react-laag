import * as React from "react";

import useEvent from "./useEvent";

function useOnScroll(
  elements: HTMLElement[],
  onScroll: (event: Event) => void,
  trackScroll = true
) {
  const memoElements = React.useMemo(
    () => (typeof window !== "undefined" ? [window, ...elements] : []),
    [elements]
  );
  useEvent(memoElements, "scroll", onScroll, trackScroll);
}

export default useOnScroll;
