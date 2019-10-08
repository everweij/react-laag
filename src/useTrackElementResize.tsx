import * as React from "react";
import { safeWindow } from "./domApi";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";

export default function useTrackElementResize(
  injectedResizeObserver: any,
  layerRef: React.RefObject<HTMLElement>,
  triggerElement: HTMLElement | null,
  isOpen: boolean,
  callback: () => void
) {
  const callbackRef = React.useRef(callback);
  callbackRef.current = callback;

  const ResizeObserver =
    injectedResizeObserver ||
    safeWindow((window: any) => window.ResizeObserver, class ResizeObserver {});

  if (!ResizeObserver) {
    throw new Error(
      "This browser does not support `ResizeObserver` out of the box. Please provide a polyfill as a prop."
    );
  }

  const resizeObserver = React.useRef(
    new ResizeObserver(() => {
      if (layerRef.current) {
        callbackRef.current();
      }
    })
  );

  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      if (triggerElement) {
        resizeObserver.current.observe(triggerElement);
      }
    } else {
      if (triggerElement) {
        resizeObserver.current.unobserve(triggerElement);
      }
      if (layerRef.current) {
        resizeObserver.current.unobserve(layerRef.current);
      }
    }
  }, [isOpen, triggerElement]);

  React.useEffect(() => {
    return () => {
      resizeObserver.current.disconnect();
    };
  }, []);

  return resizeObserver.current;
}
