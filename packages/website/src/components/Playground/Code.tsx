import React from "react";
import { DEFAULT_OPTIONS } from "react-laag";
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import { format as prettier } from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import { Options, LayerSettings } from "./types";
import CopyButton from "../CopyButton";

function noNewLines(...args: (string | false)[]) {
  return args.filter(Boolean).join(", ");
}

function createCode(
  {
    overflowContainer,
    placement,
    auto,
    snap,
    preferX,
    preferY,
    possiblePlacements,
    triggerOffset,
    containerOffset,
    arrowOffset,
    closeOnDisappear,
    closeOnOutsideClick
  }: Options,
  layerSettings: LayerSettings
) {
  let code = `
    import * as React from "react";
    import { useLayer, Arrow } from "react-laag";
    import { Button, Menu } from "./ui";

    function Example() {
      const [isOpen, setOpen] = React.useState(false);

      const { renderLayer, triggerProps, layerProps, arrowProps } = useLayer({
        isOpen,
        ${noNewLines(
          overflowContainer !== DEFAULT_OPTIONS.overflowContainer &&
            `overflowContainer: ${String(!DEFAULT_OPTIONS.overflowContainer)}`,
          placement !== DEFAULT_OPTIONS.placement &&
            `placement: "${placement}"`,
          auto !== DEFAULT_OPTIONS.auto && `auto: ${!DEFAULT_OPTIONS.auto}`,
          auto &&
            possiblePlacements.length !==
              DEFAULT_OPTIONS.possiblePlacements.length &&
            `possiblePlacements: [${possiblePlacements
              .filter(x => x !== "center")
              .map(placement => `"${placement}"`)}]`,
          auto &&
            snap !== DEFAULT_OPTIONS.snap &&
            `snap: ${!DEFAULT_OPTIONS.snap}`,
          auto &&
            preferX !== DEFAULT_OPTIONS.preferX &&
            `preferX: "${
              ["left", "right"].filter(
                side => side !== DEFAULT_OPTIONS.preferX
              )[0]
            }"`,
          auto &&
            preferY !== DEFAULT_OPTIONS.preferY &&
            `preferY: "${
              ["top", "bottom"].filter(
                side => side !== DEFAULT_OPTIONS.preferY
              )[0]
            }"`,
          triggerOffset !== DEFAULT_OPTIONS.triggerOffset &&
            `triggerOffset: ${triggerOffset}`,
          containerOffset !== DEFAULT_OPTIONS.containerOffset &&
            `containerOffset: ${containerOffset}`,
          arrowOffset !== DEFAULT_OPTIONS.arrowOffset &&
            `arrowOffset: ${arrowOffset}`,
          closeOnDisappear === "partial"
            ? `onDisappear: () => setOpen(false)`
            : closeOnDisappear === "full"
            ? `onDisappear: (disappearType) => { if (disappearType === "full") { setOpen(false) } }`
            : false,
          closeOnOutsideClick && "onOutsideClick: () => setOpen(false)"
        )}
      });

      return (
        <>
          <Button
            {...triggerProps}
            onClick={() => setOpen(!isOpen)}
          >
            Trigger
          </Button>
          {isOpen && renderLayer(
            <Menu {...layerProps} style={{ ...layerProps.style, width: ${
              layerSettings.width
            }, height: ${layerSettings.height}}}>
              Layer
              <Arrow {...arrowProps} size={${
                layerSettings.arrowSize
                // eslint-disable-next-line
              }} roundness={${
    Math.round(layerSettings.arrowRoundness * 10) / 10
  }} />
            </Menu>
          )}
        </>
      );
    }
  `;

  return code;
}

type CodeProps = {
  options: Options;
  layerSettings: LayerSettings;
};

export default function Code({ layerSettings, options }: CodeProps) {
  const ref = React.useRef<HTMLElement>(null!);

  React.useEffect(() => {
    Prism.highlightElement(ref.current);
  });

  const code = prettier(createCode(options, layerSettings), {
    tabWidth: 2,
    parser: "babel",
    printWidth: 70,
    trailingComma: "none",
    plugins: [parserBabel]
  });

  return (
    <>
      <div className="code-highlight">
        <pre className="language-tsx">
          <code ref={ref}>{code}</code>
        </pre>
      </div>
      <CopyButton
        text={code}
        style={{ position: "absolute", right: 0, top: 0 }}
      />
    </>
  );
}
