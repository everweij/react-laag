import * as React from "react";
import styled, { css } from "styled-components";
import { motion, HTMLMotionProps } from "framer-motion";
import { Arrow, ArrowProps } from "react-laag";

const MenuBase = styled(motion.ul)`
  transition: color 0.15s, background-color 0.15s;
  position: absolute;
  min-width: 160px;
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

type MenuProps = {
  arrowProps?: ArrowProps;
} & HTMLMotionProps<"ul">;

export const Menu = React.forwardRef<HTMLUListElement, MenuProps>(function Menu(
  { children, arrowProps, ...rest },
  ref
) {
  return (
    <MenuBase
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }} // animate from
      animate={{ opacity: 1, scale: 1 }} // animate to
      exit={{ opacity: 0, scale: 0.85 }} // animate exit
      transition={{
        type: "spring",
        stiffness: 800,
        damping: 35
      }}
      {...rest}
    >
      {children}

      {arrowProps && (
        <Arrow
          {...arrowProps}
          borderColor="rgba(27, 31, 35, 0.15)"
          borderWidth={1}
          roundness={0.5}
        />
      )}
    </MenuBase>
  );
});

export const MenuItem = styled.li<{
  $isOpen?: boolean;
  $nested?: boolean;
  $highlight?: boolean;
}>`
  list-style: none;
  display: block;
  padding: 4px 8px 4px 16px;
  overflow: hidden;
  color: ${p => (p.$isOpen || p.$highlight ? "white" : "inherit")};
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  line-height: 1.5;
  cursor: pointer;
  position: relative;

  background-color: ${p =>
    p.$isOpen || p.$highlight ? "#359ed0" : "transparent"};

  &:hover {
    background-color: #359ed0;
    color: white;
  }

  ${p =>
    p.$nested &&
    css`
      &::after {
        content: "►";
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 10px;
      }
    `}
`;
