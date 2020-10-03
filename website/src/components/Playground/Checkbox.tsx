import * as React from "react";
import styled from "styled-components";

import { Checkmark as Check } from "@styled-icons/icomoon/Checkmark";
import { colors } from "../../theme";

const SIZE_DEFAULT = 16;
const SIZE_SMALL = 14;

const Base = styled.div<{ size: number; disabled?: boolean }>`
  width: ${p => p.size / 16}rem;
  height: ${p => p.size / 16}rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-style: solid;
  border-radius: 3px;
  flex-shrink: 0;
  opacity: ${p => (p.disabled ? 0.5 : 1)};
  transition: 0.15s ease-in-out;
`;

const IconWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type Props = {
  value?: boolean;
  small?: boolean;
  disabled?: boolean;
  variant?: "default" | "partial";
} & React.ComponentPropsWithoutRef<"div">;

export default React.forwardRef<HTMLDivElement, Props>(function Checkbox(
  { value, small, variant = "default", disabled, onClick, style, ...rest },
  ref
) {
  const [isHovered, setHovered] = React.useState(false);

  const selected = value;
  const size = small ? SIZE_SMALL : SIZE_DEFAULT;

  return (
    <Base
      ref={ref}
      size={size}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...style,
        backgroundColor: disabled
          ? colors["grey-200"]
          : selected
          ? colors["bg-dark"]
          : "#ffffff",
        borderColor: disabled
          ? colors["grey-300"]
          : selected
          ? colors["bg-dark"]
          : colors[`grey-${isHovered ? 700 : 500}`],
        color: isHovered && !selected ? colors["gradient-light"] : "#ffffff",
        cursor: disabled ? "default" : "pointer"
      }}
      role="checkbox"
      aria-checked={value}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      <IconWrapper
        style={{
          transform: `scale(${
            selected ? 1 : isHovered && !disabled ? 0.75 : 0
          })`
        }}
      >
        <Check
          style={{
            filter: value ? "drop-shadow(1px 1px 3px rgba(0,0,0,0.1))" : "",
            transform: `scale(0.6)`
          }}
          size={size}
        />
      </IconWrapper>
    </Base>
  );
});
