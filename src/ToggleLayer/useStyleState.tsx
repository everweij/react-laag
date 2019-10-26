import * as React from "react";

import { AnchorEnum, ResultingStyles, LayerSide } from "./types";
import { EMPTY_STYLE } from "./util";

export default function useStyleState(anchor: AnchorEnum) {
  const [INITIAL_STYLES] = React.useState<ResultingStyles>({
    layer: EMPTY_STYLE,
    arrow: EMPTY_STYLE,
    layerSide: anchor.split("_")[0].toLowerCase() as LayerSide
  });

  const [styles, setStyles] = React.useState<ResultingStyles>(INITIAL_STYLES);
  const lastStyles = React.useRef<ResultingStyles>(styles);

  return {
    styles,
    lastStyles,
    setStyles,
    resetLastStyles: () => {
      lastStyles.current = INITIAL_STYLES;
    }
  };
}
