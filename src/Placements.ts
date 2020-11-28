import { CSSProperties } from "react";
import {
  BoundSide,
  Side,
  BoundSideType,
  SideType,
  BoundSideProp,
  SideProp
} from "./Sides";
import { PlacementType } from "./PlacementType";
import { Placement, PlacementCenter } from "./Placement";
import { SubjectsBounds } from "./SubjectsBounds";
import {
  PositionConfig,
  Offsets,
  ScrollOffsets,
  BorderOffsets,
  DisappearType,
  Styles
} from "./types";
import { Bounds } from "./Bounds";
import { getArrowStyle } from "./getArrowStyle";
import { BoundsOffsets } from "./BoundsOffsets";

/**
 * Class mostly concerned about calculating and finding the right placement
 */
export class Placements {
  protected constructor(
    public readonly placements: Placement[],
    private config: PositionConfig,
    private subjectsBounds: SubjectsBounds
  ) {}

  /**
   * Converts a placement-type into a primary-side and a secondary-side
   */
  static getSidesFromPlacementType(
    type: PlacementType
  ): [BoundSideType, SideType] {
    let [a, b] = (type.split("-") as unknown) as [
      keyof typeof BoundSide,
      "start" | "center" | "end"
    ];

    const primary = BoundSide[a];
    let secondary: SideType;
    if (b === "center") {
      secondary = Side.center;
    } else if (primary.isHorizontal) {
      secondary = b === "start" ? Side.top : Side.bottom;
    } else {
      secondary = b === "start" ? Side.left : Side.right;
    }

    return [primary, secondary];
  }

  /**
   * Main static method to create a Placements instance
   * @param subjectsBounds instance of the SubjectsBounds class
   * @param config config provided by the user
   */
  static create(
    subjectsBounds: SubjectsBounds,
    config: PositionConfig
  ): Placements {
    // create offsets-object from user config
    const offsets: Offsets = {
      arrow: config.arrowOffset,
      container: config.containerOffset,
      trigger: config.triggerOffset
    };

    // function which creates a prioritized list of possible placments
    // by looking at user-config
    function getListOfPlacements(preferedPlacement = config.placement) {
      const [primary, secondary] = Placements.getSidesFromPlacementType(
        preferedPlacement
      );

      const preferredSide =
        BoundSide[primary.isHorizontal ? config.preferY : config.preferX];

      // some priorities may alter when the trigger is bigger
      const triggerIsBigger =
        (!primary.isHorizontal && subjectsBounds.triggerHasBiggerWidth) ||
        (primary.isHorizontal && subjectsBounds.triggerHasBiggerHeight);

      // utility function which constructs a placement by primary and secondary sides
      function placementFrom(
        primary: BoundSideType,
        secondary: SideType
      ): Placement {
        return new Placement(
          primary,
          secondary,
          subjectsBounds,
          config.layerDimensions,
          offsets
        );
      }

      // creating the list
      let list: Placement[] = [];
      list[0] = placementFrom(primary, secondary);
      list[1] = placementFrom(
        primary,
        secondary.isCenter ? preferredSide : Side.center
      );
      list[2] = placementFrom(
        primary,
        Side[
          (secondary.opposite.isCenter
            ? preferredSide.opposite
            : secondary.opposite
          ).prop
        ]
      );
      list[3] = placementFrom(
        preferredSide,
        triggerIsBigger ? primary : Side[primary.opposite.prop]
      );
      list[4] = placementFrom(preferredSide, Side.center);
      list[5] = placementFrom(
        preferredSide,
        triggerIsBigger ? Side[primary.opposite.prop] : primary
      );
      list[6] = placementFrom(
        BoundSide[preferredSide.opposite.prop],
        triggerIsBigger ? primary : Side[primary.opposite.prop]
      );
      list[7] = placementFrom(
        BoundSide[preferredSide.opposite.prop],
        Side.center
      );
      list[8] = placementFrom(
        BoundSide[preferredSide.opposite.prop],
        triggerIsBigger ? Side[primary.opposite.prop] : primary
      );
      list[9] = placementFrom(BoundSide[primary.opposite.prop], secondary);
      list[10] = placementFrom(
        BoundSide[primary.opposite.prop],
        secondary.isCenter ? preferredSide : Side.center
      );
      list[11] = placementFrom(
        BoundSide[primary.opposite.prop],
        Side[
          (secondary.opposite.isCenter
            ? preferredSide.opposite
            : secondary.opposite
          ).prop
        ]
      );

      // only include placements that are part of 'possible-placements'
      list = list.filter(
        placement =>
          placement.type === config.placement ||
          config.possiblePlacements.includes(placement.type)
      );

      return list;
    }

    // treat placement 'center' a little bit different
    if (config.placement === "center") {
      return new Placements(
        [
          new PlacementCenter(
            Side.center,
            Side.center,
            subjectsBounds,
            config.layerDimensions,
            offsets
          ),
          ...getListOfPlacements(
            `${config.preferY}-${config.preferX}` as PlacementType
          )
        ],
        config,
        subjectsBounds
      );
    }

    return new Placements(getListOfPlacements(), config, subjectsBounds);
  }

  private filterPlacementsBySide(side: SideType): Placement[] {
    return this.placements.filter(placement => placement.primary === side);
  }

