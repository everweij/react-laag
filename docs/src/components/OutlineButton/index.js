import React from "react";
import styled from "styled-components";

const Base = styled.button`
  position: relative;
  display: inline-block;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  color: #24292e;
  background-color: transparent;
  border: 1px solid rgba(27, 31, 35, 0.35);
  border-radius: 0.25em;
  appearance: none;
  padding: 8px 24px;
  outline: 0;

  &:hover {
    border-color: rgba(27, 31, 35, 0.7);
  }
`;

const OutlineButton = React.forwardRef(function OutlineButton(
  { className, style, children, onClick },
  ref
) {
  return (
    <Base className={className} style={style} ref={ref} onClick={onClick}>
      {children}
    </Base>
  );
});

export default OutlineButton;
