import * as React from "react";
import styled from "styled-components";
import Slider from "./Slider";

const RangeBase = styled.div`
  display: flex;
  align-items: center;

  input {
    flex: 1;
  }

  > *:last-child {
    margin-left: 8px;
    width: 2ch;
    font-size: 12px;
  }
`;

type RangeProps = {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  passive?: boolean;
};

function Range({ min, max, step, value, onChange, passive }: RangeProps) {
  return (
    <RangeBase>
      <Slider
        style={{ flex: 1 }}
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={onChange}
      />
      <div>{Math.round(value * 10) / 10}</div>
    </RangeBase>
  );
}

export default Range;
