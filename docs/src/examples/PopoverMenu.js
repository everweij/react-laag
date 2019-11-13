import * as React from "react";
import { ToggleLayer } from "react-laag";
import ResizeObserver from "resize-observer-polyfill";
import { AnimatePresence } from "framer-motion";

import Menu, { MenuItem } from "./Menu";
import Button from "./Button";
import composeRefs from "./composeRefs";

import ScrollBox from "./ScrollBox";
import Description from "./Description";

const PopoverMenu = React.forwardRef(function PopoverMenu(props, ref) {
  return (
    <ToggleLayer
      ResizeObserver={ResizeObserver}
      renderLayer={props => {
        function handleClick(item) {
          return function onClick() {
            alert(`You clicked on "${item}"`);
            props.close();
          };
        }

        return (
          <AnimatePresence>
            {props.isOpen ? (
              <Menu
                ref={props.layerProps.ref}
                style={props.layerProps.style}
                arrowStyle={props.arrowStyle}
                layerSide={props.layerSide}
              >
                <MenuItem onClick={handleClick("Item 1")}>Item 1</MenuItem>
                <MenuItem onClick={handleClick("Item 2")}>Item 2</MenuItem>
                <MenuItem onClick={handleClick("Item 3")}>Item 3</MenuItem>
                <MenuItem onClick={handleClick("Item 4")}>Item 4</MenuItem>
              </Menu>
            ) : null}
          </AnimatePresence>
        );
      }}
      closeOnOutsideClick
      closeOnDisappear="partial"
      placement={{
        anchor: "TOP_RIGHT",
        autoAdjust: true,
        snapToAnchor: false,
        triggerOffset: 12,
        scrollOffset: 16,
        preferX: "RIGHT"
      }}
    >
      {({ isOpen, triggerRef, toggle }) => (
        <Button
          ref={composeRefs(triggerRef, ref)}
          onClick={toggle}
          style={props.style}
        >
          {isOpen ? "Hide" : "Show"}
        </Button>
      )}
    </ToggleLayer>
  );
});

function Example() {
  return (
    <div>
      <ScrollBox>
        <PopoverMenu />
      </ScrollBox>
    </div>
  );
}

export default Example;
