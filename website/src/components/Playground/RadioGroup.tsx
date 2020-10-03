import * as React from "react";
import styled from "styled-components";
import Radio from "./Radio";

const RadioGroupBase = styled.div`
  display: flex;
  margin-top: 6px;
`;

const RadioGroupItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;

  :not(:last-child) {
    margin-right: 8px;
  }

  input {
    margin-right: 4px;
  }

  div {
    cursor: default;
  }
`;

type RadioGroupProps = {
  items: { value: any; display: string }[];
  value: any;
  onChange: (value: string) => void;
  disabled?: boolean;
};

function RadioGroup({ items, value, onChange, disabled }: RadioGroupProps) {
  return (
    <RadioGroupBase>
      {items.map(item => {
        return (
          <RadioGroupItem
            key={item.value}
            onClick={() => {
              if (disabled) {
                return;
              }

              onChange(item.value);
            }}
          >
            <Radio
              style={{ marginRight: 4 }}
              disabled={disabled}
              value={item.value === value}
            />
            <div>{item.display}</div>
          </RadioGroupItem>
        );
      })}
    </RadioGroupBase>
  );
}

export default RadioGroup;
