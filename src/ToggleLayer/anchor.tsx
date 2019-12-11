import {
  AnchorEnum,
  Direction,
  Primary,
  Side,
  LayerSide,
  Rects
} from "./types";

export const Anchor: Record<Exclude<AnchorEnum, "CENTER">, AnchorEnum> = {
  BOTTOM_LEFT: "BOTTOM_LEFT",
  BOTTOM_RIGHT: "BOTTOM_RIGHT",
  BOTTOM_CENTER: "BOTTOM_CENTER",
  TOP_LEFT: "TOP_LEFT",
  TOP_CENTER: "TOP_CENTER",
  TOP_RIGHT: "TOP_RIGHT",
  LEFT_BOTTOM: "LEFT_BOTTOM",
  LEFT_CENTER: "LEFT_CENTER",
  LEFT_TOP: "LEFT_TOP",
  RIGHT_BOTTOM: "RIGHT_BOTTOM",
  RIGHT_CENTER: "RIGHT_CENTER",
  RIGHT_TOP: "RIGHT_TOP"
};

export const POSSIBLE_ANCHORS = Object.keys(Anchor) as AnchorEnum[];

export const PRIMARY_OPPOSITES: Record<Primary, Primary> = {
  TOP: "BOTTOM",
  BOTTOM: "TOP",
  LEFT: "RIGHT",
  RIGHT: "LEFT"
};

export function getPrimaryDirection(anchor: AnchorEnum): Direction {
  return anchor.startsWith("TOP_") || anchor.startsWith("BOTTOM_") ? "Y" : "X";
}

function primaryIsY(primary: Primary) {
  return primary === "TOP" || primary === "BOTTOM";
}

function getPrimaryByIndex(
  index: number,
  preferedPrimary: Primary,
  preferedX: "LEFT" | "RIGHT",
  preferedY: "TOP" | "BOTTOM"
): Primary {
  const prefferedIsY = primaryIsY(preferedPrimary);

  if (index < 3) {
    return preferedPrimary;
  }
  if (index < 6) {
    return prefferedIsY ? preferedX : preferedY;
  }
  if (index < 9) {
    if (prefferedIsY) {
      return ["LEFT", "RIGHT"].filter(x => x !== preferedX)[0] as Primary;
    } else {
      return ["TOP", "BOTTOM"].filter(x => x !== preferedY)[0] as Primary;
    }
  }

  if (prefferedIsY) {
    return ["TOP", "BOTTOM"].filter(x => x !== preferedPrimary)[0] as Primary;
  } else {
    return ["LEFT", "RIGHT"].filter(x => x !== preferedPrimary)[0] as Primary;
  }
}

function getSecondaryByIndex(
  index: number,
  preferedPrimary: Primary,
  preferedSecondary: Side,
  rects: Rects
): Side {
  const prefferedIsY = primaryIsY(preferedPrimary);

  const triggerHasBiggerHeight = rects.trigger.height > rects.layer.height;
  const triggerHasBiggerWidth = rects.trigger.width > rects.layer.width;

  switch (index) {
    case 9:
    case 0:
      return preferedSecondary;

    case 1:
    case 10: {
      if (preferedSecondary === "CENTER") {
        return prefferedIsY ? "RIGHT" : "BOTTOM";
      }

      return "CENTER";
    }

    case 4:
    case 7:
      return "CENTER";

    case 2:
    case 11: {
      if (prefferedIsY) {
        return ["LEFT", "RIGHT"].filter(
          x => x !== preferedSecondary
        )[0] as Side;
      } else {
        return ["TOP", "BOTTOM"].filter(
          x => x !== preferedSecondary
        )[0] as Side;
      }
    }

    case 3:
    case 6: {
      if (prefferedIsY) {
        return preferedPrimary === "BOTTOM" && !triggerHasBiggerHeight
          ? "TOP"
          : "BOTTOM";
      }

      return preferedPrimary === "LEFT" && !triggerHasBiggerWidth
        ? "RIGHT"
        : "LEFT";
    }

    case 5:
    case 8: {
      if (prefferedIsY) {
        return preferedPrimary === "BOTTOM" && !triggerHasBiggerHeight
          ? "BOTTOM"
          : "TOP";
      }

      return preferedPrimary === "LEFT" && !triggerHasBiggerWidth
        ? "LEFT"
        : "RIGHT";
    }
  }

  /* istanbul ignore next */
  return "LEFT";
}

export function getSecondaryAnchorOptionsByPrimary(
  primary: Primary,
  anchorOptions: AnchorEnum[]
) {
  return anchorOptions.filter(anchor => anchor.startsWith(primary));
}

type SplitAnchor = {
  primary: Primary;
  secondary: Side;
};

export function splitAnchor(anchor: AnchorEnum): SplitAnchor {
  const [primary, secondary] = anchor.split("_") as [Primary, Side];

  return { primary, secondary };
}

export function getLayerSideByAnchor(anchor: AnchorEnum): LayerSide {
  if (anchor === "CENTER") {
    return "center";
  }

  return splitAnchor(anchor).primary.toLowerCase() as LayerSide;
}

export function getAnchorPriority(
  preferedAnchor: AnchorEnum,
  possibleAnchors: AnchorEnum[],
  preferedX: "LEFT" | "RIGHT",
  preferedY: "TOP" | "BOTTOM",
  rects: Rects
) {
  const { primary, secondary } =
    preferedAnchor !== "CENTER"
      ? splitAnchor(preferedAnchor)
      : {
          primary: preferedY as Primary,
          secondary: "CENTER" as Side
        };

  let anchors = POSSIBLE_ANCHORS.map((_, index) => {
    return `${getPrimaryByIndex(
      index,
      primary,
      preferedX,
      preferedY
    )}_${getSecondaryByIndex(index, primary, secondary, rects)}` as AnchorEnum;
  }).filter(anchor => possibleAnchors.indexOf(anchor) > -1);

  // include prefered anchor if not included in possibleAnchors
  if (anchors.indexOf(preferedAnchor) === -1) {
    /* istanbul ignore next */
    anchors = [preferedAnchor, ...anchors];
  }

  return anchors;
}
