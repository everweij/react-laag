import styled from "styled-components";

export const Button = styled.button`
  position: relative;
  display: inline-block;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  background-repeat: repeat-x;
  background-position: -1px -1px;
  background-size: 110% 110%;
  color: #24292e;
  background-color: #eff3f6;
  background-image: linear-gradient(-180deg, #fafbfc, #eff3f6 90%);
  border: 1px solid rgba(27, 31, 35, 0.2);
  border-radius: 0.25em;
  appearance: none;
  padding: 4px 16px;
  outline: 0;
  min-width: 80px;

  &:hover {
    background-color: #e6ebf1;
    background-image: linear-gradient(-180deg, #f0f3f6, #e6ebf1 90%);
    background-position: -0.5em;
    border-color: rgba(27, 31, 35, 0.35);
  }
`;
