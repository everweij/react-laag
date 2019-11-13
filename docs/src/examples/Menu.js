import React from "react";
import styled, { css } from "styled-components";
import { motion } from "framer-motion";
import { Arrow } from "react-laag";

const MenuBase = styled(motion.ul)`
  transition: color 0.15s, background-color 0.15s, width 0.25s ease-in-out;
  position: absolute;
  width: 160px;
  padding: 4px 0px;
  list-style: none;
  background-clip: padding-box;
  border-radius: 4px;
  box-shadow: 0 1px 15px rgba(27, 31, 35, 0.15);
  margin: 0;
  background-color: white;
  color: #333;
  border: 1px solid rgba(27, 31, 35, 0.15);
`;

const Menu = React.forwardRef(function Menu(
  { className, style, arrowStyle, layerSide, children, ...rest },
  ref
) {
  return (
    <MenuBase
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, scale: 0.85 }} // animate from
      animate={{ opacity: 1, scale: 1 }} // animate to
      exit={{ opacity: 0, scale: 0.85 }} // animate exit
      transition={{
        type: "spring",
        stiffness: 800,
        damping: 35,
        staggerChildren: false
      }}
      {...rest}
    >
      {children}

      {arrowStyle && (
        <Arrow
          style={arrowStyle}
          layerSide={layerSide}
          borderColor="rgba(27, 31, 35, 0.15)"
          borderWidth={1}
          roundness={0.5}
        />
      )}
    </MenuBase>
  );
});

const nestedStyle = css`
  &::after {
    content: "►";
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 10px;
  }
`;

const ItemBase = styled.li`
  list-style: none;
  display: block;
  padding: 4px 8px 4px 16px;
  overflow: hidden;
  color: ${p => (p.isOpen ? "white" : "inherit")};
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  line-height: 1.5;
  cursor: pointer;
  position: relative;

  background-color: ${p => (p.isOpen ? "#359ed0" : "transparent")};

  &:hover {
    background-color: #359ed0;
    color: white;
  }

  ${p => p.nested && nestedStyle}
`;

export const MenuItem = React.forwardRef(function MenuItem(
  { className, style, children, isOpen, nested, ...rest },
  ref
) {
  return (
    <ItemBase
      ref={ref}
      className={className}
      style={style}
      isOpen={isOpen}
      nested={nested}
      {...rest}
    >
      {children}
    </ItemBase>
  );
});

export default Menu;
