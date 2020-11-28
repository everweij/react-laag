import { createElement, forwardRef } from "react";
import { BoundSide, BoundSideType } from "./Sides";
import { LayerSide } from "./types";

const LEFT = "left";
const TOP = "top";
const BOTTOM = "bottom";
const RIGHT = "right";

function getWidthBasedOnAngle(angle: number, size: number) {
  return Math.tan(angle * (Math.PI / 180)) * size;
}

function getViewBox(
  sizeA: number,
  sizeB: number,
  side: BoundSideType,
  borderWidth: number
) {
  const map = {
    [BOTTOM]: `0 ${-borderWidth} ${sizeB} ${sizeA}`,
    [TOP]: `0 0 ${sizeB} ${sizeA + borderWidth}`,
    [RIGHT]: `${-borderWidth} 0 ${sizeA} ${sizeB}`,
    [LEFT]: `0 0 ${sizeA + borderWidth} ${sizeB}`
  };

  return map[side.prop];
}

function getTrianglePath(
  sizeA: number,
  sizeB: number,
  side: BoundSideType,
  roundness: number,
  angle: number
) {
  const relativeRoundness = (roundness / 10) * sizeA * 2;

  const A = {
    [BOTTOM]: [0, sizeA],
    [TOP]: [0, 0],
    [RIGHT]: [sizeA, sizeB],
    [LEFT]: [0, sizeB]
  }[side.prop].join(" ");

  const B = side.isHorizontal ? `V 0` : `H ${sizeB}`;

  const cPoint = sizeB / 2;
  const c1A = sizeB / 2 + getWidthBasedOnAngle(angle, sizeA / 8);
  const c1B = sizeA / 8;

  const C = {
    [BOTTOM]: ["C", c1A, c1B, cPoint + relativeRoundness, 0, cPoint, 0],
    [TOP]: [
      "C",
      c1A,
      sizeA - c1B,
      cPoint + relativeRoundness,
      sizeA,
      cPoint,
      sizeA
    ],
    [RIGHT]: ["C", c1B, sizeB - c1A, 0, cPoint - relativeRoundness, 0, cPoint],
    [LEFT]: [
      "C",
      sizeA - c1B,
      sizeB - c1A,
      sizeA,
      cPoint - relativeRoundness,
      sizeA,
      cPoint
    ]
  }[side.prop].join(" ");

  const d1A = sizeB / 2 - getWidthBasedOnAngle(angle, sizeA / 8);
  const d1B = sizeA / 8;

  const D = {
    [BOTTOM]: ["C", cPoint - relativeRoundness, 0, d1A, d1B, A],
    [TOP]: ["C", cPoint - relativeRoundness, sizeA, d1A, sizeA - d1B, A],
    [RIGHT]: ["C", 0, cPoint + relativeRoundness, d1B, sizeB - d1A, A],
    [LEFT]: [
      "C",
      sizeA,
      cPoint + relativeRoundness,
      sizeA - d1B,
      sizeB - d1A,
      A
    ]
  }[side.prop].join(" ");

  return ["M", A, B, C, D].join(" ");
}

function getBorderMaskPath(
  sizeA: number,
  sizeB: number,
  borderWidth: number,
  side: BoundSideType,
  angle: number
) {
  const borderOffset = getWidthBasedOnAngle(angle, borderWidth);

  const [A, B] = !side.isPush ? [sizeA, sizeA - borderWidth] : [0, borderWidth];

  if (side.isHorizontal) {
    return [
      "M",
      A,
      borderWidth,
      "V",
      sizeB - borderWidth,
      "L",
      B,
      sizeB - borderWidth - borderOffset,
      "V",
      borderOffset + borderWidth,
      "Z"
    ].join(" ");
  }

  return [
    "M",
    borderWidth,
    A,
    "H",
    sizeB - borderWidth,
    "L",
    sizeB - borderWidth - borderOffset,
    B,
    "H",
    borderOffset + borderWidth,
    "Z"
  ].join(" ");
}

export type ArrowProps = React.ComponentPropsWithoutRef<"svg"> & {
  /**
   * angle of triangle
   * default is `45`
   */
  angle?: number;
  /**
   * distance in pixels between point of triangle and layer
   * default is `8`
   */
  size?: number;
  /**
   * roundness of the point of the arrow
   * range: 0 - 1
   * default is `0`
   */
  roundness?: number;
  /**
   * width of the layers border
   * default is `0`
   */
  borderWidth?: number;
  /**
   * color of the layers border
   * default is `"black"`
   */
  borderColor?: string;
  /**
   * background-color of the layer
   * default is `"white"`
   */
  backgroundColor?: string;
  /**
   * Given by `useLayer()` and determines the direction the arrow should
   * be pointing to
   */
  layerSide?: LayerSide;
};

export const Arrow = forwardRef<SVGSVGElement, ArrowProps>(function Arrow(
  {
    size = 8,
    angle = 45,
    borderWidth = 0,
    borderColor = "black",
    roundness = 0,
    backgroundColor = "white",
    layerSide = "top",
    style = {},
    ...rest
  },
  ref
) {
  if (layerSide === "center") {
    return null;
  }

  const side = BoundSide[layerSide];
  const sizeA = size;
  const sizeB = getWidthBasedOnAngle(angle, size) * 2;

  return createElement(
    "svg",
    {
      ref,
      ...rest,
      style: {
        ...style,
        transform: `translate${side.isHorizontal ? "Y" : "X"}(-50%)`
      },
      width: side.isHorizontal ? sizeA : sizeB,
      height: side.isHorizontal ? sizeB : sizeA,
      viewBox: getViewBox(sizeA, sizeB, side, borderWidth)
    },
    createElement("path", {
      fill: backgroundColor,
      strokeWidth: borderWidth,
      stroke: borderColor,
      d: getTrianglePath(sizeA, sizeB, side, roundness, angle)
    }),
    createElement("path", {
      fill: backgroundColor,
      d: getBorderMaskPath(sizeA, sizeB, borderWidth, side, angle)
    })
  );
});
