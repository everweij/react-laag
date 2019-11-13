import React from "react";

import styled from "styled-components";

import field from "../../images/field.svg";

const Base = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 18px;

  & > img {
    position: absolute;
    top: 6px;
    left: -32px;
  }
`;

const Required = styled.div`
  text-transform: uppercase;
  font-weight: 400;
  font-size: 11px;
  background-color: #e3ecf7;
  color: #2b85d0;
  margin-left: 12px;
  padding: 4px 4px;
  border-radius: 2px;
  line-height: 1.15;
`;

const Experimental = styled.div`
  text-transform: uppercase;
  font-weight: 400;
  font-size: 11px;
  background-color: #e3f7ee;
  color: #2a6f66;
  margin-left: 12px;
  padding: 4px 4px;
  border-radius: 2px;
  line-height: 1.15;
`;

export default function PropTitle({
  icon,
  required,
  experimental,
  children,
  style
}) {
  const id = icon
    ? React.Children.toArray(children)[0].toLowerCase()
    : undefined;

  return (
    <Base id={id} className="prop" style={style}>
      {icon && <img alt="field" src={field} />}
      {children}
      {required && <Required>Required</Required>}
      {experimental && <Experimental>Experimental</Experimental>}
    </Base>
  );
}
