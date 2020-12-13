import styled from "styled-components";
import { media } from "../theme";

const PrimaryButton = styled.a`
  user-select: none;
  text-decoration: none;
  background-image: linear-gradient(
    -180deg,
    #d9ffed 0%,
    #a1d2bb 4%,
    #8ecbb5 14%,
    #66b699 78%,
    #5ea289 98%,
    #48876f 100%
  );
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.13);
  border-radius: 3px;
  font-size: 14px;
  padding: 10px 16px;
  color: white;
  font-weight: 700;
  letter-spacing: 0.1px;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
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

export default PrimaryButton;
