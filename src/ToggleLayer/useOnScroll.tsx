import * as React from "react";

import useEvent from "./useEvent";

function useOnScroll(
  elements: HTMLElement[],
  onScroll: (event: Event) => void,
  environment?: Window,
  trackScroll = true
) {
  const memoElements = React.useMemo(
    () =>
      typeof environment !== "undefined" ? [environment, ...elements] : [],
    [elements]
  );
  useEvent(memoElements, "scroll", onScroll, trackScroll);
}

export default useOnScroll;
