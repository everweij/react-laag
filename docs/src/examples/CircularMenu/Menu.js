import * as React from "react";
import styled from "styled-components";
import { LayerSide } from "react-laag";

import { ITEM_SIZE, MENU_POSITION_MS } from "./constants";

import MenuItem from "./MenuItem";

import getTransform from "./menuItemPositioning";
import { useTransition } from "react-spring";

const MenuBase = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ItemWrapper = styled.div`
  position: relative;
  width: ${ITEM_SIZE}px;
  height: ${ITEM_SIZE}px;
`;

const Menu = React.forwardRef(function Menu(
  { style, close, layerSide, isOpen, items },
  ref
) {
  const [
    shouldTransitionShowHide,
    setShouldTransitionShowHide
  ] = React.useState(true);

  const lastLayerSide = React.useRef(layerSide);
  const lastIsOpen = React.useRef(isOpen);

  React.useEffect(() => {
    if (isOpen && !lastIsOpen.current) {
      // just opened
      setShouldTransitionShowHide(true);
    } else if (!isOpen && lastIsOpen.current) {
      // just closed
      setShouldTransitionShowHide(true);
    } else if (
      lastLayerSide.current !== layerSide &&
      shouldTransitionShowHide
    ) {
      // side changed
      setShouldTransitionShowHide(false);
    }

    // update latests refs
    lastLayerSide.current = layerSide;
    lastIsOpen.current = isOpen;
  }, [isOpen, layerSide]);

  const transitions = useTransition(isOpen ? items : [], item => item.value, {
    from: {
      x: layerSide === "center" ? 0 : 1
    },
    enter: {
      x: layerSide === "center" ? 1 : 2
    },
    update: {
      x: layerSide === "center" ? 1 : 2
    },
    leave: {
      x: layerSide === "center" ? 0 : 1
    },
    config: {
      tension: 1050,
      friction: 95,
      mass: 2.2
    },
    unique: true
  });

  return (
    <MenuBase
      ref={ref}
      style={{
        ...style,
        pointerEvents: "none",
        transition: !shouldTransitionShowHide
          ? `left ${MENU_POSITION_MS}ms, top ${MENU_POSITION_MS}ms`
          : "none"
      }}
      onClick={close}
    >
      <ItemWrapper>
        {transitions.map(({ item, key, props }, index) => (
          <MenuItem
            key={key}
            Icon={item.Icon}
            label={item.label}
            onClick={() => console.log(item.value)}
            style={{
              ...props,
              transform: getTransform(
                props.x,
                shouldTransitionShowHide,
                layerSide !== "center",
                index,
                items.length
              ),
              opacity: shouldTransitionShowHide
                ? props.x.interpolate(
                    layerSide === "center" ? [0, 0.2, 1] : [1, 1.2, 2],
                    [0, 0.8, 1]
                  )
                : 1
            }}
          />
        ))}
      </ItemWrapper>
    </MenuBase>
  );
});

export default Menu;
