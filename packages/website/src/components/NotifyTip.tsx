import * as React from "react";
import styled from "styled-components";
import { Check } from "@styled-icons/boxicons-regular/Check";
import { colors } from "../theme";

const NotifyTipBase = styled.div<{ $show: boolean }>`
  background-color: ${colors.green};
  color: white;
  padding: 6px 12px;
  border-radius: 3px;
  box-shadow: 3px 5px 16px 0px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  font-size: 14px;
  opacity: ${p => (p.$show ? 1 : 0)};
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  pointer-events: none;
  transform-origin: top;
  transform: ${p =>
    p.$show ? `scale(1) translateY(0px)` : `scale(0.9) translateY(10px)`};

  > *:first-child {
    margin-right: 8px;
    color: white;
  }
`;

const NotifyTip = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { show: boolean }
>(function NotifyTip({ children, show, ...props }, ref) {
  return (
    <NotifyTipBase ref={ref} $show={show} {...props}>
      <Check size={20} />
      <div>{children}</div>
    </NotifyTipBase>
  );
});

export default NotifyTip;
