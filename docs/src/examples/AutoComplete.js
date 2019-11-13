import * as React from "react";
import styled from "styled-components";
import { ToggleLayer } from "react-laag";
import Downshift from "downshift";
import { motion, AnimatePresence } from "framer-motion";
import ResizeObserver from "resize-observer-polyfill";

import ScrollBox from "./ScrollBox";
import Input from "./Input";
import composeRefs from "./composeRefs";

const BORDER_RADIUS = 4;

const Menu = styled(motion.div)`
  margin: 0;
  padding: 4px 0px;
  list-style: none;
  background-color: white;
  border-width: 1px;
  border-style: solid;
  border-color: #8c8c8c;
  box-sizing: border-box;
  max-height: 300px;
  overflow: auto;
`;

const MenuItem = styled.li`
  color: #333;
  padding: 4px 16px;
  font-size: 14.8px;
  cursor: pointer;
`;

const items = [
  { value: "apple" },
  { value: "pear" },
  { value: "orange" },
  { value: "grape" },
  { value: "banana" }
];

const AutoComplete = React.forwardRef(function AutoComplete(
  { style, className },
  ref
) {
  return (
    <Downshift itemToString={item => (item ? item.value : "")}>
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem
      }) => (
        <div className={className} style={style}>
          <ToggleLayer
            ResizeObserver={ResizeObserver}
            isOpen={isOpen}
            placement={{
              anchor: "BOTTOM_LEFT",
              autoAdjust: true,
              snapToAnchor: true,
              possibleAnchors: ["BOTTOM_LEFT", "TOP_LEFT"]
            }}
            renderLayer={({ isOpen, layerProps, triggerRect, layerSide }) => {
              return (
                <AnimatePresence>
                  {isOpen ? (
                    <motion.div
                      ref={layerProps.ref}
                      style={{
                        width: triggerRect.width,
                        ...layerProps.style
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "spring",
                        damping: 30,
                        stiffness: 400
                      }}
                    >
                      <Menu
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        transition={{
                          type: "spring",
                          damping: 30,
                          stiffness: 400
                        }}
                        {...getMenuProps(
                          {
                            style: {
                              transformOrigin:
                                layerSide === "top" ? "bottom" : "top",
                              borderTopLeftRadius:
                                layerSide === "bottom" ? 0 : BORDER_RADIUS,
                              borderTopRightRadius:
                                layerSide === "bottom" ? 0 : BORDER_RADIUS,
                              borderBottomLeftRadius:
                                layerSide === "top" ? 0 : BORDER_RADIUS,
                              borderBottomRightRadius:
                                layerSide === "top" ? 0 : BORDER_RADIUS,
                              borderTopWidth: layerSide === "bottom" ? 0 : 1,
                              borderBottomWidth: layerSide === "top" ? 0 : 1
                            }
                          },
                          { suppressRefError: true }
                        )}
                      >
                        {items
                          .filter(
                            item =>
                              !inputValue || item.value.includes(inputValue)
                          )
                          .map((item, index) => (
                            <MenuItem
                              {...getItemProps({
                                key: item.value,
                                index,
                                item,
                                style: {
                                  backgroundColor:
                                    highlightedIndex === index
                                      ? "#f3f3f3"
                                      : "white",
                                  fontWeight:
                                    selectedItem === item ? "bold" : "normal"
                                }
                              })}
                            >
                              {item.value}
                            </MenuItem>
                          ))}
                      </Menu>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              );
            }}
          >
            {({ triggerRef, isOpen, layerSide }) => (
              <Input
                {...getInputProps({
                  ref: composeRefs(triggerRef, ref),
                  style: {
                    borderTopLeftRadius:
                      isOpen && layerSide === "top" ? 0 : BORDER_RADIUS,
                    borderTopRightRadius:
                      isOpen && layerSide === "top" ? 0 : BORDER_RADIUS,
                    borderBottomLeftRadius:
                      isOpen && layerSide === "bottom" ? 0 : BORDER_RADIUS,
                    borderBottomRightRadius:
                      isOpen && layerSide === "bottom" ? 0 : BORDER_RADIUS,
                    borderTopColor:
                      isOpen && layerSide === "top" ? "#eee" : undefined,
                    borderBottomColor:
                      isOpen && layerSide === "bottom" ? "#eee" : undefined
                  }
                })}
                placeholder="search fruit..."
              />
            )}
          </ToggleLayer>
        </div>
      )}
    </Downshift>
  );
});

function Example() {
  return (
    <div>
      <ScrollBox>
        <AutoComplete />
      </ScrollBox>
    </div>
  );
}

export default Example;
