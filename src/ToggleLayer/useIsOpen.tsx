import * as React from "react";
import { isSet } from "./util";

export default function useIsOpen(
  internal: boolean,
  external: boolean | undefined
) {
  const shouldOpenAfterMount = React.useRef<boolean>(external!);

  const isOpen = shouldOpenAfterMount.current
    ? false
    : isSet(external)
    ? external!
    : internal;

  const rerenderAfterMount = React.useState(false)[1];

  React.useEffect(() => {
    if (shouldOpenAfterMount.current) {
      shouldOpenAfterMount.current = false;
      rerenderAfterMount(true);
    }
  }, []);

  return isOpen;
}
