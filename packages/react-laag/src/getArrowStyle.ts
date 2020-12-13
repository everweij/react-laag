import { limit } from "./util";
import { SubjectsBounds } from "./SubjectsBounds";
import { Placement } from "./Placement";

// how much pixels is the center of layer removed from edge of trigger?
function getNegativeOffsetBetweenLayerCenterAndTrigger(
  subjectsBounds: SubjectsBounds,
  placement: Placement,
  arrowOffset: number
) {
  const { layer, trigger, arrow } = subjectsBounds;

  const sizeProperty = placement.primary.oppositeSizeProp;

  const [sideA, sideB] = !placement.primary.isHorizontal
    ? (["left", "right"] as const)
    : (["top", "bottom"] as const);

  const offsetA =
    layer[sideA] +
    layer[sizeProperty] / 2 -
    trigger[sideA] -
    arrow[sizeProperty] / 2 -
    arrowOffset;
  const offsetB =
    layer[sideB] -
    layer[sizeProperty] / 2 -
    trigger[sideB] +
    arrow[sizeProperty] / 2 +
    arrowOffset;

  return (offsetA < 0 ? -offsetA : 0) + (offsetB > 0 ? -offsetB : 0);
}

const STYLE_BASE: React.CSSProperties = {
  position: "absolute",
  willChange: "top, left",
  left: null!,
  right: null!,
  top: null!,
  bottom: null!
};

export function getArrowStyle(
  subjectsBounds: SubjectsBounds,
  placement: Placement,
  arrowOffset: number
): React.CSSProperties {
  if (placement.primary.isCenter) {
    return STYLE_BASE;
  }

  const { layer, trigger, arrow } = subjectsBounds;

  const sizeProperty = placement.primary.oppositeSizeProp;
  const triggerIsBigger = trigger[sizeProperty] > layer[sizeProperty];

  const min = arrowOffset + arrow[sizeProperty] / 2;
  const max = layer[sizeProperty] - arrow[sizeProperty] / 2 - arrowOffset;

  const negativeOffset = getNegativeOffsetBetweenLayerCenterAndTrigger(
    subjectsBounds,
    placement,
    arrowOffset
  );

  const primarySide = placement.primary.prop;
  const secondarySide = placement.primary.oppositeCssProp;

  const secondaryValue = triggerIsBigger
    ? layer[sizeProperty] / 2 + negativeOffset
    : trigger[secondarySide] + trigger[sizeProperty] / 2 - layer[secondarySide];

  return {
    ...STYLE_BASE,
    [primarySide]: "100%",
    [secondarySide]: limit(secondaryValue, min, max)
  };
}
