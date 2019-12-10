import useEvent from "./useEvent";

function useOnWindowResize(
  onResize: (event: Event) => void,
  environment?: Window,
  trackResize = true
) {
  useEvent(
    typeof environment !== "undefined" ? environment : null,
    "resize",
    onResize,
    trackResize
  );
}

export default useOnWindowResize;
