import { Bounds } from "../src/Bounds";
import { SubjectsBounds } from "../src/SubjectsBounds";
import { createElement, clearBody } from "./test-util";

describe("SubjectsBounds", () => {
  afterAll(clearBody);

  const trigger = createElement("div", { width: "100px", height: "100px" });
  const layer = createElement("div", { width: "200px", height: "200px" });
  const scrollContainer1 = createElement("div", {
    width: "800px",
    height: "600px"
  });
  const scrollContainer2 = createElement("div", {
    width: "800px",
    height: "600px"
  });

  const subjects = [trigger, layer, scrollContainer1, scrollContainer2];
  subjects.forEach(el => document.body.appendChild(el));

  const sb = SubjectsBounds.create(
    window,
    layer,
    trigger,
    scrollContainer1,
    null,
    [scrollContainer1, scrollContainer2],
    false
  );

  it("creates a collection of bounds from relevant subjects", () => {
    // including window bounds
    expect(sb.scrollContainers.length).toBe(3);
    // checking if a valid Bounds-instance was instantiated
    expect(sb.layer.width).toBe(200);
  });

  it("creates a collection of bounds by merging another partial ISubjectBounds-object", () => {
    const merged = sb.merge({ layer: Bounds.empty() });

    expect(merged).not.toBe(sb);
    expect(merged.layer).toEqual(Bounds.empty());
  });

  it("tells if the trigger has a bigger width than the layer", () => {
    expect(sb.triggerHasBiggerWidth).toBe(false);
  });
  it("tells if the trigger has a bigger height than the layer", () => {
    expect(sb.triggerHasBiggerHeight).toBe(false);
  });

  it("returns the BoundsOffsets for each scroll-container relative to the layer", () => {
    expect(sb.layerOffsetsToScrollContainers).toEqual([
      { top: 100, left: 0, right: 600, bottom: 300 },
      { top: -200, left: 0, right: 600, bottom: 600 },
      { top: -800, left: 0, right: 600, bottom: 1200 }
    ]);
  });
});
