import { BoundsOffsets } from "../src/BoundsOffsets";
import { Bounds } from "../src/Bounds";
import { createElement, clearBody } from "./test-util";

describe("Bounds", () => {
  afterEach(clearBody);

  it("creates an instance from an IBounds object", () => {
    const bounds = Bounds.create({
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0
    });

    expect(bounds).toBeInstanceOf(Bounds);
  });

  it("creates an instance of empty bounds", () => {
    expect(Bounds.empty()).toEqual(
      Bounds.create({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0
      })
    );
  });

  it("creates an instance out of the dimensions of the window", () => {
    expect(Bounds.fromWindow(window)).toEqual(
      Bounds.create({
        top: 0,
        left: 0,
        right: 1400,
        bottom: 900,
        width: 1400,
        height: 900
      })
    );
  });

  it("creates an instance out of an element", () => {
    const element = createElement("div", {
      width: "200px",
      height: "100px",
      transform: "scale(0.5)",
      transformOrigin: "top left"
    });
    document.body.appendChild(element);

    expect(Bounds.fromElement(element)).toEqual(
      Bounds.create({
        top: 0,
        left: 0,
        right: 100,
        bottom: 50,
        width: 100,
        height: 50
      })
    );
  });

  it("creates an instance out of an element ignoring transform", () => {
    const element = createElement("div", {
      width: "200px",
      height: "100px",
      transform: "scale(0.5)",
      transformOrigin: "top left"
    });
    document.body.appendChild(element);

    expect(Bounds.fromElement(element, { withTransform: false })).toEqual(
      Bounds.create({
        top: 0,
        left: 0,
        right: 100,
        bottom: 50,
        width: 200,
        height: 100
      })
    );
  });

  it("creates an instance out of an element ignoring transform and handling borders", () => {
    const element = createElement("div", {
      width: "200px",
      height: "100px",
      transform: "scale(0.5)",
      transformOrigin: "top left",
      border: "2px solid black"
    });
    document.body.appendChild(element);

    expect(Bounds.fromElement(element, { withTransform: false })).toEqual(
      Bounds.create({
        top: 0,
        left: 0,
        right: 102,
        bottom: 52,
        width: 204,
        height: 104
      })
    );
  });

  it("creates an instance out of an element ignoring transform and handling borders with border-box", () => {
    const element = createElement("div", {
      width: "200px",
      height: "100px",
      transform: "scale(0.5)",
      transformOrigin: "top left",
      border: "2px solid black",
      boxSizing: "border-box"
    });
    document.body.appendChild(element);

    expect(Bounds.fromElement(element, { withTransform: false })).toEqual(
      Bounds.create({
        top: 0,
        left: 0,
        right: 100,
        bottom: 50,
        width: 200,
        height: 100
      })
    );
  });

  it("creates an instance out of an element substracting scroll-bars", () => {
    const element = createElement("div", {}, {}, [
      createElement(
        "style",
        {},
        {
          innerHTML: `
            #outer::-webkit-scrollbar {
              -webkit-appearance: none;
              width: 10px;
              height: 10px;
            }
      `
        }
      ),
      createElement(
        "div",
        {
          width: "400px",
          height: "400px",
          overflow: "scroll"
        },
        { id: "outer" },
        [
          createElement("div", {
            width: "800px",
            height: "800px"
          })
        ]
      )
    ]);

    document.body.appendChild(element);

    expect(
      Bounds.fromElement(document.getElementById("outer")!, {
        withScrollbars: false
      })
    ).toEqual(
      Bounds.create({
        top: 0,
        left: 0,
        right: 390,
        bottom: 390,
        width: 390,
        height: 390
      })
    );
  });

  it("converts a Bounds-instance to a plain js-object", () => {
    expect(
      Bounds.create({
        top: 0,
        left: 0,
        right: 200,
        bottom: 200,
        width: 200,
        height: 200
      })
    ).toEqual({
      top: 0,
      left: 0,
      right: 200,
      bottom: 200,
      width: 200,
      height: 200
    });
  });

  it("merges two Bounds-instances into one", () => {
    const bounds = Bounds.create({
      top: 0,
      left: 0,
      right: 200,
      bottom: 200,
      width: 200,
      height: 200
    });

    expect(bounds.merge({ right: 100, width: 100 })).toEqual(
      Bounds.create({
        top: 0,
        left: 0,
        right: 100,
        bottom: 200,
        width: 100,
        height: 200
      })
    );
  });

  it("merges two Bounds-instances into one with help of a callback", () => {
    const bounds = Bounds.create({
      top: 0,
      left: 0,
      right: 200,
      bottom: 200,
      width: 200,
      height: 200
    });

    expect(
      bounds.merge(current => ({ ...current, right: 100, width: 100 }))
    ).toEqual(
      Bounds.create({
        top: 0,
        left: 0,
        right: 100,
        bottom: 200,
        width: 100,
        height: 200
      })
    );
  });

  it("substracts another partial IBounds-object", () => {
    const bounds = Bounds.create({
      top: 0,
      left: 0,
      right: 200,
      bottom: 200,
      width: 200,
      height: 200
    }).substract({ right: 100, left: 10, top: 50, bottom: 20 });

    expect(bounds).toEqual(
      Bounds.create({
        top: 50,
        left: 10,
        right: 100,
        bottom: 180,
        width: 90,
        height: 130
      })
    );
  });

  it("calculates offsets relative to a childs-bounds-instance", () => {
    const parent = Bounds.create({
      top: 0,
      left: 0,
      right: 200,
      bottom: 200,
      width: 200,
      height: 200
    });
    const child = Bounds.create({
      top: 50,
      left: 50,
      right: 150,
      bottom: 150,
      width: 100,
      height: 100
    });

    expect(parent.offsetsTo(child)).toEqual(
      new BoundsOffsets({
        top: 50,
        left: 50,
        right: 50,
        bottom: 50
      })
    );
  });

  it("creates a new Bounds-instance by mapping over each side", () => {
    const bounds = Bounds.create({
      top: 0,
      left: 0,
      right: 200,
      bottom: 200,
      width: 200,
      height: 200
    });

    const newBounds = bounds.mapSides((side, value) =>
      side.isHorizontal ? side.factor(-10) : value
    );

    expect(newBounds).toEqual(
      Bounds.create({
        top: 0,
        left: -10,
        right: 10,
        bottom: 200,
        width: 200,
        height: 200
      })
    );
  });
});