  private findFirstPlacementThatFits(): Placement | undefined {
    return this.placements.find(placement => placement.fitsContainer);
  }

  private placementWithBiggestVisibleSurface(): Placement {
    const [{ placement: placementWithBiggestSurface }] = this.placements
      .map(placement => ({
        placement,
        surface: placement.visibleSurface
      }))
      // sort -> biggest surface first
      .sort((a, b) => b.surface - a.surface);

    return placementWithBiggestSurface;
  }

  private findSuitablePlacement(): Placement {
    if (!this.config.auto) {
      return this.placements[0];
    }

    return (
      this.findFirstPlacementThatFits() ||
      this.placementWithBiggestVisibleSurface()
    );
  }

  /**
   * secondary offset: the number of pixels between the edge of the
   * scroll-container and the current placement, on the side of the layer
   * that didn't fit.
   * Eventually this secondary offset gets added / subtracted from the
   * placement that does fit in order to move the layer closer to the
   * position of the placement that just would not fit.
   * This creates the effect that the layer is moving gradually from one
   * placement to the next as the users scrolls the page or scroll-container
   */
  private getSecondaryOffset(placement: Placement): number {
    const { auto, snap } = this.config;

    // return early when we're not interested...
    if (!auto || snap || placement instanceof PlacementCenter) {
      return 0;
    }

    // if current placement fits and is prefered placement...
    // return early
    const placementsOnSameSide = this.filterPlacementsBySide(placement.primary);
    const currentPlacementHasHighestPriority =
      placementsOnSameSide.indexOf(placement) === 0;
    if (currentPlacementHasHighestPriority && placement.fitsContainer) {
      return 0;
    }

    const firstPlacementThatDoesNotFit = placementsOnSameSide.find(
      placement => !placement.fitsContainer
    );
    if (!firstPlacementThatDoesNotFit) {
      return 0;
    }
    const secondaryOffsetSide = firstPlacementThatDoesNotFit.secondaryOffsetSide!;
    if (!secondaryOffsetSide) {
      return 0;
    }

    const containerOffsets = placement.getContainerOffsets();

    // determine whether we should add or substract the secondary-offset
    const { secondary } = placement;
    let factor: number;
    if (
      placement.triggerIsBigger ||
      firstPlacementThatDoesNotFit === placement
    ) {
      factor = secondaryOffsetSide.isPush ? -1 : 1;
    } else {
      factor =
        secondary === Side.left ||
        ([Side.top, Side.center].includes(secondary) &&
          secondaryOffsetSide.isPush)
          ? -1
          : 1;
    }

    // get number of pixels between placement that did not fit and current
    // placement
    const secondaryOffset = containerOffsets[secondaryOffsetSide!.prop];

    return secondaryOffset * factor;
  }

  private getStyles(
    layerBounds: Bounds,
    placement: Placement,
    scrollOffsets: ScrollOffsets,
    borderOffsets: BorderOffsets
  ): Styles {
    const layerStyleBase: CSSProperties = {
      willChange: "top, bottom, left, right, width, height"
    };

    const arrow = getArrowStyle(
      this.subjectsBounds.merge({ layer: layerBounds }),
      placement,
      this.config.arrowOffset
    );

    const layer: CSSProperties = this.config.overflowContainer
      ? {
          ...layerStyleBase,
          position: "fixed",
          top: layerBounds.top,
          left: layerBounds.left
        }
      : {
          ...layerStyleBase,
          position: "absolute",
          top:
            layerBounds.top -
            this.subjectsBounds.parent.top +
            scrollOffsets.top -
            borderOffsets.top,
          left:
            layerBounds.left -
            this.subjectsBounds.parent.left +
            scrollOffsets.left -
            borderOffsets.left
        };

    return {
      arrow,
      layer
    };
  }

  private getHasDisappeared(layerBounds: Bounds): DisappearType | null {
    const subject = this.config.overflowContainer
      ? this.subjectsBounds.trigger
      : layerBounds;

    const containerOffsets = BoundsOffsets.mergeSmallestSides(
      this.subjectsBounds.offsetsToScrollContainers(subject, true)
    );

    const entries = (Object.entries(
      containerOffsets.negativeSides
    ) as unknown) as [BoundSideProp, number][];

    const hasFullyDisappeared = entries.some(([prop, value]) => {
      const side = BoundSide[prop];
      return value <= -subject[side.sizeProp];
    });

    if (hasFullyDisappeared) {
      return "full";
    }

    if (!containerOffsets.allSidesArePositive) {
      return "partial";
    }

    return null;
  }

  public result(scrollOffsets: ScrollOffsets, borderOffsets: BorderOffsets) {
    const suitablePlacement = this.findSuitablePlacement();
    const secondaryOffset = this.getSecondaryOffset(suitablePlacement);
    const layerBounds = suitablePlacement.getLayerBounds(secondaryOffset);
    const styles = this.getStyles(
      layerBounds,
      suitablePlacement,
      scrollOffsets,
      borderOffsets
    );
    const layerSide = suitablePlacement.primary.prop as SideProp;

    return {
      styles,
      layerSide,
      placement: suitablePlacement,
      layerBounds,
      hasDisappeared: this.getHasDisappeared(layerBounds)
    };
  }
}
