import * as React from "react";
import { createPortal } from "react-dom";

import { RenderLayer, ToggleLayerOptions, LayerSide } from "./types";
import {
  isSet,
  shouldUpdateStyles,
  getWindowClientRect,
  EMPTY_STYLE,
  getElementFromAnchorNode
} from "./util";
import {
  doesEntireLayerFitWithinScrollParents,
  isLayerCompletelyInvisible
} from "./rect";
import getPositioning, { defaultPlacement } from "./getPositioning";

import useElementState from "./useElementState";
import useStyleState from "./useStyleState";
import useTrackElementResize from "./useTrackElementResize";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";
import useOnWindowResize from "./useOnWindowResize";
import useOnScroll from "./useOnScroll";
import useOutsideClick from "./useOutsideClick";

type OpenProps = {
  clientRect: ClientRect | (() => ClientRect);
  target: HTMLElement;
};

type UseToggleLayerPayload = {
  open: (props: OpenProps) => void;
  openFromContextMenuEvent: (event: React.MouseEvent<any, MouseEvent>) => void;
  openFromMouseEvent: (event: React.MouseEvent<any, MouseEvent>) => void;
  openFromSelection: (selection: Selection) => void;
  close: () => void;
  isOpen: boolean;
  layerSide: LayerSide | null;
};

