import * as React from "react";
import { LayerSide, BoundSide } from "./types";

function getWidthBasedOnAngle(angle: number, size: number) {
  return Math.tan(angle * (Math.PI / 180)) * size;
}

function sideIsHorizontal(side: BoundSide): boolean {
  return [BoundSide.left, BoundSide.right].includes(side);
}

function getViewBox(
  sizeA: number,
  sizeB: number,
  side: BoundSide,
  borderWidth: number
) {
  const map: Record<BoundSide, string> = {
    [BoundSide.bottom]: `0 ${-borderWidth} ${sizeB} ${sizeA}`,
    [BoundSide.top]: `0 0 ${sizeB} ${sizeA + borderWidth}`,
    [BoundSide.right]: `${-borderWidth} 0 ${sizeA} ${sizeB}`,
    [BoundSide.left]: `0 0 ${sizeA + borderWidth} ${sizeB}`
  };

  return map[side];
}

function getTrianglePath(
  sizeA: number,
  sizeB: number,
  side: BoundSide,
  roundness: number,
  angle: number
) {
  const relativeRoundness = (roundness / 10) * sizeA * 2;

  const isHorizontal = sideIsHorizontal(side);

  const A = {
    [BoundSide.bottom]: [0, sizeA],
    [BoundSide.top]: [0, 0],
    [BoundSide.right]: [sizeA, sizeB],
    [BoundSide.left]: [0, sizeB]
  }[side].join(" ");

  const B = isHorizontal ? `V 0` : `H ${sizeB}`;

  const cPoint = sizeB / 2;
  const c1A = sizeB / 2 + getWidthBasedOnAngle(angle, sizeA / 8);
  const c1B = sizeA / 8;

  const C = {
    [BoundSide.bottom]: [
      "C",
      c1A,
      c1B,
      cPoint + relativeRoundness,
      0,
      cPoint,
      0
    ],
    [BoundSide.top]: [
      "C",
      c1A,
      sizeA - c1B,
      cPoint + relativeRoundness,
      sizeA,
      cPoint,
      sizeA
    ],
    [BoundSide.right]: [
      "C",
      c1B,
      sizeB - c1A,
      0,
      cPoint - relativeRoundness,
      0,
      cPoint
    ],
    [BoundSide.left]: [
      "C",
      sizeA - c1B,
      sizeB - c1A,
      sizeA,
      cPoint - relativeRoundness,
      sizeA,
      cPoint
    ]
  }[side].join(" ");

  const d1A = sizeB / 2 - getWidthBasedOnAngle(angle, sizeA / 8);
  const d1B = sizeA / 8;

  const D = {
    [BoundSide.bottom]: ["C", cPoint - relativeRoundness, 0, d1A, d1B, A],
    [BoundSide.top]: [
      "C",
      cPoint - relativeRoundness,
      sizeA,
      d1A,
      sizeA - d1B,
      A
    ],
    [BoundSide.right]: [
      "C",
      0,
      cPoint + relativeRoundness,
      d1B,
      sizeB - d1A,
      A
    ],
    [BoundSide.left]: [
      "C",
      sizeA,
      cPoint + relativeRoundness,
      sizeA - d1B,
      sizeB - d1A,
      A
    ]
  }[side].join(" ");

  return ["M", A, B, C, D].join(" ");
}

function getBorderMaskPath(
  sizeA: number,
  sizeB: number,
  borderWidth: number,
  side: BoundSide,
  angle: number
) {
  const borderOffset = getWidthBasedOnAngle(angle, borderWidth);

  const [A, B] = [BoundSide.right, BoundSide.bottom].includes(side)
    ? [sizeA, sizeA - borderWidth]
    : [0, borderWidth];

  if (sideIsHorizontal(side)) {
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

export const Arrow = React.forwardRef<SVGSVGElement, ArrowProps>(function Arrow(
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
  const isHorizontal = sideIsHorizontal(side);
  const sizeA = size;
  const sizeB = getWidthBasedOnAngle(angle, size) * 2;

  return (
    <svg
      ref={ref}
      {...rest}
      style={{
        ...style,
        transform: `translate${isHorizontal ? "Y" : "X"}(-50%)`
      }}
      width={isHorizontal ? sizeA : sizeB}
      height={isHorizontal ? sizeB : sizeA}
      viewBox={getViewBox(sizeA, sizeB, side, borderWidth)}
    >
      <path
        fill={backgroundColor}
        strokeWidth={borderWidth}
        stroke={borderColor}
        d={getTrianglePath(sizeA, sizeB, side, roundness, angle)}
      />
      <path
        fill={backgroundColor}
        d={getBorderMaskPath(sizeA, sizeB, borderWidth, side, angle)}
      />
    </svg>
  );
});
