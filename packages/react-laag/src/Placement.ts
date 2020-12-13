import { BoundSideType, SideType, BoundSide, BoundSideProp } from "./Sides";
import { PlacementType } from "./PlacementType";
import { SubjectsBounds } from "./SubjectsBounds";
import { PositionConfig, Offsets } from "./types";
import { Bounds, IBounds } from "./Bounds";
import { BoundsOffsets } from "./BoundsOffsets";
import { limit } from "./util";

/**
 * Class for various calculations based on a placement-type. I.e 'top-left';
 */
export class Placement {
  protected subjectsBounds!: SubjectsBounds;
  private _cachedLayerBounds: Bounds | null = null;
  private _cachedContainerOffsets: BoundsOffsets | null = null;

  constructor(
    public readonly primary: SideType,
    public readonly secondary: SideType,
    subjectBounds: SubjectsBounds,
    layerDimensions: PositionConfig["layerDimensions"],
    private readonly offsets: Offsets
  ) {
    this.setSubjectsBounds(subjectBounds, layerDimensions);
  }

  /**
   * Set subjectsBounds that are specific for this placement
   * @param subjectBounds original SubjectBounds instance
   * @param layerDimensions possible config prodvided by the user
   */
  private setSubjectsBounds(
    subjectBounds: SubjectsBounds,
    layerDimensions: PositionConfig["layerDimensions"]
  ): void {
    // if user did not provide any layerDimensions config...
    if (!layerDimensions) {
      this.subjectsBounds = subjectBounds;
      return;
    }

    // get anticipated layer-dimensions provided by the user
    const dimensions =
      // if the user passed a callback, call it with the layerSide corresponding to
      // the placement
      typeof layerDimensions === "function"
        ? layerDimensions(this.primary.prop)
        : layerDimensions;

    // create new SubjectsBounds instance by merging our newly create layer-bounds
    this.subjectsBounds = subjectBounds.merge({
      layer: {
        ...subjectBounds.layer,
        ...dimensions
      }
    });
  }

  /**
   * Returns the string respresentation of this placement (ie. 'top-start')
   */
  public get type(): PlacementType {
    return `${this.primary.prop}-${
      this.secondary.prop === "center"
        ? "center"
        : ["bottom", "right"].includes(this.secondary.prop)
        ? "end"
        : "start"
    }` as PlacementType;
  }

  /**
   * Calculates the actual boundaries based on the placement
   * @param secondaryOffset optional offset on the secondary-side
   */
  public getLayerBounds(secondaryOffset = 0): Bounds {
    // return cached version if possible
    if (this._cachedLayerBounds && secondaryOffset === 0) {
      return this._cachedLayerBounds;
    }

    const { primary, secondary, subjectsBounds } = this;
    const { trigger, layer, arrow } = subjectsBounds;
    const {
      isHorizontal,
      oppositeCssProp,
      oppositeSizeProp,
      prop,
      opposite
    } = primary as BoundSideType;

    const result = Bounds.empty() as IBounds;

    // let's take the placement 'top-start' as an example...
    // the offsets are the following:
    // trigger -> 8px
    // container -> 10px;
    // arrow -> 2px;

    // PRIMARY STUFF

    // bottom = trigger.top + 8;
    result[opposite.prop] =
      trigger[prop] - primary.factor(this.offsets.trigger);

    // top = bottom - layer.height
    result[prop] =
      result[opposite.prop] - primary.factor(layer[primary.sizeProp]);

    // SECONDARY STUFF

    // arrowOffsetBase = 4
    const arrowOffsetBase = this.offsets.arrow * 2;

    // limitMin = trigger.left - (layer.width - arrow.width) + 4
    let limitMin =
      trigger[oppositeCssProp] -
      (layer[oppositeSizeProp] - arrow[oppositeSizeProp]) +
      arrowOffsetBase;
    // limitMax = trigger.left + (trigger.width - arrow.width) - 4
    let limitMax =
      trigger[oppositeCssProp] +
      (trigger[oppositeSizeProp] - arrow[oppositeSizeProp]) -
      arrowOffsetBase;

    if (!secondary.isPush) {
      // if secondary is bottom or right -> add the width or height of the layer
      limitMin += layer[oppositeSizeProp];
      limitMax += layer[oppositeSizeProp];
    }

    if (secondary.isCenter) {
      const propertyA = (isHorizontal ? BoundSide.top : BoundSide.left).prop;
      const propertyB = (isHorizontal ? BoundSide.bottom : BoundSide.right)
        .prop;

      // left = limit(
      //   trigger.left + trigger.width / 2 - layer.width / 2 + secondaryOffset,
      //   limitMin,
      //   limitMax
      // )
      result[propertyA] = limit(
        trigger[propertyA] +
          trigger[oppositeSizeProp] / 2 -
          layer[oppositeSizeProp] / 2 +
          secondaryOffset,
        limitMin,
        limitMax
      );

      // right = left + layer.width
      result[propertyB] = result[propertyA] + layer[oppositeSizeProp];
    } else {
      const sec = secondary as BoundSideType;

      const triggerValue = trigger[sec.prop];

      // Under some conditions, when the layer is not able to align with the trigger
      // due to arrow-size and arrow-offsets, we need to compensate.
      // Otherwise, the secondary-offset will have no impact
      const arrowCompensation =
        triggerValue < limitMin
          ? limitMin - triggerValue
          : triggerValue > limitMax
          ? limitMax - triggerValue
          : 0;

      // left = limit(
      //   trigger.left + secondaryOffset + arrowCompensation,
      //   limitMin,
      //   limitMax
      // )
      result[sec.prop] = limit(
        triggerValue + secondaryOffset + arrowCompensation,
        limitMin,
        limitMax
      );

      // right = left + layer.width
      result[sec.opposite.prop] =
        result[sec.prop] + secondary.factor(layer[oppositeSizeProp]);
    }

    // set the correct dimensions
    result.width = result.right - result.left;
    result.height = result.bottom - result.top;

    // create new bounds object
    const layerBounds = Bounds.create(result);

    if (secondaryOffset === 0) {
      this._cachedLayerBounds = layerBounds;
    }

    return layerBounds;
  }

