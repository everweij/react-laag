import * as React from "react";
import { LayerSide } from "../src";
import { IBounds } from "../src/Bounds";
import copyText from "copy-text-to-clipboard";

const baseStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  right: 0,
  border: "1px solid black",
  padding: 8,
  backgroundColor: "white"
};

const bold: React.CSSProperties = { fontWeight: "bold" };

type Bounds = {
  trigger: IBounds | null;
  layer: IBounds | null;
  arrow: IBounds | null;
};

function createBoundsFromElement(
  element: HTMLElement | SVGElement
): IBounds | null {
  if (!element || !element.isConnected) {
    return null;
  }

  const {
    top,
    left,
    bottom,
    right,
    width,
    height
  } = element.getBoundingClientRect();
  return {
    top,
    left,
    bottom,
    right,
    width,
    height
  };
}

function areBoundsEqual(prev: Bounds, next: Bounds): boolean {
  const keys: (keyof IBounds)[] = [
    "top",
    "bottom",
    "left",
    "right",
    "width",
    "height"
  ];
  for (const key of keys) {
    if (
      Object.keys(prev).some(type => prev[type]?.[key] !== next[type]?.[key])
    ) {
      return false;
    }
  }

  return true;
}

type InfoBoxProps = {
  renderCount: number;
  triggerRef: React.MutableRefObject<HTMLButtonElement>;
  layerRef: React.MutableRefObject<HTMLDivElement>;
  arrowRef: React.MutableRefObject<SVGElement>;
  layerSide: LayerSide;
};

export function InfoBox({
  renderCount,
  layerRef,
  triggerRef,
  arrowRef,
  layerSide
}: InfoBoxProps) {
  const boundsRef = React.useRef<Bounds>({
    layer: null,
    trigger: null,
    arrow: null
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    const prev = boundsRef.current;

    const next: Bounds = {
      trigger: createBoundsFromElement(triggerRef.current),
      layer: createBoundsFromElement(layerRef.current),
      arrow: createBoundsFromElement(arrowRef.current)
    };

    if (areBoundsEqual(prev, next)) {
      return;
    }

    for (const [type, bounds] of Object.entries(next)) {
      document.getElementById(`${type}-bounds`).innerHTML = JSON.stringify(
        bounds,
        null,
        2
      );
    }

    boundsRef.current = next;
  });

  function handleCopyExpectBounds() {
    const layer = createBoundsFromElement(layerRef.current);
    const arrow = createBoundsFromElement(arrowRef.current);

    const payload = `
await tools.expectBounds({
  layerSide: "${layerSide}",
  layer: {
    top: ${layer.top},
    left: ${layer.left},
    bottom: ${layer.bottom},
    right: ${layer.right},
    width: ${layer.width},
    height: ${layer.height}
  },
  arrow: {
    top: ${arrow.top},
    left: ${arrow.left},
    bottom: ${arrow.bottom},
    right: ${arrow.right},
    width: ${arrow.width},
    height: ${arrow.height}
  }
});
`;

    copyText(payload);
  }

  function handleCopyExpectBoundsProps() {
    const layer = createBoundsFromElement(layerRef.current);
    const arrow = createBoundsFromElement(arrowRef.current);

    const payload = `{
  layerSide: "${layerSide}",
  layer: {
    top: ${layer.top},
    left: ${layer.left},
    bottom: ${layer.bottom},
    right: ${layer.right},
    width: ${layer.width},
    height: ${layer.height}
  },
  arrow: {
    top: ${arrow.top},
    left: ${arrow.left},
    bottom: ${arrow.bottom},
    right: ${arrow.right},
    width: ${arrow.width},
    height: ${arrow.height}
  }
}
`;

    copyText(payload);
  }

  return (
    <div style={baseStyle}>
      <div id="scroll-container-offsets">
        <div style={bold}>scroll-container offsets</div>
        <div>
          Top: <span>0</span>
        </div>
        <div>
          Left: <span>0</span>
        </div>
      </div>
      <div>
        <span style={bold}>Render count: </span>
        <span data-testid="render-count">{renderCount}</span>
      </div>
      <div>
        <span style={bold}>layer-side: </span>
        <span data-testid="layer-side">{layerSide}</span>
      </div>
      <div>
        <div style={bold}>Trigger bounds</div>
        <pre id="trigger-bounds" data-testid="trigger-bounds"></pre>
      </div>
      <div>
        <div style={bold}>Layer bounds</div>
        <pre id="layer-bounds" data-testid="layer-bounds"></pre>
      </div>
      <div>
        <div style={bold}>Arrow Bounds</div>
        <pre id="arrow-bounds" data-testid="layer-bounds"></pre>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button onClick={handleCopyExpectBounds}>Copy for testing</button>
        <button onClick={handleCopyExpectBoundsProps}>
          Copy for testing (props)
        </button>
      </div>
    </div>
  );
}
