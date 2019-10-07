import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

function getArrowTranslate(layerSide) {
  let x = "-50%";
  let y = 0;

  const OFFSET = 3.5;
  if (layerSide === "left") {
    x = -OFFSET + "px";
    y = "-50%";
  } else if (layerSide === "right") {
    x = OFFSET + "px";
    y = "-50%";
  }

  const rotation = {
    top: 180,
    right: -90,
    left: 90,
    bottom: 0
  };

  return `translate(${x}, ${y}) rotate(${rotation[layerSide]}deg)`;
}

const outTransform = {
  top: { x: 0, y: -20 },
  left: { x: -20, y: 0 },
  bottom: { x: 0, y: 20 },
  right: { x: 20, y: 0 }
};

const MenuBase = styled.ul`
  transition: color 0.15s, background-color 0.15s, width 0.25s ease-in-out;
  position: absolute;
  width: 160px;
  padding: 4px 0px;
  list-style: none;
  background-clip: padding-box;
  border-radius: 4px;
  box-shadow: 0 1px 15px rgba(27, 31, 35, 0.15);
  margin: 0;
`;

const Arrow = props => (
  <svg width={14} height={7} {...props}>
    <g fill="none" fillRule="evenodd">
      <path
        fill="#CDCFD0"
        d="M7 .07v1.428l-5.55 5.5L0 6.982zM7 .07v1.428l5.55 5.5L14 6.982z"
      />
      <path fill="#FFF" d="M1.45 7L7 1.498 12.55 7z" />
    </g>
  </svg>
);

const Menu = React.forwardRef(function Menu(
  { className, style, arrowStyle, layerSide, children, dark, width },
  ref
) {
  return (
    <MenuBase
      ref={ref}
      as={motion.ul}
      className={className}
      style={{
        ...style,
        backgroundColor: dark ? "#444" : "#fff",
        color: dark ? "white" : "#333",
        border: `1px solid ${dark ? "transparent" : "rgba(27, 31, 35, 0.15)"}`,
        width
      }}
      initial={{ opacity: 0, ...outTransform[layerSide] }} // animate from
      animate={{ opacity: 1, x: 0, y: 0 }} // animate to
      exit={{ opacity: 0, ...outTransform[layerSide] }} // animate exit
      transition={{
        type: "spring",
        stiffness: 800,
        damping: 35
      }}
    >
      {children}

      {!dark && (
        <Arrow
          style={{
            ...arrowStyle,
            position: "absolute",
            transformOrigin: "center",
            transform: getArrowTranslate(layerSide)
          }}
        />
      )}
    </MenuBase>
  );
});

const ItemBase = styled.li`
  list-style: none;
  display: block;
  padding: 4px 8px 4px 16px;
  overflow: hidden;
  color: inherit;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  line-height: 1.5;
  cursor: pointer;

  &:hover {
    background-color: #359ed0;
    color: white;
  }
`;

function Item({ className, style, children }) {
  return (
    <ItemBase className={className} style={style}>
      {children}
    </ItemBase>
  );
}

Menu.Item = Item;

export default Menu;
