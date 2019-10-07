import React from "react";
import styled from "styled-components";

const Base = styled.div`
  color: var(--text);
  margin-bottom: 64px;
`;

const Required = styled.span`
  background-color: #e6eaef;
  font-size: 12px;
  font-weight: 400;
  margin-left: 16px;
  text-transform: uppercase;
  border-radius: 3px;
  padding: 2px 6px;
`;

const Label = styled.div`
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
  line-height: 1.2;
  color: #4a4a4a;
  margin-top: 6px;
`;

const Name = styled.span`
  font-weight: 700;
  font-size: 20px;
  display: flex;
  align-items: center;
  line-height: 1.4;
`;

const Obj = styled.span`
  color: ${p => (p.linked ? "rgb(255, 162, 95)" : "#128e89")};
  font-weight: ${p => (p.linked ? 500 : 400)};
`;

const Arg = styled.span`
  color: var(--text);
`;

const Bool = styled.span`
  color: #226eb1;
`;

const TypeBase = styled.div`
  color: #a9a9a9;
  margin-bottom: 16px;
  font-size: 16px;
`;

const Default = styled.div`
  font-size: 16px;
  margin-top: 12px;
  margin-bottom: 6px;
`;

const TypeBoxBase = styled.div`
  background-color: #f9fafb;
  padding: 16px 24px;
  margin-top: 32px;
  margin-bottom: 24px;
  font-size: 16px;
  border-radius: 4px;

  & ${Base} {
    margin-bottom: 32px;
  }

  & ${Name} {
    font-size: 16px;
  }

  & ${TypeBase} {
    font-size: 14px;
    margin-bottom: 2px;
  }

  & ${Default} {
    font-size: 14px;
    margin-top: 12px;
    margin-bottom: 6px;
  }
`;

const Misc = styled.div`
  color: #696969;
`;

const TypeBoxName = styled.div`
  color: rgb(255, 162, 95);
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 16px;
`;

function TypeBox({ name, props }) {
  return (
    <TypeBoxBase>
      <TypeBoxName>{name}</TypeBoxName>
      {props}
    </TypeBoxBase>
  );
}

const Ref = styled.code`
  background-color: #e9ecef;
  padding: 0 2px;
  border-radius: 3px;
  color: #4c4c4c;
`;

const Str = styled.div`
  color: #ff8227;
`;

export default function Prop({
  style,
  name,
  type,
  defaultValue,
  required,
  misc
}) {
  return (
    <Base style={style}>
      <Name>
        {name} {required && <Required>Required</Required>}
      </Name>

      <TypeBase>{type}</TypeBase>

      {defaultValue !== null && defaultValue !== undefined && (
        <Default>
          <Label>Default</Label>
          {defaultValue}
        </Default>
      )}

      <Misc>{misc}</Misc>
    </Base>
  );
}

Prop.TypeBox = TypeBox;
Prop.Obj = Obj;
Prop.Arg = Arg;
Prop.Ref = Ref;
Prop.Str = Str;
Prop.Bool = Bool;
Prop.Type = TypeBase;
Prop.Label = Label;
