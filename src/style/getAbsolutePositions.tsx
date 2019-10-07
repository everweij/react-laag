import { Rects, Primary, Side, Direction, AnchorEnum } from "../types";

import { splitAnchor, getPrimaryDirection } from "../anchor";

type PositionGetterArguments = {
  rects: Rects;
  scrollTop: number;
  scrollLeft: number;
  triggerOffset: number;
  offsetSecondary: number;
  primaryDirection: Direction;
  scrollbarWidth: number;
  scrollbarHeight: number;
};

type PositionGetter = (args: PositionGetterArguments) => React.CSSProperties;

const primaryStyleGetters: Record<Primary, PositionGetter> = {
  BOTTOM: ({ rects, scrollTop, triggerOffset }) => {
    const { trigger, relativeParent } = rects;
    return {
      top:
        trigger.top +
        trigger.height -
        (relativeParent.top - scrollTop) +
        triggerOffset,
      bottom: null as any
    };
  },
  TOP: ({ rects, scrollTop, triggerOffset, scrollbarHeight }) => {
    const { trigger, relativeParent } = rects;
    return {
      bottom:
        relativeParent.bottom -
        trigger.top -
        scrollTop +
        triggerOffset -
        scrollbarHeight,
      top: null as any
    };
  },
  LEFT: ({ rects, scrollLeft, triggerOffset, scrollbarWidth }) => {
    const { trigger, relativeParent } = rects;
    return {
      right:
        relativeParent.right -
        trigger.left -
        scrollLeft +
        triggerOffset -
        scrollbarWidth,
      left: null as any
    };
  },
  RIGHT: ({ rects, scrollLeft, triggerOffset }) => {
    const { trigger, relativeParent } = rects;
    return {
      left:
        trigger.left -
        relativeParent.left +
        scrollLeft +
        trigger.width +
        triggerOffset,
      right: null as any
    };
  }
};

const secondaryStyleGetters: Record<Side, PositionGetter> = {
  TOP: ({ rects, scrollTop, offsetSecondary }) => {
    const { trigger, relativeParent } = rects;
    return {
      top: trigger.top - relativeParent.top + scrollTop + offsetSecondary,
      bottom: null as any
    };
  },
  BOTTOM: ({ rects, scrollTop, offsetSecondary, scrollbarHeight }) => {
    const { trigger, relativeParent } = rects;
    return {
      bottom:
        relativeParent.bottom -
        trigger.bottom -
        scrollTop +
        offsetSecondary -
        scrollbarHeight,
      top: null as any
    };
  },
  CENTER: ({
    rects,
    scrollTop,
    scrollLeft,
    primaryDirection,
    offsetSecondary
  }) => {
    const { trigger, relativeParent, layer } = rects;

    if (primaryDirection === "Y") {
      return {
        left:
          trigger.left -
          relativeParent.left +
          scrollLeft +
          trigger.width / 2 -
          layer.width / 2 -
          offsetSecondary,
        right: null as any
      };
    }

    return {
      top:
        trigger.top -
        relativeParent.top +
        scrollTop +
        trigger.height / 2 -
        layer.height / 2 +
        offsetSecondary,
      bottom: null as any
    };
  },
  LEFT: ({ rects, scrollLeft, offsetSecondary }) => {
    const { trigger, relativeParent } = rects;
    return {
      left: trigger.left - relativeParent.left + scrollLeft + offsetSecondary,
      right: null as any
    };
  },
  RIGHT: ({ rects, scrollLeft, offsetSecondary, scrollbarWidth }) => {
    const { trigger, relativeParent } = rects;
    return {
      right:
        relativeParent.right -
        trigger.right -
        scrollLeft +
        offsetSecondary -
        scrollbarWidth,
      left: null as any
    };
  }
};

type GetAbsolutePositionsArgs = {
  anchor: AnchorEnum;
  rects: Rects;
  scrollTop: number;
  scrollLeft: number;
  triggerOffset: number;
  offsetSecondary: number;
  scrollbarWidth: number;
  scrollbarHeight: number;
};

export default function getAbsolutePositions({
  anchor,
  rects,
  triggerOffset,
  offsetSecondary,
  scrollLeft,
  scrollTop,
  scrollbarWidth,
  scrollbarHeight
}: GetAbsolutePositionsArgs) {
  const { primary, secondary } = splitAnchor(anchor);

  const primaryDirection = getPrimaryDirection(anchor);

  const primaryStyle = primaryStyleGetters[primary]({
    rects,
    triggerOffset,
    offsetSecondary,
    scrollLeft,
    scrollTop,
    primaryDirection,
    scrollbarWidth,
    scrollbarHeight
  });
  const secondaryStyle = secondaryStyleGetters[secondary]({
    rects,
    triggerOffset,
    offsetSecondary,
    scrollLeft,
    scrollTop,
    primaryDirection,
    scrollbarWidth,
    scrollbarHeight
  });

  return {
    ...primaryStyle,
    ...secondaryStyle
  };
}
