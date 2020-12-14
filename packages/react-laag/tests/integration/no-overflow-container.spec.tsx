import {
  render,
  cleanup,
  PLACEMENTS_NO_CENTER,
  ExpectBoundsProps,
  fixViewport
} from "./util";
import { Placement } from "../../src";
import { constants } from "../../sandbox/constants";

before(fixViewport);

describe("e2e/no-overflow-container", () => {
  afterEach(cleanup);

  it("tracks the triggers position", async () => {
    const tools = render({ overflowContainer: false });

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

  it("tracks the triggers position and adjusts automatically", async () => {
    const tools = render({ auto: true, overflowContainer: false });

    // open the layer
    tools.clickTrigger();

    // scroll to bottom so that "top" fits exacly within window
    tools.scrollContainer(707, 700);

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
        top: 166,
        left: 580,
        bottom: 406,
        right: 820,
        width: 240,
        height: 240
      },
      arrow: {
        top: 406,
        left: 692,
        bottom: 422,
        right: 708,
        width: 16,
        height: 16
      }
    });

    // scroll a little bit futher so that layer jumps to another placement
    tools.scrollContainer(709, 700);

    /**
     *                            -----------
     *                           |  trigger  |
     *                            -----------
     *
     *                      ----------------------
     *                     |                      |
     *                     |        layer         |
     *                     |                      |
     *                      ----------------------
     */

    await tools.expectBounds({
      layerSide: "bottom",
      layer: {
        top: 478,
        left: 580,
        bottom: 718,
        right: 820,
        width: 240,
        height: 240
      },
      arrow: {
        top: 462,
        left: 692,
        bottom: 478,
        right: 708,
        width: 16,
        height: 16
      }
    });
  });

  it("positions the right placements", async () => {
    const tools = render({
      placement: "bottom-center",
      overflowContainer: false
    });
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
      tools.reRender({ placement, overflowContainer: false });
      await tools.expectBounds(expectedBounds[placement]);
    }
  });

  it("positions the right placements when trigger is bigger", async () => {
    const tools = render({
      placement: "bottom-center",
      triggerIsBigger: true,
      overflowContainer: false
    });
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
      tools.reRender({
        placement,
        triggerIsBigger: true,
        overflowContainer: false
      });
      await tools.expectBounds(expectedBounds[placement]);
    }
  });

  it("handles secondary offsets while preventing to detach the layer from the trigger", async () => {
    const tools = render({
      placement: "bottom-center",
      auto: true,
      possiblePlacements: ["bottom-center", "bottom-start", "bottom-end"],
      overflowContainer: false
    });

    tools.clickTrigger();

    // scroll to bottom so layer is positioned all the way to the top
    tools.scrollContainer(950, 700);

    /**
     *                            -----------           |
     *                           |  trigger  |          |
     *                            -----------           |
     *                                                  |
     *                      ----------------------      |
     *                     |                      |     |
     *                     |        layer         |     |
     *                     |                      |     |
     *                      ----------------------      |
     */

    await tools.expectBounds({
      layerSide: "bottom",
      layer: {
        top: 237,
        left: 580,
        bottom: 477,
        right: 820,
        width: 240,
        height: 240
      },
      arrow: {
        top: 221,
        left: 692,
        bottom: 237,
        right: 708,
        width: 16,
        height: 16
      }
    });

    // scroll to left so layer gets "pushed" to the left
    tools.scrollContainer(950, 500);

    /**                                             |
     *                            -----------       |
     *                           |  trigger  |      |
     *                            -----------       |
     *                                              |
     *                    ----------------------    |
     *                   |                      |   |
     *                   |        layer         |   |
     *                   |                      |   |
     *                    ----------------------    |
     */

    await tools.expectBounds({
      layerSide: "bottom",
      layer: {
        top: 237,
        left: 744,
        bottom: 477,
        right: 984,
        width: 240,
        height: 240
      },
      arrow: {
        top: 221,
        left: 892,
        bottom: 237,
        right: 908,
        width: 16,
        height: 16
      }
    });

    // scroll to left so container-offsets aren't able to be respected
    // otherwise the layer would detach from its trigger
    tools.scrollContainer(950, 350);

    /**                          |
     *                           |-----------
     *                           |  trigger  |
     *                           |-----------
     *                           |
     *       --------------------|-
     *      |                    | |
     *      |        layer       | |
     *      |                    | |
     *       --------------------|-
     */

    await tools.expectBounds({
      layerSide: "bottom",
      layer: {
        top: 237,
        left: 792,
        bottom: 477,
        right: 1032,
        width: 240,
        height: 240
      },
      arrow: {
        top: 221,
        left: 1008,
        bottom: 237,
        right: 1024,
        width: 16,
        height: 16
      }
    });

    // scroll to right so container-offsets aren't able to be respected
    // otherwise the layer would detach from its trigger
    tools.scrollContainer(950, 1060);

    /**                                     |
     *                            ----------|
     *                           |  trigger ||
     *                            ----------|
     *                                      |
     *                                      |---------------------
     *                                     ||                     |
     *                                     ||       layer         |
     *                                     ||                     |
     *                                      |---------------------
     */

    await tools.expectBounds({
      layerSide: "bottom",
      layer: {
        top: 237,
        left: 358,
        bottom: 477,
        right: 598,
        width: 240,
        height: 240
      },
      arrow: {
        top: 221,
        left: 366,
        bottom: 237,
        right: 382,
        width: 16,
        height: 16
      }
    });

    // Let's try the same with the layer on the right hand side
    tools.reRender({
      placement: "right-center",
      auto: true,
      possiblePlacements: ["right-center", "right-start", "right-end"],
      overflowContainer: false
    });

    // scroll to right so layer is positioned all the way to the left
    tools.scrollContainer(700, 940);

    /**
     *
     *                                             ----------------------
     *                            -----------     |                      |
     *                           |  trigger  |    |         layer        |
     *                            -----------     |                      |
     *                                             ----------------------
     *
     *              --------------------------------------------------------------
     */

    await tools.expectBounds({
      layerSide: "right",
      layer: {
        top: 330,
        left: 522,
        bottom: 570,
        right: 762,
        width: 240,
        height: 240
      },
      arrow: {
        top: 442,
        left: 506,
        bottom: 458,
        right: 522,
        width: 16,
        height: 16
      }
    });

    // scroll to top so layer gets "pushed" to the top
    tools.scrollContainer(500, 940);

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
     *              --------------------------------------------------------------
     */

    await tools.expectBounds({
      layerSide: "right",
      layer: {
        top: 494,
        left: 522,
        bottom: 734,
        right: 762,
        width: 240,
        height: 240
      },
      arrow: {
        top: 642,
        left: 506,
        bottom: 658,
        right: 522,
        width: 16,
        height: 16
      }
    });

    // scroll to top so container-offsets aren't able to be respected
    // otherwise the layer would detach from its trigger
    tools.scrollContainer(360, 940);

    /**
     *
     *
     *
     *
     *                                             ----------------------
     *                                            |                      |
     *                                            |         layer        |
     *                                            |                      |
     *              --------------------------------------------------------------
     *                           |  trigger  |
     *                            -----------
     */

    await tools.expectBounds({
      layerSide: "right",
      layer: {
        top: 557,
        left: 522,
        bottom: 797,
        right: 762,
        width: 240,
        height: 240
      },
      arrow: {
        top: 773,
        left: 506,
        bottom: 789,
        right: 522,
        width: 16,
        height: 16
      }
    });

    // scroll to bottom so container-offsets aren't able to be respected
    // otherwise the layer would detach from its trigger
    tools.scrollContainer(1025, 940);

    /**
     *
     *
     *                            -----------
     *                           |  trigger  |
     *              --------------------------------------------------------------
     *                                            |                      |
     *                                            |         layer        |
     *                                            |                      |
     *                                             ----------------------
     *
     *
     */

    await tools.expectBounds({
      layerSide: "right",
      layer: {
        top: 118,
        left: 522,
        bottom: 358,
        right: 762,
        width: 240,
        height: 240
      },
      arrow: {
        top: 126,
        left: 506,
        bottom: 142,
        right: 522,
        width: 16,
        height: 16
      }
    });
  });

  // This test is exactly the same as above, except for the fact that now the trigger is bigger
  // and the layer smaller
  it("handles secondary offsets while preventing to detach the layer from the trigger when trigger is bigger", async () => {
    const tools = render({
      placement: "bottom-center",
      auto: true,
      possiblePlacements: ["bottom-center", "bottom-start", "bottom-end"],
      triggerIsBigger: true,
      overflowContainer: false
    });

    tools.clickTrigger();

    // scroll to bottom so layer is positioned all the way to the top
    tools.scrollContainer(950, 700);
    await tools.expectBounds({
      layerSide: "bottom",
      layer: {
        top: 332,
        left: 650,
        bottom: 382,
        right: 750,
        width: 100,
        height: 50
      },
      arrow: {
        top: 316,
        left: 692,
        bottom: 332,
        right: 708,
        width: 16,
        height: 16
      }
    });

    // scroll to left so layer gets "pushed" to the left
    tools.scrollContainer(950, 420);
    await tools.expectBounds({
      layerSide: "bottom",
      layer: {
        top: 332,
        left: 884,
        bottom: 382,
        right: 984,
        width: 100,
        height: 50
      },
      arrow: {
        top: 316,
        left: 926,
        bottom: 332,
        right: 942,
        width: 16,
        height: 16
      }
    });

    // scroll to left so container-offsets aren't able to be respected
    // otherwise the layer would detach from its trigger
    tools.scrollContainer(950, 275);
    await tools.expectBounds({
      layerSide: "bottom",
      layer: {
        top: 332,
        left: 937,
        bottom: 382,
        right: 1037,
        width: 100,
        height: 50
      },
      arrow: {
        top: 316,
        left: 1013,
        bottom: 332,
        right: 1029,
        width: 16,
        height: 16
      }
    });

    // scroll to right so container-offsets aren't able to be respected
    // otherwise the layer would detach from its trigger
    tools.scrollContainer(950, 1120);
    await tools.expectBounds({
      layerSide: "bottom",
      layer: {
        top: 332,
        left: 368,
        bottom: 382,
        right: 468,
        width: 100,
        height: 50
      },
      arrow: {
        top: 316,
        left: 376,
        bottom: 332,
        right: 392,
        width: 16,
        height: 16
      }
    });

    // Let's try the same with the layer on the right hand side
    tools.reRender({
      placement: "right-center",
      auto: true,
      possiblePlacements: ["right-center", "right-start", "right-end"],
      triggerIsBigger: true,
      overflowContainer: false
    });

    // scroll to right so layer is positioned all the way to the left
    tools.scrollContainer(700, 940);
    await tools.expectBounds({
      layerSide: "right",
      layer: {
        top: 425,
        left: 592,
        bottom: 475,
        right: 692,
        width: 100,
        height: 50
      },
      arrow: {
        top: 442,
        left: 576,
        bottom: 458,
        right: 592,
        width: 16,
        height: 16
      }
    });

    // scroll to top so layer gets "pushed" to the top
    tools.scrollContainer(375, 940);
    await tools.expectBounds({
      layerSide: "right",
      layer: {
        top: 684,
        left: 592,
        bottom: 734,
        right: 692,
        width: 100,
        height: 50
      },
      arrow: {
        top: 701,
        left: 576,
        bottom: 717,
        right: 592,
        width: 16,
        height: 16
      }
    });

    // scroll to top so container-offsets aren't able to be respected
    // otherwise the layer would detach from its trigger
    tools.scrollContainer(275, 940);
    await tools.expectBounds({
      layerSide: "right",
      layer: {
        top: 737,
        left: 592,
        bottom: 787,
        right: 692,
        width: 100,
        height: 50
      },
      arrow: {
        top: 763,
        left: 576,
        bottom: 779,
        right: 592,
        width: 16,
        height: 16
      }
    });

    // scroll to bottom so container-offsets aren't able to be respected
    // otherwise the layer would detach from its trigger
    tools.scrollContainer(1125, 940);
    await tools.expectBounds({
      layerSide: "right",
      layer: {
        top: 113,
        left: 592,
        bottom: 163,
        right: 692,
        width: 100,
        height: 50
      },
      arrow: {
        top: 121,
        left: 576,
        bottom: 137,
        right: 592,
        width: 16,
        height: 16
      }
    });
  });

  it("react to scroll events of the window", async () => {
    const tools = render({
      placement: "top-center",
      auto: true,
      overflowContainer: false
    });
    tools.clickTrigger();

    // scroll window so that the layer has to reposition to the bottom side
    tools.scrollWindow(170, 0);

    await tools.expectBounds({
      layerSide: "bottom",
      layer: {
        top: 317,
        left: 580,
        bottom: 557,
        right: 820,
        width: 240,
        height: 240
      },
      arrow: {
        top: 301,
        left: 692,
        bottom: 317,
        right: 708,
        width: 16,
        height: 16
      }
    });
  });

  it("snaps between placements when auto & snap are enabled", async () => {
    const tools = render({
      placement: "top-center",
      auto: true,
      overflowContainer: false,
      snap: true
    });
    tools.clickTrigger();

    tools.scrollContainer(700, 900);
    await tools.expectBounds({
      layerSide: "top",
      layer: {
        top: 173,
        left: 450,
        bottom: 413,
        right: 690,
        width: 240,
        height: 240
      },
      arrow: {
        top: 413,
        left: 492,
        bottom: 429,
        right: 508,
        width: 16,
        height: 16
      }
    });

    tools.scrollContainer(700, 530);
    await tools.expectBounds({
      layerSide: "top",
      layer: {
        top: 173,
        left: 680,
        bottom: 413,
        right: 920,
        width: 240,
        height: 240
      },
      arrow: {
        top: 413,
        left: 862,
        bottom: 429,
        right: 878,
        width: 16,
        height: 16
      }
    });
  });

  it("prioritizes correctly based on prefer-y", async () => {
    const tools = render({
      placement: "left-center",
      auto: true,
      overflowContainer: false,
      preferY: "bottom" // default
    });
    tools.clickTrigger();

    // since left side did not fit, expect the layer to reside on the bottom
    await tools.expectBounds({
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
    });

    tools.reRender({
      placement: "left-center",
      auto: true,
      overflowContainer: false,
      preferY: "top" // Now, we change this
    });

    // since we prefer the top-side over bottom, we expect the layer to be positioned on the top side
    await tools.expectBounds({
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
    });
  });

  it("reacts to the layerDimensionsProp", async () => {
    const tools = render({
      placement: "left-center",
      auto: true,
      overflowContainer: false
    });
    tools.clickTrigger();

    // we expect the layer to just not fit on the left side
    await tools.expectBounds({
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
    });

    tools.reRender({
      placement: "left-center",
      auto: true,
      overflowContainer: false,
      layerDimensions: () => ({
        height: constants.layerSize,
        width: constants.layerSize - 80 // we're tricking here, so that it seems the layer is smaller
      })
    });

    // now it will place the layer on the left side
    await tools.expectBounds({
      layerSide: "left",
      layer: {
        top: 330,
        left: 478,
        bottom: 570,
        right: 718,
        width: 240,
        height: 240
      },
      arrow: {
        top: 442,
        left: 718,
        bottom: 458,
        right: 734,
        width: 16,
        height: 16
      }
    });
  });
});
