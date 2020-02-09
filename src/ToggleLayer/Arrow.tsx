import * as React from "react";
import { LayerSide } from "./types";

function getWidthBasedOnAngle(angle: number, size: number) {
  return Math.tan(angle * (Math.PI / 180)) * size;
}

function getViewBox(
  sizeA: number,
  sizeB: number,
  layerSide: LayerSide,
  borderWidth: number
) {
  switch (layerSide) {
    case "bottom":
      return `0 ${-borderWidth} ${sizeB} ${sizeA}`;
    case "top":
      return `0 0 ${sizeB} ${sizeA + borderWidth}`;
    case "right":
      return `${-borderWidth} 0 ${sizeA} ${sizeB}`;
    case "left":
      return `0 0 ${sizeA + borderWidth} ${sizeB}`;
  }

  return "";
}

type getTrianglePathProps = {
  sizeA: number;
  sizeB: number;
  layerSide: LayerSide;
  roundness: number;
  angle: number;
};

function getTrianglePath({
  sizeA,
  sizeB,
  layerSide,
  roundness,
  angle
}: getTrianglePathProps) {
  const relativeRoundness = (roundness / 10) * sizeA * 2;

  const A =
    layerSide === "bottom"
      ? `0 ${sizeA}`
      : layerSide === "top"
      ? `0 0`
      : layerSide === "right"
      ? `${sizeA} ${sizeB}`
      : `0 ${sizeB}`;

  const B = `${layerSide === "bottom" || layerSide === "top" ? "H" : "V"} ${
    layerSide === "bottom" || layerSide === "top" ? sizeB : 0
  }`;

  const cPoint = sizeB / 2;
  const c1A = sizeB / 2 + getWidthBasedOnAngle(angle, sizeA / 8);
  const c1B = sizeA / 8;

  const C =
    layerSide === "bottom"
      ? `C ${c1A} ${c1B} ${cPoint + relativeRoundness} 0 ${cPoint} 0`
      : layerSide === "top"
      ? `C ${c1A} ${sizeA - c1B} ${cPoint +
          relativeRoundness} ${sizeA} ${cPoint} ${sizeA}`
      : layerSide === "right"
      ? `C ${c1B} ${sizeB - c1A} 0 ${cPoint - relativeRoundness} 0 ${cPoint}`
      : `C ${sizeA - c1B} ${sizeB - c1A} ${sizeA} ${cPoint -
          relativeRoundness} ${sizeA} ${cPoint}`;

  const d1A = sizeB / 2 - getWidthBasedOnAngle(angle, sizeA / 8);
  const d1B = sizeA / 8;

  const D =
    layerSide === "bottom"
      ? `C ${cPoint - relativeRoundness} 0 ${d1A} ${d1B} ${A}`
      : layerSide === "top"
      ? `C ${cPoint - relativeRoundness} ${sizeA} ${d1A} ${sizeA - d1B} ${A}`
      : layerSide === "right"
      ? `C 0 ${cPoint + relativeRoundness} ${d1B} ${sizeB - d1A} ${A}`
      : `C${sizeA} ${cPoint + relativeRoundness} ${sizeA - d1B} ${sizeB -
          d1A} ${A}`;

  return `M ${A} ${B} ${C} ${D}`;
}

type GetBorderMaskPathProps = {
  sizeA: number;
  sizeB: number;
  borderWidth: number;
  layerSide: LayerSide;
  angle: number;
};

function getBorderMaskPath({
  sizeA,
  sizeB,
  borderWidth,
  layerSide,
  angle
}: GetBorderMaskPathProps) {
  const borderOffset = getWidthBasedOnAngle(angle, borderWidth);

  if (layerSide === "bottom" || layerSide === "top") {
    return `M ${borderWidth} ${layerSide === "bottom" ? sizeA : 0} H ${sizeB -
      borderWidth} L ${sizeB - borderWidth - borderOffset} ${
      layerSide === "bottom" ? sizeA - borderWidth : borderWidth
    } H ${borderOffset + borderWidth} Z`;
  }

  return `M ${layerSide === "right" ? sizeA : 0} ${borderWidth} V ${sizeB -
    borderWidth} L ${
    layerSide === "right" ? sizeA - borderWidth : borderWidth
  } ${sizeB - borderWidth - borderOffset} V ${borderOffset + borderWidth} Z`;
}

type ArrowProps = {
  angle?: number; // angle of triangle -> range(10, 80) | default 45
  size?: number; // distance in pixels between point of triangle and layer | default 8
  roundness?: number; // roundness of the point of the arrow -> range(0, 1) | default 0
  borderWidth?: number; // default 0
  borderColor?: string; // default "black"
  backgroundColor?: string; // default "white"
  layerSide?: LayerSide;
  style?: React.CSSProperties;
};

export default function Arrow({
  size = 8,
  angle = 45,
  borderWidth = 0,
  borderColor = "black",
  roundness = 0,
  backgroundColor = "white",
  layerSide = "top",
  style = {}
}: ArrowProps) {
  if (layerSide === "center") {
    return null;
  }

  const sizeA = size;
  const sizeB = getWidthBasedOnAngle(angle, size) * 2;

  return (
    <svg
      style={{
        ...style,
        transform: `translate${
          layerSide === "left" || layerSide === "right" ? "Y" : "X"
        }(-50%)`
      }}
      data-arrow="true"
      width={layerSide === "left" || layerSide === "right" ? sizeA : sizeB}
      viewBox={getViewBox(sizeA, sizeB, layerSide, borderWidth)}
    >
      <path
        fill={backgroundColor}
        strokeWidth={borderWidth}
        stroke={borderColor}
        d={getTrianglePath({
          angle,
          layerSide,
          roundness,
          sizeA,
          sizeB
        })}
      />
      <path
        fill={backgroundColor}
        d={getBorderMaskPath({ sizeA, sizeB, angle, borderWidth, layerSide })}
      />
    </svg>
  );
}
