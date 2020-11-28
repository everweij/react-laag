import { Bounds, IBounds } from "./Bounds";

interface ISubjectsBounds {
  trigger: IBounds;
  layer: IBounds;
  arrow: IBounds;
  parent: IBounds;
  window: IBounds;
  scrollContainers: IBounds[];
}

export class SubjectsBounds implements ISubjectsBounds {
  public readonly trigger!: Bounds;
  public readonly layer!: Bounds;
  public readonly arrow!: Bounds;
  public readonly parent!: Bounds;
  public readonly window!: Bounds;
  public readonly scrollContainers!: Bounds[];

  private constructor(
    subjectsBounds: ISubjectsBounds,
    private readonly overflowContainer: boolean
  ) {
    Object.assign(this, subjectsBounds);
  }

  static create(
    environment: Window,
    layer: HTMLElement,
    trigger: HTMLElement,
    parent: HTMLElement,
    arrow: HTMLElement | null,
    scrollContainers: HTMLElement[],
    overflowContainer: boolean
  ) {
    const window = Bounds.fromWindow(environment);

    return new SubjectsBounds(
      {
        layer: Bounds.fromElement(layer, {
          environment,
          withTransform: false
        }),
        trigger: Bounds.fromElement(trigger),
        arrow: arrow ? Bounds.fromElement(arrow) : Bounds.empty(),
        parent: Bounds.fromElement(parent),
        window,
        scrollContainers: [
          window,
          ...scrollContainers.map(container =>
            Bounds.fromElement(container, { withScrollbars: false })
          )
        ]
      },
      overflowContainer
    );
  }

  merge(subjectsBounds: Partial<ISubjectsBounds>) {
    return new SubjectsBounds(
      {
        ...this,
        ...subjectsBounds
      },
      this.overflowContainer
    );
  }

  get layerOffsetsToScrollContainers() {
    return this.offsetsToScrollContainers(this.layer);
  }

  get triggerHasBiggerWidth() {
    return this.trigger.width > this.layer.width;
  }

  get triggerHasBiggerHeight() {
    return this.trigger.height > this.layer.height;
  }

  offsetsToScrollContainers(subject: Bounds, allContainers = false) {
    const scrollContainers =
      this.overflowContainer && !allContainers
        ? [this.window]
        : this.scrollContainers;

    return scrollContainers.map(scrollContainer =>
      scrollContainer.offsetsTo(subject)
    );
  }
}
