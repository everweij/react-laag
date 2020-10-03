import React from "react";
import { useLayer, Arrow } from "../src";
import { useSelect } from "downshift";

import Button from "./components/Button";
import styled, { css } from "styled-components";

const Menu = styled.div`
  background-color: white;
  padding: 4px 0px;
  border-radius: 3px;
  border: 1px solid var(--grey-300);
  box-shadow: 0 0.9px 0.7px -10px rgba(0, 0, 0, 0.02),
    0 2.9px 2.5px -10px rgba(0, 0, 0, 0.03),
    0 13px 11px -10px rgba(0, 0, 0, 0.05);

  &[aria-hidden="true"] {
    opacity: 0;
    visibility: hidden;
  }
`;

const carretStyle = css`
  &::before {
    position: absolute;
    content: "◀︎";
    transform: translateY(-50%) rotate(180deg);
    right: 12px;
    top: 50%;
    font-size: 12px;
    color: var(--grey-700);
  }
`;

const MenuItem = styled.div<{ $nested?: boolean }>`
  padding: 4px 12px;
  font-size: 14.8px;
  position: relative;
  color: var(--grey-700);

  :not(:disabled)[aria-selected="true"] {
    background-color: var(--grey-200);
    color: var(--grey-900);
  }

  :not(:disabled) {
    cursor: pointer;
  }

  :disabled {
    color: var(--grey-500);
  }

  &[data-selected="true"] {
    color: var(--grey-900);
    font-weight: bold;
  }

  ${p => p.$nested && carretStyle}
`;

export default {
  title: "SelectMenu"
};

type Item = {
  key: string;
  display: string;
};

type SelectMenuProps = {
  children: React.ReactElement;
  items: Item[];
  selectedItem: Item | null;
  onSelect: (item: Item) => void;
};

function SelectMenu({
  children,
  items,
  selectedItem,
  onSelect
}: SelectMenuProps) {
  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getItemProps
  } = useSelect({
    items,
    selectedItem,
    itemToString: item => item?.display ?? null,
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        onSelect(selectedItem);
      }
    }
  });

  const {
    triggerProps,
    layerProps,
    renderLayer,
    triggerBounds,
    arrowProps
  } = useLayer({
    isOpen,
    placement: "bottom-start",
    auto: true,
    snap: true,
    possiblePlacements: ["bottom-start", "top-start"],
    triggerOffset: 6
  });

  return (
    <>
      {isOpen &&
        renderLayer(
          <Menu
            {...getMenuProps(layerProps)}
            aria-hidden={isOpen ? "false" : "true"}
            style={{
              ...layerProps.style,
              width: triggerBounds?.width ?? "auto"
            }}
          >
            {items.map((item, index) => (
              <MenuItem
                key={item.key}
                data-selected={item.key === selectedItem?.key}
                {...getItemProps({
                  item,
                  index
                })}
              >
                {item.display}
              </MenuItem>
            ))}
            <Arrow
              {...arrowProps}
              borderColor="var(--grey-300)"
              size={6}
              borderWidth={1}
            />
          </Menu>
        )}
      {React.cloneElement(children, getToggleButtonProps(triggerProps))}
    </>
  );
}

export function X() {
  const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);

  const [items] = React.useState([
    { key: "item1", display: "Item 1" },
    { key: "item2", display: "Item 2" },
    { key: "item3", display: "Item 3" },
    { key: "item4", display: "Item 4" }
  ]);

  return (
    <SelectMenu
      items={items}
      selectedItem={selectedItem}
      onSelect={setSelectedItem}
    >
      <Button>Select an item</Button>
    </SelectMenu>
  );
}
