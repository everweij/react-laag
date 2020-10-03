import { Placement, Direction, Side, SizeProperty, CssSide } from "./types";

export type PlacementProperties = {
  opposite: {
    primary: Side;
    secondary: Side;
  };
  primary: Side;
  secondary: Side;
  direction: Direction;
  sizeProperty: SizeProperty;
  oppositeSizeProperty: SizeProperty;
  cssProperties: {
    primary: CssSide;
    secondary: CssSide;
  };
};

const VERTICAL_PROPERTIES = {
  direction: Direction.VERTICAL,
  sizeProperty: SizeProperty.height,
  oppositeSizeProperty: SizeProperty.width,
  cssProperties: {
    primary: "top" as CssSide,
    secondary: "left" as CssSide
  }
};

const HORIZONTAL_PROPERTIES = {
  direction: Direction.HORIZONTAL,
  sizeProperty: SizeProperty.width,
  oppositeSizeProperty: SizeProperty.height,
  cssProperties: {
    primary: "left" as CssSide,
    secondary: "top" as CssSide
  }
};

const OPPOSITE_SIDES: Record<Side, Side> = {
  [Side.top]: Side.bottom,
  [Side.bottom]: Side.top,
  [Side.left]: Side.right,
  [Side.right]: Side.left,
  [Side.center]: Side.center
};

const PLACEMENT_PROPERTIES: Record<Placement, PlacementProperties> = {
  [Placement["bottom-center"]]: {
    opposite: {
      primary: OPPOSITE_SIDES[Side.bottom],
      secondary: OPPOSITE_SIDES[Side.center]
    },
    primary: Side.bottom,
    secondary: Side.center,
    ...VERTICAL_PROPERTIES
  },
  [Placement["bottom-start"]]: {
    opposite: {
      primary: OPPOSITE_SIDES[Side.bottom],
      secondary: OPPOSITE_SIDES[Side.left]
    },
    primary: Side.bottom,
    secondary: Side.left,
    ...VERTICAL_PROPERTIES
  },
  [Placement["bottom-end"]]: {
    opposite: {
      primary: OPPOSITE_SIDES[Side.bottom],
      secondary: OPPOSITE_SIDES[Side.right]
    },
    primary: Side.bottom,
    secondary: Side.right,
    ...VERTICAL_PROPERTIES
  },
  [Placement["left-end"]]: {
    opposite: {
      primary: OPPOSITE_SIDES[Side.left],
      secondary: OPPOSITE_SIDES[Side.bottom]
    },
    primary: Side.left,
    secondary: Side.bottom,
    ...HORIZONTAL_PROPERTIES
  },
  [Placement["left-center"]]: {
    opposite: {
      primary: OPPOSITE_SIDES[Side.left],
      secondary: OPPOSITE_SIDES[Side.center]
    },
    primary: Side.left,
    secondary: Side.center,
    ...HORIZONTAL_PROPERTIES
  },
  [Placement["left-start"]]: {
    opposite: {
      primary: OPPOSITE_SIDES[Side.left],
      secondary: OPPOSITE_SIDES[Side.top]
    },
    primary: Side.left,
    secondary: Side.top,
    ...HORIZONTAL_PROPERTIES
  },
  [Placement["right-end"]]: {
    opposite: {
      primary: OPPOSITE_SIDES[Side.right],
      secondary: OPPOSITE_SIDES[Side.bottom]
    },
    primary: Side.right,
    secondary: Side.bottom,
    ...HORIZONTAL_PROPERTIES
  },
  [Placement["right-center"]]: {
    opposite: {
      primary: OPPOSITE_SIDES[Side.right],
      secondary: OPPOSITE_SIDES[Side.center]
    },
    primary: Side.right,
    secondary: Side.center,
    ...HORIZONTAL_PROPERTIES
  },
  [Placement["right-start"]]: {
    opposite: {
      primary: OPPOSITE_SIDES[Side.right],
      secondary: OPPOSITE_SIDES[Side.top]
    },
    primary: Side.right,
    secondary: Side.top,
    ...HORIZONTAL_PROPERTIES
  },
  [Placement["top-center"]]: {
    opposite: {
      primary: OPPOSITE_SIDES[Side.top],
      secondary: OPPOSITE_SIDES[Side.center]
    },
    primary: Side.top,
    secondary: Side.center,
    ...VERTICAL_PROPERTIES
  },
  [Placement["top-start"]]: {
    opposite: {
      primary: OPPOSITE_SIDES[Side.top],
      secondary: OPPOSITE_SIDES[Side.left]
    },
    primary: Side.top,
    secondary: Side.left,
    ...VERTICAL_PROPERTIES
  },
  [Placement["top-end"]]: {
    opposite: {
      primary: OPPOSITE_SIDES[Side.top],
      secondary: OPPOSITE_SIDES[Side.right]
    },
    primary: Side.top,
    secondary: Side.right,
    ...VERTICAL_PROPERTIES
  },
  [Placement["center"]]: {
    opposite: {
      primary: Side.center,
      secondary: Side.center
    },
    primary: Side.center,
    secondary: Side.center,
    ...VERTICAL_PROPERTIES
  }
};