  /**
   * Checks whether the trigger is bigger on the opposite side
   * ie. placement "top-start" -> has trigger a bigger width?
   */
  public get triggerIsBigger() {
    const { isHorizontal } = this.secondary;
    const {
      triggerHasBiggerWidth,
      triggerHasBiggerHeight
    } = this.subjectsBounds;

    return (
      (isHorizontal && triggerHasBiggerWidth) ||
      (!isHorizontal && triggerHasBiggerHeight)
    );
  }

  /**
   * Checks whether the placement fits within all it's container (including container-offset)
   */
  public get fitsContainer(): boolean {
    return this.getContainerOffsets().allSidesArePositive;
  }

  /**
   * Returns the surface in square pixels of the visible part of the layer
   */
  public get visibleSurface(): number {
    const layerBounds = this.getLayerBounds();
    const containerOffsets = this.getContainerOffsets(layerBounds);

    const substract = containerOffsets.negativeSides;
    for (const side in substract) {
      // @ts-ignore
      substract[side] = -substract[side]; // make positive for substraction;
    }

    return layerBounds.substract(substract).surface;
  }

  /**
   * Returns a BoundSide by looking at the most negative offset that is the opposite direction
   */
  public get secondaryOffsetSide(): BoundSideType | null {
    // Given placement 'top-start' and containerOffsets { left: -20, top: -10, right: -10, bottom: 200 }...
    // the only negative offsets on the opposite side are { left: -20, right: -10 }
    // since we have to return only 1 side, we pick the most negative, which is 'left'

    const containerOffsets = this.getContainerOffsets();

    const [mostNegativeSide] =
      Object.entries(containerOffsets.negativeSides)
        .map(
          ([side, value]) => [BoundSide[side as BoundSideProp], value] as const
        )
        .filter(([side]) => this.primary.isOppositeDirection(side))
        .sort(([, a], [, b]) => b! - a!)?.[0] ?? [];

    return mostNegativeSide || null;
  }

  /**
   * returns getLayerBounds(), including container-offsets
   */
  private getLayerCollisionBounds(): Bounds {
    const { container } = this.offsets;

    return this.getLayerBounds()
      .mapSides((side, value) => (value -= side.factor(container)))
      .merge(({ width, height }) => ({
        width: width + container * 2,
        height: height + container * 2
      }));
  }

  /**
   * Returns a BoundsOffsets instance containing merged offsets to containers with the most
   * negative scenario
   */
  public getContainerOffsets(layerBounds?: Bounds): BoundsOffsets {
    if (this._cachedContainerOffsets && !layerBounds) {
      return this._cachedContainerOffsets;
    }

    const subjectBounds = this.subjectsBounds.merge({
      layer: layerBounds || this.getLayerCollisionBounds()
    });

    const offsets = BoundsOffsets.mergeSmallestSides(
      subjectBounds.layerOffsetsToScrollContainers
    );

    if (!layerBounds) {
      this._cachedContainerOffsets = offsets;
    }

    return offsets;
  }
}

export class PlacementCenter extends Placement {
  getLayerBounds(): Bounds {
    const { trigger, layer } = this.subjectsBounds;

    const result = Bounds.empty() as IBounds;

    result.top = trigger.top + trigger.height / 2 - layer.height / 2;
    result.bottom = result.top + layer.height;
    result.left = trigger.left + trigger.width / 2 - layer.width / 2;
    result.right = result.left + layer.width;
    result.width = result.right - result.left;
    result.height = result.bottom - result.top;

    return result as Bounds;
  }
}
