import * as React from "react";

function useOnScroll(
  elements: HTMLElement[],
  onScroll: (event: UIEvent) => void,
  trackScroll = true
) {
  React.useEffect(() => {
    if (!trackScroll) {
      return;
    }

    const handleScroll: any = onScroll;

    [...elements, window].forEach(el => {
      el.addEventListener("scroll", handleScroll);
    });

    return () => {
      [...elements, window].forEach(el => {
        el.removeEventListener("scroll", handleScroll);
      });
    };
  }, [onScroll, elements, trackScroll]);
}

export default useOnScroll;
