import React from "react";

import styled from "styled-components";

const Base = styled.div`
  padding: 16px 32px;
  position: relative;
  background-color: var(--greybg);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 16px;
  margin-bottom: 48px;

  &::before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 6px;
    background-color: var(--primary);
  }
`;

const Title = styled.div`
  color: var(--primary);
  text-transform: uppercase;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
`;

export default function Note({ children }) {
  return (
    <Base className="note">
      <Title>Note</Title>
      {children}
    </Base>
  );
}
