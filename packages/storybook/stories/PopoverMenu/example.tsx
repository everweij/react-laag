import * as React from "react";
import { useLayer, mergeRefs } from "react-laag";
import { Button } from "../../components/Button";
import { MenuItem, Menu } from "../../components/Menu";
import { AnimatePresence } from "framer-motion";

export const PopoverMenu = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(function PopoverMenu(props, ref) {
  const [isOpen, setOpen] = React.useState(false);

  function close() {
    setOpen(false);
  }

  const { renderLayer, triggerProps, layerProps, arrowProps } = useLayer({
    isOpen,
    onOutsideClick: close,
    onDisappear: close,
    overflowContainer: false,
    auto: true,
    placement: "top-end",
    triggerOffset: 12,
    containerOffset: 16,
    arrowOffset: 16
  });

  function handleClick(item: string) {
    return function onClick() {
      alert(`You clicked on "${item}"`);
      close();
    };
  }

  return (
    <>
      {renderLayer(
        <AnimatePresence>
          {isOpen && (
            <Menu {...layerProps} arrowProps={arrowProps}>
              <MenuItem onClick={handleClick("Item 1")}>Item 1</MenuItem>
              <MenuItem onClick={handleClick("Item 2")}>Item 2</MenuItem>
              <MenuItem onClick={handleClick("Item 3")}>Item 3</MenuItem>
              <MenuItem onClick={handleClick("Item 4")}>Item 4</MenuItem>
            </Menu>
          )}
        </AnimatePresence>
      )}
      <Button
        {...props}
        ref={mergeRefs(triggerProps.ref, ref)}
        onClick={() => setOpen(!isOpen)}
      >
        {isOpen ? "Hide" : "Show"}
      </Button>
    </>
  );
});