export default function useToggleLayer(
  renderLayer: RenderLayer,
  {
    onStyle,
    closeOnOutsideClick,
    closeOnDisappear,
    fixed,
    container,
    placement = {},
    environment = typeof window !== "undefined" ? window : undefined,
    ...props
  }: ToggleLayerOptions = {}
) {
  /**
   * Tracks trigger element and keeps it in state together with it's
   * relative/absolute positioned parent
   */
  const [
    setTargetRef,
    { relativeParentElement, triggerElement: targetElement, scrollParents }
  ] = useElementState(container, fixed, environment);

  const { styles, setStyles, lastStyles, resetLastStyles } = useStyleState(
    placement.anchor || defaultPlacement.anchor
  );

  const layerRef = React.useRef<HTMLElement | null>(null);
  const triggerRectRef = React.useRef<ClientRect | (() => ClientRect) | null>(
    null
  );

  function getTriggerRect() {
    return typeof triggerRectRef.current! === "function"
      ? triggerRectRef.current()
      : triggerRectRef.current!;
  }

  const [isOpen, setOpen] = React.useState(false);

  function close() {
    triggerRectRef.current = null;
    setOpen(false);
  }

  const handlePositioning = React.useCallback(() => {
    const triggerRect = getTriggerRect();

    if (!triggerRect) {
      return;
    }

    const result = getPositioning({
      triggerRect,
      layerElement: layerRef.current,
      placement,
      relativeParentElement,
      scrollParents,
      fixed,
      environment
    });

    if (!result) {
      return;
    }

    const { layerRect, styles } = result;

    // only update styles when necessary
    if (shouldUpdateStyles(lastStyles.current, styles)) {
      // is parent in control of styles? (onStyle)
      if (isSet(onStyle)) {
        lastStyles.current = styles;
        onStyle!(styles.layer, styles.arrow, styles.layerSide);
      }
      // ... otherwise set styles internally
      else {
        setStyles(styles);
      }
    }

    /**
     * B.
     * Manage disappearance
     */

    // Should we respond to the layer's partial or full disappearance?
    // (trigger's disappearance when `fixed` props is set)
    if (closeOnDisappear) {
      const allScrollParents = [
        ...scrollParents.map(parent => parent.getBoundingClientRect()),
        getWindowClientRect(environment)
      ];

      const partial = !doesEntireLayerFitWithinScrollParents(
        fixed ? triggerRect : layerRect,
        allScrollParents
      );
      const full = isLayerCompletelyInvisible(
        fixed ? triggerRect : layerRect,
        allScrollParents
      );

      if (closeOnDisappear === "partial" && partial) {
        close();
      }
      if (closeOnDisappear === "full" && full) {
        close();
      }
    }
  }, [
    relativeParentElement,
    isOpen,
    targetElement,
    scrollParents,
    fixed,
    placement
  ]);

  // call `handlePositioning` when the layer's / targets's
  // height and / or width changes
  const resizeObserver = useTrackElementResize(
    props.ResizeObserver,
    layerRef,
    targetElement,
    isOpen,
    handlePositioning,
    environment
  );

  // On every render, check a few things...
  useIsomorphicLayoutEffect(() => {
    /**
     * A.
     * Ignore when render is caused by internal style change
     */
    const styleIsSetInterally = !isSet(onStyle);
    const effectBecauseOfInternalStyleChange = styles !== lastStyles.current;

    if (effectBecauseOfInternalStyleChange && styleIsSetInterally) {
      lastStyles.current = styles;
      return;
    }

    // reset `lastStyles` when closed
    if (!isOpen) {
      resetLastStyles();
      return;
    }

    /**
     * B.
     * Prepare to calculate new layer style
     */

    handlePositioning();
  });

  // calculate new layer style when window size changes
  useOnWindowResize(handlePositioning, environment, isOpen);

  // calculate new layer style when user scrolls
  useOnScroll(scrollParents, handlePositioning, environment, isOpen);

  // handle clicks that are not originated from the trigger / layer
  // element
  useOutsideClick(
    [layerRef, { current: targetElement }],
    React.useCallback(() => {
      if (!isOpen) {
        return;
      }

      if (closeOnOutsideClick) {
        close();
      }
    }, [isOpen, setOpen])
  );

  const containerElement =
    typeof container === "function" ? container() : container;

  function open({ clientRect, target }: OpenProps) {
    triggerRectRef.current = clientRect;

    if (isOpen && target === targetElement) {
      handlePositioning();
    } else {
      setTargetRef(target);
      setOpen(true);
    }
  }

  const payload: UseToggleLayerPayload = {
    isOpen,
    close,
    open,
    openFromContextMenuEvent: evt => {
      evt.preventDefault();
      const target = evt.target as HTMLElement;

      const clientRect: ClientRect = {
        top: evt.clientY,
        left: evt.clientX,
        bottom: evt.clientY + 1,
        right: evt.clientX + 1,
        width: 1,
        height: 1
      };

      open({ clientRect, target });
    },
    openFromMouseEvent: evt => {
      const currentTarget = evt.currentTarget as HTMLElement;

      if (!currentTarget || !currentTarget.getBoundingClientRect) {
        return;
      }

      const clientRect = () => currentTarget.getBoundingClientRect();

      open({ clientRect, target: currentTarget });
    },

    openFromSelection: selection => {
      if (!selection.anchorNode || selection.isCollapsed) {
        return;
      }

      const element = getElementFromAnchorNode(selection.anchorNode);

      if (!element) {
        return;
      }

      const range = selection.getRangeAt(0);

      open({
        clientRect: () => range.getBoundingClientRect(),
        target: element
      });
    },

    layerSide: isOpen ? styles.layerSide : null
  };

  const element =
    relativeParentElement &&
    createPortal(
      renderLayer({
        layerProps: {
          ref: element => {
            if (element) {
              // observe the layer for resizing
              // it's ok to observe the same element multiple times
              // since multiple observes of same element are ignored
              resizeObserver.observe(element!);
            }

            layerRef.current = element;
          },
          style: {
            ...(isSet(onStyle) ? EMPTY_STYLE : styles.layer),
            position: fixed ? "fixed" : "absolute",
            willChange: "top, bottom, left, right, width, height"
          }
        },
        arrowStyle: {
          ...(isSet(onStyle) ? EMPTY_STYLE : styles.arrow),
          position: "absolute",
          willChange: "top, bottom, left, right"
        },
        isOpen,
        layerSide: styles.layerSide,
        triggerRect: getTriggerRect(),
        close: () => {
          close();
        }
      }),
      containerElement || relativeParentElement
    );

  return [element, payload] as [React.ReactElement<any>, UseToggleLayerPayload];
}
