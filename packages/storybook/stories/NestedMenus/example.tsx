import * as React from "react";
import {
  useHover,
  useLayer,
  UseLayerOptions,
  useMousePositionAsTrigger
} from "react-laag";
import { AnimatePresence } from "framer-motion";
import { Menu, MenuItem } from "../../components/Menu";
import { ScrollBoxBase } from "../../components/ScrollBox";

type Item = {
  key: string;
  text: string;
  onClick?: () => void;
  items?: Item[];
};
const baseOptions: Omit<UseLayerOptions, "isOpen"> = {
  overflowContainer: true,
  auto: true,
  snap: true,
  placement: "right-start",
  possiblePlacements: ["right-start", "left-start"],
  triggerOffset: 8,
  containerOffset: 16,
  arrowOffset: 8
};

type NestedMenuItemProps = {
  item: Item;
};

function NestedMenuItem({ item }: NestedMenuItemProps) {
  const [isOpen, hoverProps, close] = useHover({
    delayEnter: 0,
    delayLeave: 100
  });

  const { renderLayer, triggerProps, layerProps, arrowProps } = useLayer({
    isOpen,
    ...baseOptions,
    onParentClose: close
  });

  return (
    <>
      {renderLayer(
        <AnimatePresence>
          {isOpen && (
            <Menu {...layerProps} {...hoverProps} arrowProps={arrowProps}>
              {renderItems(item.items!)}
            </Menu>
          )}
        </AnimatePresence>
      )}
      <MenuItem
        {...hoverProps}
        {...triggerProps}
        onClick={item.onClick}
        $isOpen={isOpen}
        $nested
      >
        {item.text}
      </MenuItem>
    </>
  );
}

function renderItems(items: Item[]) {
  return items.map(item => {
    if (item.items) {
      return <NestedMenuItem key={item.key} item={item} />;
    }

    return (
      <MenuItem key={item.key} onClick={item.onClick}>
        {item.text}
      </MenuItem>
    );
  });
}

type NestedMenusProps = {
  getItems: (close: () => void) => Item[];
};

function NestedMenus({ getItems }: NestedMenusProps) {
  const {
    hasMousePosition,
    resetMousePosition,
    handleMouseEvent,
    trigger
  } = useMousePositionAsTrigger();

  const { renderLayer, layerProps } = useLayer({
    isOpen: hasMousePosition,
    onOutsideClick: resetMousePosition,
    trigger,
    ...baseOptions
  });

  const items = getItems(resetMousePosition);

  return (
    <ScrollBoxBase
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onContextMenu={handleMouseEvent}
    >
      {renderLayer(
        <AnimatePresence>
          {hasMousePosition && (
            <Menu {...layerProps}>{renderItems(items)}</Menu>
          )}
        </AnimatePresence>
      )}
      <span>right-click in this box to open the menu</span>
    </ScrollBoxBase>
  );
}

export function Example() {
  return (
    <NestedMenus
      getItems={close => {
        function handleClick(item: string) {
          return () => {
            alert(`You've clicked on '${item}'`);
            close();
          };
        }

        return [
          { key: "item-1", text: "Item 1", onClick: handleClick("Item 1") },
          { key: "item-2", text: "Item 2", onClick: handleClick("Item 2") },
          { key: "item-3", text: "Item 3" },
          {
            key: "item-4",
            text: "Item 4",
            items: [
              {
                key: "item-4.1",
                text: "Item 4.1",
                onClick: handleClick("Item 4.1")
              },
              {
                key: "item-4.2",
                text: "Item 4.2",
                onClick: handleClick("Item 4.2")
              },
              { key: "item-4.3", text: "Item 4.3" },
              {
                key: "item-4.4",
                text: "Item 4.4",
                items: [
                  {
                    key: "item-4.4.1",
                    text: "Item 4.1.1",
                    onClick: handleClick("Item 4.4.1")
                  },
                  {
                    key: "item-4.4.2",
                    text: "Item 4.4.2",
                    onClick: handleClick("Item 4.4.2")
                  },
                  {
                    key: "item-4.4.3",
                    text: "Item 4.4.3"
                  },
                  {
                    key: "item-4.4.4",
                    text: "Item 4.4.4",
                    onClick: handleClick("Item 4.4.4")
                  }
                ]
              }
            ]
          }
        ];
      }}
    />
  );
}
