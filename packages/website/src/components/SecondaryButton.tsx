import styled from "styled-components";
import { colors } from "../theme";
import { media } from "../theme";

const SecondaryButton = styled.a`
  user-select: none;
  text-decoration: none;
  background-image: linear-gradient(
    -180deg,
    #ffffff 0%,
    #ffebf9 4%,
    #ffeaf8 13%,
    #efdbe9 78%,
    #e2bed6 98%,
    #804a6e 100%
  );
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.13);
  border-radius: 3px;
  font-size: 14px;
  padding: 10px 16px;
  color: ${colors.text};
  font-weight: 700;
  letter-spacing: 0.1px;
  filter: saturate(1.3);
  cursor: pointer;

  :hover {
    filter: saturate(1.5) brightness(1.05);
  }

  :active {
    filter: saturate(1.5) brightness(1.1);
  }

  @media ${media.tablet} {
    padding: 12px 24px;
    font-size: 16px;
  }
`;

export default SecondaryButton;