export const ALL_PLACEMENTS = Object.keys(Placement).filter(
  key => typeof key !== "number" && isNaN(key as any)
) as (keyof typeof Placement)[];

function createPlacement(primary: Side, secondary: Side): Placement {
  return Placement[
    `${Side[primary]}-${
      Side.center === secondary
        ? "center"
        : [Side.left, Side.top].includes(secondary)
        ? "start"
        : "end"
    }` as keyof typeof Placement
  ];
}

export function getPlacementProperties(
  placement: Placement
): PlacementProperties {
  return PLACEMENT_PROPERTIES[placement];
}

export function getListOfPlacementsByPriority(
  preferedPlacement: Placement,
  possiblePlacements: Placement[],
  preferedHorizontalSide: Side.left | Side.right,
  preferedVerticalSide: Side.top | Side.bottom,
  triggerHasBiggerHeight: boolean,
  triggerHasBiggerWidth: boolean
): Placement[] {
  if (preferedPlacement === Placement.center) {
    return [
      Placement.center,
      ...getListOfPlacementsByPriority(
        createPlacement(
          preferedVerticalSide,
          preferedHorizontalSide
        ) as Placement,
        possiblePlacements,
        preferedHorizontalSide,
        preferedVerticalSide,
        triggerHasBiggerHeight,
        triggerHasBiggerWidth
      )
    ];
  }

  const { primary, secondary, direction, opposite } = PLACEMENT_PROPERTIES[
    preferedPlacement
  ];

  const preferredSide =
    direction === Direction.VERTICAL
      ? preferedHorizontalSide
      : preferedVerticalSide;

  const triggerIsBigger =
    (direction === Direction.VERTICAL && triggerHasBiggerHeight) ||
    (direction === Direction.HORIZONTAL && triggerHasBiggerWidth);

  let list: Placement[] = [];
  list[0] = preferedPlacement;
  list[1] = createPlacement(
    primary,
    secondary === Side.center ? preferredSide : Side.center
  );
  list[2] = createPlacement(
    primary,
    opposite.secondary === Side.center
      ? OPPOSITE_SIDES[preferredSide]
      : opposite.secondary
  );
  list[3] = createPlacement(
    preferredSide,
    triggerIsBigger ? primary : opposite.primary
  );
  list[4] = createPlacement(preferredSide, Side.center);
  list[5] = createPlacement(
    preferredSide,
    triggerIsBigger ? opposite.primary : primary
  );
  list[6] = createPlacement(
    OPPOSITE_SIDES[preferredSide],
    triggerIsBigger ? primary : opposite.primary
  );
  list[7] = createPlacement(OPPOSITE_SIDES[preferredSide], Side.center);
  list[8] = createPlacement(
    OPPOSITE_SIDES[preferredSide],
    triggerIsBigger ? opposite.primary : primary
  );
  list[9] = createPlacement(opposite.primary, secondary);
  list[10] = createPlacement(
    opposite.primary,
    secondary === Side.center ? preferredSide : Side.center
  );
  list[11] = createPlacement(
    opposite.primary,
    opposite.secondary === Side.center
      ? OPPOSITE_SIDES[preferredSide]
      : opposite.secondary
  );

  list = list.filter(placement => possiblePlacements.includes(placement));

  // include prefered placement if not included in possiblePlacements
  if (!list.includes(preferedPlacement)) {
    list = [preferedPlacement, ...list];
  }

  return list;
}

export function getPlacementsOfSameSide(
  primarySide: Side,
  placements: Placement[]
) {
  return placements.filter(
    placement => getPlacementProperties(placement).primary === primarySide
  );
}
