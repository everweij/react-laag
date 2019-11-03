import * as React from "react";

type UseHoverProps = {
  delayEnter?: number;
  delayLeave?: number;
};

type TimeoutState = "entering" | "leaving" | null;

export default function useHover({
  delayEnter = 0,
  delayLeave = 0
}: UseHoverProps = {}) {
  const [show, setShow] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  const timeoutState = React.useRef<TimeoutState>(null);

  function onMouseEnter() {
    // if was leaving, stop leaving
    if (timeoutState.current === "leaving" && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      timeoutState.current = null;
    }

    if (show) {
      return;
    }

    timeoutState.current = "entering";
    timeoutRef.current = setTimeout(() => {
      setShow(true);
      timeoutRef.current = null;
      timeoutState.current = null;
    }, delayEnter) as any;
  }

  function onMouseLeave() {
    // if was waiting for entering,
    // clear timeout
    if (timeoutState.current === "entering" && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!show) {
      return;
    }

    timeoutState.current = "leaving";
    timeoutRef.current = setTimeout(() => {
      setShow(false);
      timeoutRef.current = null;
    }, delayLeave) as any;
  }

  // make sure to clear timeout on unmount
  React.useEffect(() => {
    const to = timeoutRef.current;

    function onScroll() {
      if (show) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setShow(false);
      }
    }

    window.addEventListener("scroll", onScroll, true);

    return () => {
      window.removeEventListener("scroll", onScroll);

      if (to) {
        clearTimeout(to);
      }
    };
  }, [show]);

  return [
    show,
    {
      onMouseEnter,
      onMouseLeave
    }
  ] as [boolean, { onMouseEnter: () => void; onMouseLeave: () => void }];
}
