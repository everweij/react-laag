import React from "react";
import ResizeObserver from "resize-observer-polyfill";
import Button from "../components/Button";
import composeRefs from "../examples/composeRefs";

import { ToggleLayer, Transition, Arrow } from "react-laag";

function Preview({ state, style }, ref) {
  React.useEffect(() => {
    document.getElementById("toggle").click();
  }, []);

  return (
    <ToggleLayer
      renderLayer={({ isOpen, layerProps, arrowStyle, layerSide }) => {
        const arrow = state.arrow ? (
          <Arrow
            style={arrowStyle}
            backgroundColor={state.backgroundColor}
            borderWidth={state.borderWidth}
            borderColor={state.borderColor}
            angle={state.arrowAngle}
            size={state.arrowSize}
            roundness={state.arrowRoundness}
            layerSide={layerSide}
          />
        ) : null;

        const commonStyle = {
          ...layerProps.style,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderStyle: "solid",
          borderRadius: 4,
          width: state.width,
          height: state.height,
          borderWidth: state.borderWidth,
          borderColor: state.borderColor,
          backgroundColor: state.backgroundColor
        };

        if (state.transition) {
          return (
            <Transition isOpen={isOpen}>
              {(isOpen, onTransitionEnd) => (
                <div
                  ref={layerProps.ref}
                  onTransitionEnd={onTransitionEnd}
                  style={{
                    ...commonStyle,
                    transition: `opacity ${state.duration}ms, transform ${state.duration}ms`,
                    opacity: state.opacity ? (isOpen ? 1 : 0) : 1,
                    transform: state.scale
                      ? `scale(${isOpen ? 1 : 0.5})`
                      : "none"
                  }}
                >
                  <b>Layer</b>
                  {arrow}
                </div>
              )}
            </Transition>
          );
        }

        if (isOpen) {
          return (
            <div ref={layerProps.ref} style={commonStyle}>
              <b>Layer</b>
              {arrow}
            </div>
          );
        }

        return null;
      }}
      ResizeObserver={ResizeObserver}
      fixed={state.fixed}
      closeOnDisappear={state.closeOnDisappear}
      closeOnOutsideClick={state.closeOnOutsideClick}
      placement={{
        anchor: state.anchor,
        possibleAnchors: state.possibleAnchors,
        autoAdjust: state.autoAdjust,
        preferX: state.preferX,
        preferY: state.preferY,
        snapToAnchor: state.snapToAnchor,
        scrollOffset: state.scrollOffset,
        triggerOffset: state.triggerOffset
      }}
    >
      {({ triggerRef, toggle }) => (
        <Button
          id="toggle"
          onClick={toggle}
          style={style}
          ref={composeRefs(triggerRef, ref)}
        >
          Toggle
        </Button>
      )}
    </ToggleLayer>
  );
}

export default React.forwardRef(Preview);
