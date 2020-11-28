export type BoundSideProp = "top" | "left" | "bottom" | "right";
export type SideProp = BoundSideProp | "center";
type SizeProp = "width" | "height";
type CssProp = "top" | "left";

const OPPOSITES: Record<SideProp, SideProp> = {
  top: "bottom",
  left: "right",
  bottom: "top",
  right: "left",
  center: "center"
};

class SideBase<T extends SideProp> {
  constructor(
    readonly prop: T,
    readonly opposite: SideBase<T>,
    readonly isHorizontal: boolean,
    readonly sizeProp: SizeProp,
    readonly oppositeSizeProp: SizeProp,
    readonly cssProp: CssProp,
    readonly oppositeCssProp: CssProp,
    readonly isCenter: boolean,
    readonly isPush: boolean // left | top
  ) {}

  factor(value: number) {
    return value * (this.isPush ? 1 : -1);
  }

  isOppositeDirection(side: SideBase<any>) {
    return this.isHorizontal !== side.isHorizontal;
  }
}

function createSide<T extends SideProp>(
  prop: T,
  recursive = true
): SideBase<T> {
  const isHorizontal = ["left", "right"].includes(prop);

  return new SideBase<T>(
    prop,
    recursive ? createSide<T>((OPPOSITES as any)[prop], false) : null!,
    isHorizontal,
    isHorizontal ? "width" : "height",
    isHorizontal ? "height" : "width",
    isHorizontal ? "left" : "top",
    isHorizontal ? "top" : "left",
    prop === "center",
    !["right", "bottom"].includes(prop)
  );
}

export type BoundSideType = SideBase<BoundSideProp>;
export type SideType = SideBase<SideProp>;

export const BoundSide = {
  top: createSide("top") as BoundSideType,
  bottom: createSide("bottom") as BoundSideType,
  left: createSide("left") as BoundSideType,
  right: createSide("right") as BoundSideType
};

export const Side = {
  ...(BoundSide as {
    top: SideType;
    left: SideType;
    bottom: SideType;
    right: SideType;
  }),
  center: createSide("center")
};
