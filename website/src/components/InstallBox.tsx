import * as React from "react";
import styled from "styled-components";

import WithTooltip from "./WithTooltip";
import CopyButton from "./CopyButton";
import { colors } from "../theme";

const Base = styled.div`
  padding-left: 24px;
  color: #e8d8e3;
  background-color: ${colors["bg-code"]};
  font-family: Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace;
  font-size: 14px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  overflow: hidden;

  > *:last-child {
    margin-left: 24px;
  }

  > :first-child::selection {
    background-color: pink;
  }
`;

type Props = {
  children: string;
};

function InstallBox({ children }: Props) {
  return (
    <Base>
      <div
        onClick={evt => {
          window.getSelection().selectAllChildren(evt.currentTarget);
        }}
      >
        {children}
      </div>
      <WithTooltip text="copy" position="top">
        {props => (
          <CopyButton {...props} text={children} style={{ borderRadius: 0 }} />
        )}
      </WithTooltip>
    </Base>
  );
}

export default InstallBox;
