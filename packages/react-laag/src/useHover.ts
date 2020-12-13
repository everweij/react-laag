import { useState, useRef, useCallback, useEffect, MouseEvent } from "react";

export type UseHoverOptions = {
  /**
   * Amount of milliseconds to wait while hovering before opening.
   * Default is `0`
   */
  delayEnter?: number;
  /**
   * Amount of milliseconds to wait when mouse has left the trigger before closing.
   * Default is `0`
   */
  delayLeave?: number;
  /**
   * Determines whether the layer should hide when the user starts scrolling.
   * Default is `true`
   */
  hideOnScroll?: boolean;
};

export type PlainCallback = (...args: any[]) => void;

export type UseHoverProps = {
  onMouseEnter: PlainCallback;
  onMouseLeave: PlainCallback;
  onTouchStart: PlainCallback;
  onTouchMove: PlainCallback;
  onTouchEnd: PlainCallback;
};

enum Status {
  ENTERING,
  LEAVING,
  IDLE
}

export function useHover({
  delayEnter = 0,
  delayLeave = 0,
  hideOnScroll = true
}: UseHoverOptions = {}): readonly [boolean, UseHoverProps, () => void] {
  const [show, setShow] = useState(false);

  const timeout = useRef<number | null>(null);

  const status = useRef<Status>(Status.IDLE);

  const hasTouchMoved = useRef<boolean>(false);

  const removeTimeout = useCallback(function removeTimeout() {
    clearTimeout(timeout.current!);
    timeout.current = null;
    status.current = Status.IDLE;
  }, []);

  function onMouseEnter() {
    // if was leaving, stop leaving
    if (status.current === Status.LEAVING && timeout.current) {
      removeTimeout();
    }

    if (show) {
      return;
    }

    status.current = Status.ENTERING;
    timeout.current = setTimeout(() => {
      setShow(true);
      timeout.current = null;
      status.current = Status.IDLE;
    }, delayEnter);
  }

  function onMouseLeave(_: MouseEvent<any>, immediate?: boolean) {
    // if was waiting for entering,
    // clear timeout
    if (status.current === Status.ENTERING && timeout.current) {
      removeTimeout();
    }

    if (!show) {
      return;
    }

    if (immediate) {
      setShow(false);
      timeout.current = null;
      status.current = Status.IDLE;
      return;
    }

    status.current = Status.LEAVING;
    timeout.current = setTimeout(() => {
      setShow(false);
      timeout.current = null;
      status.current = Status.IDLE;
    }, delayLeave);
  }

  // make sure to clear timeout on unmount
  useEffect(() => {
    const currentTimeout = timeout.current;

    function onScroll() {
      if (show && hideOnScroll) {
        removeTimeout();
        setShow(false);
      }
    }

    function onTouchEnd() {
      if (show) {
        removeTimeout();
        setShow(false);
      }
    }

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("touchend", onTouchEnd, true);

    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("touchend", onTouchEnd, true);

      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
    };
  }, [show, hideOnScroll, removeTimeout]);

  const hoverProps: UseHoverProps = {
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
  };

  return [show, hoverProps, () => onMouseLeave(null!, true)] as const;
}
