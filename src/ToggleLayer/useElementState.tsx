import { Container } from "./types";
import useElementRef from "./useElementRef";
import * as React from "react";
import findScrollContainers from "./findScrollContainers";

type UseElementState = {
  triggerElement: HTMLElement | null;
  relativeParentElement: HTMLElement | null;
  scrollParents: HTMLElement[];
};

export default function useElementState(
  container: Container | undefined,
  fixed: boolean | undefined,
  environment?: Window
) {
  return useElementRef<UseElementState>(
    { triggerElement: null, relativeParentElement: null, scrollParents: [] },
    React.useCallback((triggerElement: HTMLElement) => {
      const scrollParents = findScrollContainers(triggerElement, environment);

      const relativeParentElement = scrollParents[0] || document.body;

      if (relativeParentElement === document.body) {
        document.body.style.position = "relative";
      } else if (process.env.NODE_ENV === "development" && environment) {
        // Check if we should warn the user about 'position: relative; stuff...'
        const containerElement =
          typeof container === "function" ? container() : container;

        const position = environment.getComputedStyle(relativeParentElement)
          .position;
        const shouldWarnAboutPositionStyle =
          position !== "relative" &&
          position !== "absolute" &&
          position !== "fixed" &&
          !fixed &&
          !containerElement;

        if (shouldWarnAboutPositionStyle) {
          console.error(
            `react-laag: Set the 'position' style of the nearest scroll-container to 'relative', 'absolute' or 'fixed', or set the 'fixed' prop to true. This is needed in order to position the layers properly. Currently the scroll-container is positioned: "${position}". Visit https://react-laag.com/docs/#position-relative for more info.`,
            relativeParentElement
          );
        }
      }

      return {
        triggerElement,
        relativeParentElement,
        scrollParents
      };
    }, [])
  );
}
