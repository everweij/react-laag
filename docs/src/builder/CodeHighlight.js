import React from "react";

import Code from "../components/Code";

import { format } from "prettier/standalone";
import parserBabylon from "prettier/parser-babylon";

function renderLayer(state) {
  let styles = `
    width: ${state.width},
    height: ${state.height},
    backgroundColor: "${state.backgroundColor}"
  `.trim();

  if (state.borderWidth > 0) {
    styles =
      styles +
      `,
    borderWidth: ${state.borderWidth},
    borderColor: "${state.borderColor}"
  `.trim();
  }

  const props = `isOpen, layerProps${
    state.arrow ? ", arrowStyle, layerSide" : ""
  }`;

  const arrow = state.arrow
    ? `
  <Arrow
    style={arrowStyle}
    layerSide={layerSide}
    backgroundColor="${state.backgroundColor}"
    ${
      state.borderWidth > 0
        ? `
      borderWidth={${state.borderWidth}}
      borderColor="${state.borderColor}"
    `
        : ""
    }
    ${
      state.arrowAngle !== 45
        ? `
    angle={${state.arrowAngle}}
    `.trim()
        : ""
    }
    ${
      state.arrowSize !== 8
        ? `
    size={${state.arrowSize}}
    `.trim()
        : ""
    }
    ${
      state.arrowRoundness !== 0
        ? `roundness={${state.arrowRoundness}}
    `.trim()
        : ""
    }
  />
  `.trim()
    : "";

  if (state.transition) {
    const transition =
      `, transition: "` +
      [
        state.opacity ? `opacity ${state.duration}ms` : null,
        state.scale ? `transform ${state.duration}ms` : null
      ]
        .filter(Boolean)
        .join(", ") +
      `",`;

    styles =
      styles +
      `
${transition}
${state.opacity ? `opacity: isOpen ? 1 : 0,` : ""}
${state.scale ? `transform: "scale(" + isOpen ? 1 : 0.5 + ")"` : ""}
    `.trim();

    return `
{({ ${props} }) => (
  <Transition isOpen={isOpen}>
    {(isOpen, onTransitionEnd) => (
      <div
        ref={layerProps.ref}
        onTransitionEnd={onTransitionEnd}
        className="layer"
        style={{
          ...layerProps.style,
          ${styles}
        }}
      >
        Layer ${arrow}
      </div>
    )}
  </Transition>
)}
    `.trim();
  }

  return `
{({ ${props} }) =>
    isOpen && (
      <div
        ref={layerProps.ref}
        className="layer"
        style={{
          ...layerProps.style,
          ${styles}
        }}
      >
        Layer
        ${arrow}
      </div>
)}
  `.trim();
}

function renderPlacement(state) {
  if (
    state.anchor === "TOP_CENTER" &&
    state.possibleAnchors.length === 12 &&
    state.autoAdjust === false &&
    state.snapToAnchor === false &&
    state.preferX === "RIGHT" &&
    state.preferY === "BOTTOM" &&
    state.triggerOffset === 0 &&
    state.scrollOffset === 10
  ) {
    return "";
  }

  return `
    placement={{
      ${state.anchor !== "TOP_CENTER" ? `anchor: "${state.anchor}",` : ""}
      ${
        state.possibleAnchors.length !== 12
          ? `possibleAnchors: ${JSON.stringify(state.possibleAnchors)},`
          : ""
      }
      ${state.autoAdjust ? `autoAdjust: true,` : ""}
      ${state.snapToAnchor ? `snapToAnchor: true,` : ""}
      ${state.preferX !== "RIGHT" ? `preferX: "LEFT",` : ""}
      ${state.preferY !== "BOTTOM" ? `preferY: "BOTTOM",` : ""}
      ${
        state.triggerOffset !== 0
          ? `triggerOffset: ${state.triggerOffset},`
          : ""
      }
      ${
        state.scrollOffset !== 10 ? `triggerOffset: ${state.scrollOffset},` : ""
      }
    }}
  `;
}

export default function CodeHightlight({ state }) {
  const code = `
  <ToggleLayer
    renderLayer=${renderLayer(state)}
    ${renderPlacement(state)}
    ${state.fixed ? `fixed` : ""}
    ${state.closeOnOutsideClick ? `closeOnOutsideClick` : ""}
    ${
      state.closeOnDisappear
        ? `closeOnDisappear="${state.closeOnDisappear}"`
        : ""
    }
  >
    {({ triggerRef, toggle }) => (
      <button ref={triggerRef} className="toggle-btn" onClick={toggle}>
        Toggle
      </button>
    )}
  </ToggleLayer>
        `.trim();

  return (
    <Code>
      {format(code, {
        tabWidth: 2,
        parser: "babel",

        plugins: [parserBabylon]
      })}
    </Code>
  );
}
