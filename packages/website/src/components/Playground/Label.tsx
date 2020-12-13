import * as React from "react";
import styled from "styled-components";
import WithTooltip from "../WithTooltip";
import { InfoCircle } from "@styled-icons/fa-solid/InfoCircle";

const LabelBase = styled.label`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 0px;

  :not(:first-of-type) {
    margin-top: 16px;
  }

  svg {
    margin-left: 4px;
  }
`;

type LabelProps = {
  children: string;
  info?: string;
} & React.ComponentPropsWithoutRef<"label">;

function Label({ children, info, ...rest }: LabelProps) {
  return (
    <LabelBase {...rest}>
      {children}
      {info && (
        <WithTooltip text={info} position="right" maxWidth={250}>
          <InfoCircle color="#545454" size={14} />
        </WithTooltip>
      )}
    </LabelBase>
  );
}

export default Label;
