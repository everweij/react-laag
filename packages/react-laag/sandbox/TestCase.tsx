import * as React from "react";
import {
  useLayer,
  Arrow,
  mergeRefs,
  LayerProps,
  UseLayerArrowProps
} from "../src";
import {
  useCenterScrollContainer,
  useRenderCount,
  useTrackScrollContainerOffsets
} from "./util-hooks";
import { constants } from "./constants";
import { InfoBox } from "./InfoBox";
import { TestCaseOptions } from "./options";

const base: React.CSSProperties = {
  height: "200vh",
  width: "100vw",
  display: "flex",
  backgroundColor: "#efefef"
};
const scrollContainer: React.CSSProperties = {
  width: constants.scrollContainerSize,
  height: constants.scrollContainerSize,
  backgroundColor: "lightgrey",
  overflow: "auto",
  position: "relative",
  margin: `calc(var(--max-height, 900px) / 2 - ${
    constants.scrollContainerSize / 2
  }px) auto 0 auto`
};
const filler: React.CSSProperties = {
  width: constants.scrollContainerInnerSize,
  height: constants.scrollContainerInnerSize,
  position: "absolute",
  left: 0,
  right: 0
};
const trigger: (width: number, height: number) => React.CSSProperties = (
  width,
  height
) => ({
  width,
  height,
  backgroundColor: "blue",
  color: "white",
  border: 0,
  position: "relative",
  top: constants.scrollContainerInnerSize / 2 - height / 2,
  left: constants.scrollContainerInnerSize / 2 - width / 2
});
const layer: (width: number, height: number) => React.CSSProperties = (
  width,
  height
) => ({
  width,
  height,
  backgroundColor: "green"
});
const childLayer: React.CSSProperties = {
  width: constants.childLayerSize,
  height: constants.childLayerSize,
  backgroundColor: "orange"
};

const Layer = React.forwardRef<
  HTMLDivElement,
  LayerProps & { arrow: UseLayerArrowProps }
>(function ChildLayer({ arrow, style }, ref) {
  const [isOpen, setOpen] = React.useState(false);

  const { triggerProps, layerProps, renderLayer } = useLayer({
    isOpen,
    auto: true,
    placement: "right-center",
    triggerOffset: 12,
    onParentClose: () => setOpen(false)
  });

  return (
    <>
      <div
        data-testid="layer"
        ref={mergeRefs(triggerProps.ref, ref)}
        style={style}
        onClick={() => setOpen(!isOpen)}
      >
        Layer
        <Arrow
          {...arrow}
          data-testid="arrow"
          backgroundColor="green"
          size={8}
        />
      </div>
      {renderLayer(
        isOpen && (
          <div
            data-testid="nested-layer"
            ref={layerProps.ref}
            style={{ ...layerProps.style, ...childLayer }}
          >
            Child
          </div>
        )
      )}
    </>
  );
});

export function TestCase({
  auto,
  layerDimensions,
  closeOnDisappear,
  closeOnOutsideClick,
  overflowContainer,
  placement,
  possiblePlacements,
  preferX,
  preferY,
  snap,
  arrowOffset,
  triggerOffset,
  containerOffset,
  triggerIsBigger,
  initialOpen
}: TestCaseOptions) {
  const [isOpen, setOpen] = React.useState(initialOpen);

  const triggerRef = React.useRef<HTMLButtonElement>(null!);
  const layerRef = React.useRef<HTMLDivElement>(null!);
  const arrowRef = React.useRef<SVGElement>(null!);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null!);
  useCenterScrollContainer(scrollContainerRef);
  useTrackScrollContainerOffsets(scrollContainerRef);
  const renderCount = useRenderCount();

  const { triggerProps, layerProps, arrowProps, renderLayer, layerSide } =
    useLayer({
      isOpen,
      overflowContainer,
      auto,
      arrowOffset,
      triggerOffset,
      containerOffset,
      snap,
      layerDimensions,
      placement,
      possiblePlacements,
      preferX,
      preferY,
      onOutsideClick: closeOnOutsideClick ? () => setOpen(false) : undefined,
      onDisappear: closeOnDisappear
        ? type => {
            if (type === closeOnDisappear) {
              setOpen(false);
            }
          }
        : undefined,
      onParentClose: () => setOpen(false)
    });

  const layerSizes = [constants.layerSize, constants.layerSize] as const;
  const triggerSizes = [
    constants.triggerWidth,
    constants.triggerHeight
  ] as const;

  return (
    <>
      <InfoBox
        renderCount={renderCount}
        triggerRef={triggerRef}
        layerRef={layerRef}
        arrowRef={arrowRef}
        layerSide={layerSide}
      />
      <div style={base}>
        <div
          data-testid="scroll-container"
          ref={scrollContainerRef}
          style={scrollContainer}
        >
          <div style={filler} />
          <button
            data-testid="trigger"
            ref={mergeRefs(triggerProps.ref, triggerRef)}
            style={trigger(...(triggerIsBigger ? layerSizes : triggerSizes))}
            onClick={() => setOpen(!isOpen)}
          >
            Trigger
          </button>
          {renderLayer(
            isOpen && (
              <Layer
                ref={mergeRefs(layerProps.ref, layerRef)}
                style={{
                  ...layerProps.style,
                  ...layer(...(triggerIsBigger ? triggerSizes : layerSizes))
                }}
                arrow={{
                  ...arrowProps,
                  ref: mergeRefs(arrowProps.ref, arrowRef)
                }}
              />
            )
          )}
        </div>
      </div>
    </>
  );
}
