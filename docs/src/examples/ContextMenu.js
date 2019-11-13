import * as React from "react";
import ResizeObserver from "resize-observer-polyfill";
import { useToggleLayer, ToggleLayer, useHover } from "react-laag";

import Menu, { MenuItem } from "./Menu";

const PLACEMENT = {
  anchor: "RIGHT_TOP",
  autoAdjust: true,
  snapToAnchor: true,
  triggerOffset: 0,
  possibleAnchors: ["LEFT_BOTTOM", "LEFT_TOP", "RIGHT_TOP", "RIGHT_BOTTOM"]
};

function renderItems(items, onClick, close) {
  return items.map(item => {
    if (item.children) {
      return (
        <NestedMenuItem
          key={item.value}
          title={item.title}
          onClick={onClick}
          items={item.children}
        />
      );
    }

    return (
      <MenuItem
        key={item.value}
        onClick={() => {
          if (close) {
            close();
          }
          onClick(item.value);
        }}
      >
        {item.title}
      </MenuItem>
    );
  });
}

function NestedMenuItem({ title, items, onClick }) {
  const [isOpen, hoverProps] = useHover({ delayEnter: 0, delayLeave: 100 });

  return (
    <ToggleLayer
      ResizeObserver={ResizeObserver}
      isOpen={isOpen}
      renderLayer={({ isOpen, layerProps, arrowStyle, layerSide }) =>
        isOpen && (
          <Menu
            {...layerProps}
            {...hoverProps}
            layerSide={layerSide}
            arrowStyle={arrowStyle}
          >
            {renderItems(items, onClick)}
          </Menu>
        )
      }
      placement={PLACEMENT}
      fixed
    >
      {({ triggerRef, isOpen }) => (
        <MenuItem
          onClick={evt => evt.preventDefault()}
          isOpen={isOpen}
          {...hoverProps}
          ref={triggerRef}
          nested
        >
          {title}
        </MenuItem>
      )}
    </ToggleLayer>
  );
}

function useContextMenu(items, onClick) {
  const [element, props] = useToggleLayer(
    ({ isOpen, layerProps, layerSide, close }) =>
      isOpen && (
        <Menu {...layerProps} layerSide={layerSide}>
          {renderItems(items, onClick, close)}
        </Menu>
      ),
    {
      placement: PLACEMENT,
      fixed: true,
      closeOnOutsideClick: true,
      ResizeObserver
    }
  );

  return [element, props.openFromContextMenuEvent];
}

function Name() {
  const [element, onContextMenu] = useContextMenu(
    [
      { value: "item1", title: "Item 1" },
      { value: "item2", title: "Item 2" },
      { value: "item3", title: "Item 3" },
      {
        value: "item4",
        title: "Item 4",
        children: [
          { value: "item4.1", title: "Item 4.1" },
          { value: "item4.2", title: "Item 4.2" },
          { value: "item4.3", title: "Item 4.3" },
          {
            value: "item4.4",
            title: "Item 4.4",
            children: [
              { value: "item4.4.1", title: "Item 4.4.1" },
              { value: "item4.4.2", title: "Item 4.4.2" },
              { value: "item4.4.3", title: "Item 4.4.3" }
            ]
          }
        ]
      }
    ],
    function onClick(value) {
      alert(`You've clicked: ${value}`);
    }
  );

  return (
    <div
      style={{
        maxWidth: 800,
        height: 400,
        backgroundColor: "var(--greybg)"
      }}
      onContextMenu={onContextMenu}
    >
      {element}
    </div>
  );
}

export default Name;
