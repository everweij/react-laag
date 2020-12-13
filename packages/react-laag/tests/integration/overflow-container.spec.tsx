import { Placement } from "../../src";
import {
  render,
  cleanup,
  PLACEMENTS_NO_CENTER,
  ExpectBoundsProps
} from "./util";

describe("e2e/overflow-container", () => {
  afterEach(cleanup);

  it("tracks the triggers position while overflowing the container", async () => {
    const tools = render();

    // open the layer
    tools.clickTrigger();

    /**
     *                      ----------------------
     *                     |                      |
     *                     |        layer         |
     *                     |                      |
     *                      ----------------------
     *
     *                            -----------
     *                           |  trigger  |
     *                            -----------
     */

    await tools.expectBounds({
      layerSide: "top",
      layer: {
        top: 173,
        left: 580,
        bottom: 413,
        right: 820,
        width: 240,
        height: 240
      },
      arrow: {
        top: 413,
        left: 692,
        bottom: 429,
        right: 708,
        width: 16,
        height: 16
      }
    });

    // scroll 100px to bottom
    tools.scrollContainer(800, 700);

    /**
     *                      ----------------------
     *                     |                      |
     *                     |        layer         |
     *                     |                      |
     *                      ----------------------
     *
     *                            -----------
     *                           |  trigger  |
     *                            -----------
     */

    await tools.expectBounds({
      layerSide: "top",
      layer: {
        top: 73,
        left: 580,
        bottom: 313,
        right: 820,
        width: 240,
        height: 240
      },
      arrow: {
        top: 313,
        left: 692,
        bottom: 329,
        right: 708,
        width: 16,
        height: 16
      }
    });
  });

  it("tracks the triggers position while overflowing the container and adjusts automatically", async () => {
    const tools = render({ auto: true });

    // open the layer
    tools.clickTrigger();

    // scroll to bottom so that "top" fits exacly within window
    tools.scrollContainer(857, 700);

    /**
     *                      ----------------------
     *                     |                      |
     *                     |        layer         |
     *                     |                      |
     *                      ----------------------
     *
     *                            -----------
     *                           |  trigger  |
     *                            -----------
     */

    await tools.expectBounds({
      layerSide: "top",
      layer: {
        top: 16,
        left: 580,
        bottom: 256,
        right: 820,
        width: 240,
        height: 240
      },
      arrow: {
        top: 256,
        left: 692,
        bottom: 272,
        right: 708,
        width: 16,
        height: 16
      }
    });

    // scroll a little bit futher so that layer jumps to another placement
    tools.scrollContainer(858, 700);

    /**
     *
     *
     *
     *
     *                                             ----------------------
     *                                            |                      |
     *                            -----------     |         layer        |
     *                           |  trigger  |    |                      |
     *                            -----------      ----------------------
     */

    await tools.expectBounds({
      layerSide: "right",
      layer: {
        top: 77,
        left: 762,
        bottom: 317,
        right: 1002,
        width: 240,
        height: 240
      },
      arrow: {
        top: 284,
        left: 746,
        bottom: 300,
        right: 762,
        width: 16,
        height: 16
      }
    });
  });

  it("positions the right placements", async () => {
    const tools = render({ placement: "bottom-center" });
    tools.clickTrigger();

    const expectedBounds: Record<
      Exclude<Placement, "center">,
      ExpectBoundsProps
    > = {
      "top-start": {
        layerSide: "top",
        layer: {
          top: 173,
          left: 650,
          bottom: 413,
          right: 890,
          width: 240,
          height: 240
        },
        arrow: {
          top: 413,
          left: 692,
          bottom: 429,
          right: 708,
          width: 16,
          height: 16
        }
      },
      "top-center": {
        layerSide: "top",
        layer: {
          top: 173,
          left: 580,
          bottom: 413,
          right: 820,
          width: 240,
          height: 240
        },
        arrow: {
          top: 413,
          left: 692,
          bottom: 429,
          right: 708,
          width: 16,
          height: 16
        }
      },
      "top-end": {
        layerSide: "top",
        layer: {
          top: 173,
          left: 510,
          bottom: 413,
          right: 750,
          width: 240,
          height: 240
        },
        arrow: {
          top: 413,
          left: 692,
          bottom: 429,
          right: 708,
          width: 16,
          height: 16
        }
      },
      "left-start": {
        layerSide: "left",
        layer: {
          top: 425,
          left: 398,
          bottom: 665,
          right: 638,
          width: 240,
          height: 240
        },
        arrow: {
          top: 442,
          left: 638,
          bottom: 458,
          right: 654,
          width: 16,
          height: 16
        }
      },
      "left-center": {
        layerSide: "left",
        layer: {
          top: 330,
          left: 398,
          bottom: 570,
          right: 638,
          width: 240,
          height: 240
        },
        arrow: {
          top: 442,
          left: 638,
          bottom: 458,
          right: 654,
          width: 16,
          height: 16
        }
      },
      "left-end": {
        layerSide: "left",
        layer: {
          top: 235,
          left: 398,
          bottom: 475,
          right: 638,
          width: 240,
          height: 240
        },
        arrow: {
          top: 442,
          left: 638,
          bottom: 458,
          right: 654,
          width: 16,
          height: 16
        }
      },
      "right-start": {
        layerSide: "right",
        layer: {
          top: 425,
          left: 762,
          bottom: 665,
          right: 1002,
          width: 240,
          height: 240
        },
        arrow: {
          top: 442,
          left: 746,
          bottom: 458,
          right: 762,
          width: 16,
          height: 16
        }
      },
      "right-center": {
        layerSide: "right",
        layer: {
          top: 330,
          left: 762,
          bottom: 570,
          right: 1002,
          width: 240,
          height: 240
        },
        arrow: {
          top: 442,
          left: 746,
          bottom: 458,
          right: 762,
          width: 16,
          height: 16
        }
      },
      "right-end": {
        layerSide: "right",
        layer: {
          top: 235,
          left: 762,
          bottom: 475,
          right: 1002,
          width: 240,
          height: 240
        },
        arrow: {
          top: 442,
          left: 746,
          bottom: 458,
          right: 762,
          width: 16,
          height: 16
        }
      },
      "bottom-start": {
        layerSide: "bottom",
        layer: {
          top: 487,
          left: 650,
          bottom: 727,
          right: 890,
          width: 240,
          height: 240
        },
        arrow: {
          top: 471,
          left: 692,
          bottom: 487,
          right: 708,
          width: 16,
          height: 16
        }
      },
      "bottom-center": {
        layerSide: "bottom",
        layer: {
          top: 487,
          left: 580,
          bottom: 727,
          right: 820,
          width: 240,
          height: 240
        },
        arrow: {
          top: 471,
          left: 692,
          bottom: 487,
          right: 708,
          width: 16,
          height: 16
        }
      },
      "bottom-end": {
        layerSide: "bottom",
        layer: {
          top: 487,
          left: 510,
          bottom: 727,
          right: 750,
          width: 240,
          height: 240
        },
        arrow: {
          top: 471,
          left: 692,
          bottom: 487,
          right: 708,
          width: 16,
          height: 16
        }
      }
    };

    for (const placement of PLACEMENTS_NO_CENTER) {
      tools.reRender({ placement });
      await tools.expectBounds(expectedBounds[placement]);
    }
  });

  it("positions the right placements when trigger is bigger", async () => {
    const tools = render({ placement: "bottom-center", triggerIsBigger: true });
    tools.clickTrigger();

    const expectedBounds: Record<
      Exclude<Placement, "center">,
      ExpectBoundsProps
    > = {
      "top-start": {
        layerSide: "top",
        layer: {
          top: 268,
          left: 580,
          bottom: 318,
          right: 680,
          width: 100,
          height: 50
        },
        arrow: {
          top: 318,
          left: 622,
          bottom: 334,
          right: 638,
          width: 16,
          height: 16
        }
      },
      "top-center": {
        layerSide: "top",
        layer: {
          top: 268,
          left: 650,
          bottom: 318,
          right: 750,
          width: 100,
          height: 50
        },
        arrow: {
          top: 318,
          left: 692,
          bottom: 334,
          right: 708,
          width: 16,
          height: 16
        }
      },
      "top-end": {
        layerSide: "top",
        layer: {
          top: 268,
          left: 720,
          bottom: 318,
          right: 820,
          width: 100,
          height: 50
        },
        arrow: {
          top: 318,
          left: 762,
          bottom: 334,
          right: 778,
          width: 16,
          height: 16
        }
      },
      "left-start": {
        layerSide: "left",
        layer: {
          top: 330,
          left: 468,
          bottom: 380,
          right: 568,
          width: 100,
          height: 50
        },
        arrow: {
          top: 347,
          left: 568,
          bottom: 363,
          right: 584,
          width: 16,
          height: 16
        }
      },
      "left-center": {
        layerSide: "left",
        layer: {
          top: 425,
          left: 468,
          bottom: 475,
          right: 568,
          width: 100,
          height: 50
        },
        arrow: {
          top: 442,
          left: 568,
          bottom: 458,
          right: 584,
          width: 16,
          height: 16
        }
      },

      "left-end": {
        layerSide: "left",
        layer: {
          top: 520,
          left: 468,
          bottom: 570,
          right: 568,
          width: 100,
          height: 50
        },
        arrow: {
          top: 537,
          left: 568,
          bottom: 553,
          right: 584,
          width: 16,
          height: 16
        }
      },
      "right-start": {
        layerSide: "right",
        layer: {
          top: 330,
          left: 832,
          bottom: 380,
          right: 932,
          width: 100,
          height: 50
        },
        arrow: {
          top: 347,
          left: 816,
          bottom: 363,
          right: 832,
          width: 16,
          height: 16
        }
      },
      "right-center": {
        layerSide: "right",
        layer: {
          top: 425,
          left: 832,
          bottom: 475,
          right: 932,
          width: 100,
          height: 50
        },
        arrow: {
          top: 442,
          left: 816,
          bottom: 458,
          right: 832,
          width: 16,
          height: 16
        }
      },
      "right-end": {
        layerSide: "right",
        layer: {
          top: 520,
          left: 832,
          bottom: 570,
          right: 932,
          width: 100,
          height: 50
        },
        arrow: {
          top: 537,
          left: 816,
          bottom: 553,
          right: 832,
          width: 16,
          height: 16
        }
      },
      "bottom-start": {
        layerSide: "bottom",
        layer: {
          top: 582,
          left: 580,
          bottom: 632,
          right: 680,
          width: 100,
          height: 50
        },
        arrow: {
          top: 566,
          left: 622,
          bottom: 582,
          right: 638,
          width: 16,
          height: 16
        }
      },
      "bottom-center": {
        layerSide: "bottom",
        layer: {
          top: 582,
          left: 650,
          bottom: 632,
          right: 750,
          width: 100,
          height: 50
        },
        arrow: {
          top: 566,
          left: 692,
          bottom: 582,
          right: 708,
          width: 16,
          height: 16
        }
      },
      "bottom-end": {
        layerSide: "bottom",
        layer: {
          top: 582,
          left: 720,
          bottom: 632,
          right: 820,
          width: 100,
          height: 50
        },
        arrow: {
          top: 566,
          left: 762,
          bottom: 582,
          right: 778,
          width: 16,
          height: 16
        }
      }
    };

    for (const placement of PLACEMENTS_NO_CENTER) {
      tools.reRender({ placement, triggerIsBigger: true });
      await tools.expectBounds(expectedBounds[placement]);
    }
  });
});

// const expectedBounds: Record<
// Exclude<Placement, "center">,
// ExpectBoundsProps
// > = {
// "top-start": ,
// "top-center": ,
// "top-end": ,
// "left-start": ,
// "left-center": ,
// "left-end": ,
// "right-start": ,
// "right-center": ,
// "right-end": ,
// "bottom-start": ,
// "bottom-center": ,
// "bottom-end":
// };
