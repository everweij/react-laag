import * as React from "react";

function useOnWindowResize(
  onResize: (event: FocusEvent) => void,
  trackResize = true
) {
  React.useEffect(() => {
    if (!trackResize) {
      return;
    }

    const handleResize: any = onResize;

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [onResize, trackResize]);
}

export default useOnWindowResize;
