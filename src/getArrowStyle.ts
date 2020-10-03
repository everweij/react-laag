import { Side, BoundSide } from "./types";
import { limit } from "./util";
import { SubjectsBounds, SizeProperty } from "./types";

// how much pixels is the center of layer removed from edge of trigger?
function getNegativeOffsetBetweenLayerCenterAndTrigger(
  { ARROW, LAYER, TRIGGER }: SubjectsBounds,
  arrowOffset: number,
  isHorizontal: boolean
) {
  const sizeProperty = isHorizontal ? SizeProperty.width : SizeProperty.height;

  const [sideA, sideB] = isHorizontal
    ? ([BoundSide.left, BoundSide.right] as const)
    : ([BoundSide.top, BoundSide.bottom] as const);

  const offsetA =
    LAYER[sideA] +
    LAYER[sizeProperty] / 2 -
    TRIGGER[sideA] -
    ARROW[sizeProperty] / 2 -
    arrowOffset;
  const offsetB =
    LAYER[sideB] -
    LAYER[sizeProperty] / 2 -
    TRIGGER[sideB] +
    ARROW[sizeProperty] / 2 +
    arrowOffset;

  return (offsetA < 0 ? -offsetA : 0) + (offsetB > 0 ? -offsetB : 0);
}

const STYLE_BASE: React.CSSProperties = {
  position: "absolute",
  willChange: "top, bottom, left, right",
  left: null!,
  right: null!,
  top: null!,
  bottom: null!
};

export function getArrowStyle(
  subjectsBounds: SubjectsBounds,
  layerSide: Side,
  arrowOffset: number
): React.CSSProperties {
  if (layerSide === Side.center) {
    return STYLE_BASE;
  }

  const { LAYER, TRIGGER, ARROW } = subjectsBounds;

  const sizeProperty = [Side.left, Side.right].includes(layerSide)
    ? SizeProperty.height
    : SizeProperty.width;

  const triggerIsBigger =
    subjectsBounds.TRIGGER[sizeProperty] > subjectsBounds.LAYER[sizeProperty];

  const min = arrowOffset + ARROW[sizeProperty] / 2;
  const max = LAYER[sizeProperty] - ARROW[sizeProperty] / 2 - arrowOffset;

  const isHorizontal = [Side.top, Side.bottom].includes(layerSide);

  const primarySide = BoundSide[Side[layerSide] as BoundSide];
  const secondarySide = isHorizontal ? BoundSide.left : BoundSide.top;

  const negativeOffset = getNegativeOffsetBetweenLayerCenterAndTrigger(
    subjectsBounds,
    arrowOffset,
    isHorizontal
  );

  const secondaryValue = triggerIsBigger
    ? LAYER[sizeProperty] / 2 + negativeOffset
    : TRIGGER[secondarySide] + TRIGGER[sizeProperty] / 2 - LAYER[secondarySide];

  return {
    ...STYLE_BASE,
    [primarySide]: "100%",
    [secondarySide]: limit(secondaryValue, min, max)
  };
}
