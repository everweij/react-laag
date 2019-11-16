import * as React from "react";

type UseHoverProps = {
  delayEnter?: number;
  delayLeave?: number;
  hideOnScroll?: boolean;
};

type TimeoutState = "entering" | "leaving" | null;

export default function useHover({
  delayEnter = 0,
  delayLeave = 0,
  hideOnScroll = true
}: UseHoverProps = {}) {
  const [show, setShow] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  const timeoutState = React.useRef<TimeoutState>(null);

  const hasTouchMoved = React.useRef<boolean>(false);

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

    function clear() {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    function onScroll() {
      if (show && hideOnScroll) {
        clear();
        setShow(false);
      }
    }

    function onTouchEnd() {
      if (show) {
        clear();
        setShow(false);
      }
    }

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("touchend", onTouchEnd, true);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("touchend", onTouchEnd, true);

      if (to) {
        clearTimeout(to);
      }
    };
  }, [show, hideOnScroll]);

  return [
    show,
    {
      onMouseEnter,
      onMouseLeave,
      onTouchStart: () => {
        hasTouchMoved.current = false;
      },
      onTouchMove: () => {
        hasTouchMoved.current = true;
      },
      onTouchEnd: () => {
        if (!hasTouchMoved.current && !show) {
          setShow(true);
        }

        hasTouchMoved.current = false;
      }
    }
  ] as const;
}
