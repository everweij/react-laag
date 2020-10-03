import * as React from "react";
import styled from "styled-components";
import { colors } from "../../theme";

const Base = styled.div<{ $disabled?: boolean }>`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid
    ${p => (p.$disabled ? colors["grey-300"] : colors["grey-500"])};
  background-color: ${p => (p.$disabled ? colors["grey-200"] : "white")};
  transition: 0.15s ease-in-out;

  &:hover {
    border: 1px solid ${colors["grey-700"]};
  }
`;

const Circle = styled.div<{ $disabled?: boolean }>`
  border-radius: 50%;
  width: 8px;
  height: 8px;
  background-color: ${p =>
    p.$disabled ? colors["grey-300"] : colors["bg-dark"]};
  transition: 0.15s ease-in-out;
`;

type Props = {
  value?: boolean;
  disabled?: boolean;
} & React.ComponentPropsWithoutRef<"div">;

function Radio({ onClick, value, style, disabled, ...rest }: Props) {
  return (
    <Base
      {...rest}
      style={{ ...style, cursor: disabled ? "default" : "pointer" }}
      $disabled={disabled}
      onClick={disabled ? undefined : onClick}
    >
      <Circle $disabled={disabled} style={{ opacity: value ? 1 : 0 }} />
    </Base>
  );
}

export default Radio;
