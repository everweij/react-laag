import * as React from "react";
import { useLayer, Arrow } from "react-laag";
import { TooltipBox, BG_COLOR, BORDER_COLOR } from "../../components/Tooltip";

function useSelection() {
  const ref = React.useRef<HTMLDivElement>(null!);

  const [range, setRange] = React.useState<Range | null>(null);

  React.useEffect(() => {
    function handleChange() {
      const selection = window.getSelection();
      if (
        !selection ||
        selection.isCollapsed ||
        !selection.containsNode(ref.current, true)
      ) {
        setRange(null);
        return;
      }

      setRange(selection.getRangeAt(0));
    }

    document.addEventListener("selectionchange", handleChange);
    return () => document.removeEventListener("selectionchange", handleChange);
  }, []);

  return { range, ref };
}

export function TextSelection() {
  const { range, ref } = useSelection();

  const isOpen = Boolean(range);

  const { renderLayer, layerProps, arrowProps } = useLayer({
    isOpen,
    overflowContainer: true,
    placement: "top-center",
    triggerOffset: 12,
    containerOffset: 16,
    arrowOffset: 16,
    trigger: {
      getBounds: () => range!.getBoundingClientRect()
    }
  });

  return (
    <>
      <div ref={ref}>
        A wonderful serenity has taken possession of my entire soul, like these
        sweet mornings of spring which I enjoy with my whole heart. I am alone,
        and feel the charm of existence in this spot, which was created for the
        bliss of souls like mine. I am so happy, my dear friend, so absorbed in
        the exquisite sense of mere tranquil existence, that I neglect my
        talents. I should be incapable of drawing a single stroke at the present
        moment; and yet I feel that I never was a greater artist than now. When,
        while the lovely valley teems with vapour around me, and the meridian
        sun strikes the upper surface of the impenetrable foliage of my trees,
        and but a few stray gleams steal into the inner sanctuary, I throw
        myself down among the tall grass by the trickling stream; and, as I lie
        close to the earth, a thousand unknown plants are noticed by me: when I
        hear the buzz of the little world among the stalks, and grow familiar
        with the countless indescribable forms of the insects and flies, then I
        feel the presence of the Almighty, who formed us in his own image, and
        the breath
      </div>
      {isOpen &&
        renderLayer(
          <TooltipBox {...layerProps}>
            {range?.toString().replace(/\s/g, "").length} characters
            <Arrow
              {...arrowProps}
              backgroundColor={BG_COLOR}
              borderColor={BORDER_COLOR}
              borderWidth={1}
              size={6}
            />
          </TooltipBox>
        )}
    </>
  );
}
