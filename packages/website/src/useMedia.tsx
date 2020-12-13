import * as React from "react";

export default function useBreakpoint(maxPixels: number) {
  const [match, setMatch] = React.useState(
    typeof window !== "undefined"
      ? window.matchMedia(`(max-width: ${maxPixels}px)`).matches
      : false
  );

  React.useEffect(() => {
    const matcher = window.matchMedia(`(max-width: ${maxPixels}px)`);

    function onMatch(evt: MediaQueryListEvent) {
      setMatch(evt.matches);
    }

    matcher.addListener(onMatch);
    setMatch(window.matchMedia(`(max-width: ${maxPixels}px)`).matches);

    return () => {
      matcher.removeListener(onMatch);
    };
  }, [maxPixels]);

  return match;
}
