import * as React from "react";
import styled, { css } from "styled-components";
import { PRIMARY, PRIMARY_2, BUTTON_SIZE } from "./constants";
import { Add } from "styled-icons/material/Add";

const buttonHover = css`
  &:hover {
    background-color: ${PRIMARY_2};
    transform: scale(1.03);
  }
`;

const ButtonBase = styled.button`
  width: ${BUTTON_SIZE}px;
  height: ${BUTTON_SIZE}px;
  color: white;
  border: none;
  background-color: ${p => (p.isOpen ? PRIMARY_2 : PRIMARY)};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: 0;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  transform: scale(${p => (p.isOpen ? 1.03 : 1)});

  ${p => !p.isOpen && buttonHover}

  & svg {
    transition: 0.25s ease-in-out;
    transform: rotate(${p => (p.isOpen ? 45 : 0)}deg);
  }
`;

const Button = React.forwardRef(function Button(
  { style, className, isOpen, onClick },
  ref
) {
  return (
    <ButtonBase
      ref={ref}
      style={style}
      className={className}
      isOpen={isOpen}
      onClick={onClick}
    >
      <Add size={28} />
    </ButtonBase>
  );
});

export default Button;
