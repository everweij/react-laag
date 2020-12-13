import * as React from "react";
import { useLayer, mergeRefs } from "react-laag";
import styled, { css } from "styled-components";
import { Input as InputBase } from "../../components/Input";
import { MenuItem } from "../../components/Menu";
import { AnimatePresence, motion } from "framer-motion";
import { useCombobox } from "downshift";

type Side = "top" | "bottom";

const Menu = styled(motion.ul)<{ $side: Side }>`
  transition: color 0.15s, background-color 0.15s;
  min-width: 160px;
  padding: 4px 0px;
  list-style: none;
  background-clip: padding-box;
  box-sizing: border-box;
  border-radius: ${p =>
    (p.$side === "bottom" ? [0, 0, 4, 4] : [4, 4, 0, 0])
      .map(val => `${val}px`)
      .join(" ")};
  margin: 0;
  background-color: white;
  color: #333;
  border: 1px solid #8c8c8c;
  transform-origin: ${p => (p.$side === "top" ? "bottom" : "top")};
  ${p =>
    p.$side === "top"
      ? css`
          border-bottom: 0;
        `
      : css`
          border-top: 0;
        `};
`;

const Wrapper = styled.div`
  display: inline;
`;

const Input = styled(InputBase)<{ $side: Side; $isOpen: boolean }>`
  :focus {
    ${p =>
      p.$isOpen &&
      css`
        border-radius: ${(p.$side === "top" ? [0, 0, 4, 4] : [4, 4, 0, 0])
          .map(val => `${val}px`)
          .join(" ")};
        ${p.$side === "bottom"
          ? css`
              border-bottom: 1px solid #dddddd;
            `
          : css`
              border-top: 1px solid #dddddd;
            `};
      `}
  }
`;

const items: string[] = ["apple", "pear", "orange", "grape", "banana"];

export const Autocomplete = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<any>
>(function Autocomplete(props, ref) {
  const [inputItems, setInputItems] = React.useState(items);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        items.filter(item =>
          item.toLowerCase().startsWith(inputValue!.toLowerCase())
        )
      );
    }
  });

  const {
    renderLayer,
    triggerProps,
    layerProps,
    triggerBounds,
    layerSide
  } = useLayer({
    isOpen,
    overflowContainer: false,
    auto: true,
    snap: true,
    placement: "bottom-start",
    possiblePlacements: ["top-start", "bottom-start"],
    triggerOffset: 0,
    containerOffset: 16
  });

  return (
    <Wrapper {...getComboboxProps({ ref: ref as any, ...props })}>
      <Input
        {...getInputProps({
          style: { width: 200 },
          ref: mergeRefs(triggerProps.ref)
        })}
        placeholder="Search for a fruit..."
        $side={layerSide}
        $isOpen={isOpen && inputItems.length}
      />
      {renderLayer(
        <AnimatePresence>
          {isOpen && inputItems.length && (
            <Menu
              {...getMenuProps(layerProps)}
              style={{
                width: triggerBounds?.width ?? 200,
                ...layerProps.style
              }}
              $side={layerSide}
              initial={{ opacity: 0, scaleY: 0.75 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0.75 }}
              transition={{
                duration: 0.125
              }}
            >
              {inputItems.map((item, index) => (
                <MenuItem
                  key={`${item}${index}`}
                  $highlight={index === highlightedIndex}
                  {...getItemProps({ item, index })}
                >
                  {item}
                </MenuItem>
              ))}
            </Menu>
          )}
        </AnimatePresence>
      )}
    </Wrapper>
  );
});
