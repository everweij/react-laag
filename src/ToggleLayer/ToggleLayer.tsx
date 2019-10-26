import * as React from "react";
import {
  LayerSide,
  RenderLayer,
  ToggleLayerOptions,
  DisappearType
} from "./types";

import useOutsideClick from "./useOutsideClick";
import useOnScroll from "./useOnScroll";
import useOnWindowResize from "./useOnWindowResize";
import useTrackElementResize from "./useTrackElementResize";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";
import useStyleState from "./useStyleState";
import getPositioning, { defaultPlacement } from "./getPositioning";
import useElementState from "./useElementState";

import {
  EMPTY_STYLE,
  isSet,
  shouldUpdateStyles,
  getWindowClientRect
} from "./util";

import {
  doesEntireLayerFitWithinScrollParents,
  isLayerCompletelyInvisible
} from "./rect";
import { createPortal } from "react-dom";

type RenderChildrenProps = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  triggerRef: React.RefObject<any>;
  layerSide: LayerSide | null;
};

export type Props = {
  children: (childrenProps: RenderChildrenProps) => React.ReactNode;
  renderLayer: RenderLayer;
  isOpen?: boolean;
  onOutsideClick?: () => void;
  onDisappear?: (type: DisappearType) => void;
} & ToggleLayerOptions;

function ToggleLayer({
  children,
  renderLayer,
  placement = {},
  onStyle,
  isOpen: isOpenExternal,
  closeOnOutsideClick,
  onOutsideClick,
  onDisappear,
  closeOnDisappear,
  fixed,
  container,
  ...props
}: Props) {
  /**
   * Tracks trigger element and keeps it in state together with it's
   * relative/absolute positioned parent
   */
  const [
    triggerRef,
    { relativeParentElement, triggerElement, scrollParents }
  ] = useElementState(container, fixed);

  const { styles, setStyles, lastStyles, resetLastStyles } = useStyleState(
    placement.anchor || defaultPlacement.anchor
  );

  const layerRef = React.useRef<HTMLElement | null>(null);

  const [isOpenInternal, setOpenInternal] = React.useState(false);
  const isOpen = isSet(isOpenExternal) ? isOpenExternal! : isOpenInternal;

  const handlePositioning = React.useCallback(() => {
    const triggerRect = triggerElement!.getBoundingClientRect();

    const result = getPositioning({
      triggerRect,
      layerElement: layerRef.current,
      placement,
      relativeParentElement,
      scrollParents,
      fixed
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

    const hasOnDisappear = isSet(onDisappear);
    const shouldCloseOnDisappear = closeOnDisappear && !isSet(isOpenExternal);

    // Should we respond to the layer's partial or full disappearance?
    // (trigger's disappearance when `fixed` props is set)
    if (hasOnDisappear || shouldCloseOnDisappear) {
      const allScrollParents = [
        ...scrollParents.map(parent => parent.getBoundingClientRect()),
        getWindowClientRect()
      ];

      const partial = !doesEntireLayerFitWithinScrollParents(
        fixed ? triggerRect : layerRect,
        allScrollParents
      );
      const full = isLayerCompletelyInvisible(
        fixed ? triggerRect : layerRect,
        allScrollParents
      );

      // if parent is interested in diseappearance...
      if (hasOnDisappear) {
        onDisappear!(full ? "full" : "partial");
      }
      // ... else close accordingly
      else {
        if (closeOnDisappear === "partial" && partial) {
          setOpenInternal(false);
        }
        if (closeOnDisappear === "full" && full) {
          setOpenInternal(false);
        }
      }
    }
  }, [
    relativeParentElement,
    isOpen,
    triggerElement,
    scrollParents,
    fixed,
    placement
  ]);

  // call `handlePositioning` when the layer's / trigger's
  // height and / or width changes
  const resizeObserver = useTrackElementResize(
    props.ResizeObserver,
    layerRef,
    triggerElement,
    isOpen,
    handlePositioning
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

    // reset lastStyles-ref when closed
    if (!isOpen) {
      resetLastStyles();
      return;
    }

    /**
     * B.
     * Prepare to calculate new layer style
     */

    // if (!triggerElement) {
    //   throw new Error("Please provide a valid ref to the trigger element");
    // } else if (!layerRef.current) {
    //   throw new Error("Please provide a valid ref to the layer element");
    // }

    handlePositioning();
  });

  // calculate new layer style when window size changes
  useOnWindowResize(handlePositioning, isOpen);

  // calculate new layer style when user scrolls
  useOnScroll(scrollParents, handlePositioning, isOpen);

  // handle clicks that are not originated from the trigger / layer
  // element
  useOutsideClick(
    [{ current: triggerElement }, layerRef],
    React.useCallback(() => {
      if (!isOpen) {
        return;
      }

      if (onOutsideClick) {
        onOutsideClick();
      }

      if (closeOnOutsideClick && !isSet(isOpenExternal)) {
        setOpenInternal(false);
      }
    }, [isOpen, setOpenInternal, isOpenExternal])
  );

  const containerElement =
    typeof container === "function" ? container() : container;

  return (
    <>
      {children({
        isOpen,
        close: () => {
          /* istanbul ignore next */
          if (isSet(isOpenExternal)) {
            throw new Error(
              "You cannot call `close()` while using the `isOpen` prop"
            );
          }
          /* istanbul ignore next */
          setOpenInternal(false);
        },
        open: () => {
          /* istanbul ignore next */
          if (isSet(isOpenExternal)) {
            throw new Error(
              "You cannot call `open()` while using the `isOpen` prop"
            );
          }
          /* istanbul ignore next */
          setOpenInternal(true);
        },
        toggle: () => {
          /* istanbul ignore next */
          if (isSet(isOpenExternal)) {
            throw new Error(
              "You cannot call `toggle()` while using the `isOpen` prop"
            );
          }
          setOpenInternal(!isOpenInternal);
        },
        triggerRef,
        layerSide: isOpen ? styles.layerSide : null
      })}

      {relativeParentElement &&
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
            triggerRect: triggerElement
              ? triggerElement.getBoundingClientRect()
              : null,
            close: () => {
              /* istanbul ignore next */
              if (isSet(isOpenExternal)) {
                throw new Error(
                  "You cannot call `close()` while using the `isOpen` prop"
                );
              }
              /* istanbul ignore next */
              setOpenInternal(false);
            }
          }),
          containerElement || relativeParentElement
        )}
    </>
  );
}

export default ToggleLayer;
