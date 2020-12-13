import styled from "styled-components";

export const Input = styled.input`
  transition: border-color 0.1s ease-in-out;
  height: 42px;
  width: 100%;
  border: 1px solid #cccccc;
  border-radius: 4px;
  box-shadow: none;
  appearance: none;
  font-size: 14px;
  box-shadow: none;
  background-color: white;
  padding: 0px 16px;
  outline: 0;
  font-family: inherit;

  &:focus {
    border: 1px solid #8c8c8c;
  }
`;
