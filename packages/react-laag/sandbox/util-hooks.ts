import * as React from "react";
import { constants } from "./constants";

export function useCenterScrollContainer(
  ref: React.MutableRefObject<HTMLDivElement>
) {
  React.useLayoutEffect(() => {
    const pos =
      constants.scrollContainerInnerSize / 2 -
      constants.scrollContainerSize / 2;
    ref.current.scrollTop = pos;
    ref.current.scrollLeft = pos;
  }, [ref]);
}

export function useTrackScrollContainerOffsets(
  ref: React.MutableRefObject<HTMLDivElement>
) {
  React.useEffect(() => {
    const element = ref.current;

    function handleScroll() {
      const offsetBox = document.getElementById("scroll-container-offsets");
      const [top, left] = offsetBox.querySelectorAll("span");
      top.innerText = String(element.scrollTop);
      left.innerText = String(element.scrollLeft);
    }

    element.addEventListener("scroll", handleScroll);

    return () => element.removeEventListener("scroll", handleScroll);
  }, [ref]);
}

export function useRenderCount() {
  const renderCountRef = React.useRef(0);
  renderCountRef.current++;

  return renderCountRef.current;
}
