export default function compensateScrollbars(
  rect: ClientRect,
  clientWidth: number,
  clientHeight: number
) {
  const scrollbarWidth = rect.width - clientWidth;
  const scrollbarHeight = rect.height - clientHeight;

  return {
    left: rect.left,
    top: rect.top,
    width: rect.width - scrollbarWidth,
    right: rect.right - scrollbarWidth,
    height: rect.height - scrollbarHeight,
    bottom: rect.bottom - scrollbarHeight
  };
}
