import useEvent from "./useEvent";

function useOnWindowResize(
  onResize: (event: Event) => void,
  trackResize = true
) {
  useEvent(
    typeof window !== "undefined" ? window : null,
    "resize",
    onResize,
    trackResize
  );
}

export default useOnWindowResize;
