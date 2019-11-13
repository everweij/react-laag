import React from "react";
import styled from "styled-components";

import media from "styled-media-query";

import {
  LEFT_WIDTH,
  MAX_WIDTH,
  TOP_HEIGHT,
  CONTENT_TOP,
  PROP_NAV_WIDTH
} from "../constants";

const Base = styled.div`
  margin-left: ${LEFT_WIDTH}px;
  margin-right: ${PROP_NAV_WIDTH}px;
  padding-top: ${CONTENT_TOP + TOP_HEIGHT}px;

  ${media.lessThan("1124px")`
    margin-right: 0;
  `}
  ${media.lessThan("740px")`
    margin-left: 0;
  `}
`;

const Container = styled.div`
  padding: 0px 16px 0px 48px;
  max-width: ${MAX_WIDTH}px;
  margin: 0 auto;
`;

export default function Body({ children, noPadding }) {
  return (
    <Base
      style={{
        paddingTop: noPadding ? 0 : undefined
      }}
    >
      <Container style={{ paddingLeft: noPadding ? 16 : undefined }}>
        {children}
      </Container>
    </Base>
  );
}
