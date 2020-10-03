import styled from "styled-components";

const Button = styled.button`
  appearance: none;
  padding: 12px 32px;
  background: linear-gradient(
    to bottom,
    var(--blue-400) 0%,
    var(--blue-500) 94%,
    var(--blue-500) 100%
  );
  color: white;
  border: 0;
  border-radius: 3px;
  box-shadow: none;
  font-weight: 400;

  :hover {
    background: linear-gradient(
      to bottom,
      var(--blue-500) 0%,
      var(--blue-600) 100%
    );
  }

  :not(:disabled) {
    cursor: pointer;
  }

  :disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :active {
    background: linear-gradient(
      to bottom,
      var(--blue-600) 0%,
      var(--blue-600) 100%
    );
  }
`;

export default Button;
