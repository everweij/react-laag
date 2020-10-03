import * as React from "react";

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

type Callback = () => void;

export type UseHoverProps = {
  onMouseEnter: Callback;
  onMouseLeave: Callback;
  onTouchStart: Callback;
  onTouchMove: Callback;
  onTouchEnd: Callback;
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
}: UseHoverOptions = {}): readonly [boolean, UseHoverProps] {
  const [show, setShow] = React.useState(false);

  const timeout = React.useRef<number | null>(null);

  const status = React.useRef<Status>(Status.IDLE);

  const hasTouchMoved = React.useRef<boolean>(false);

  const removeTimeout = React.useCallback(function removeTimeout() {
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

  function onMouseLeave() {
    // if was waiting for entering,
    // clear timeout
    if (status.current === Status.ENTERING && timeout.current) {
      removeTimeout();
    }

    if (!show) {
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
  React.useEffect(() => {
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

  return [show, hoverProps] as const;
}
