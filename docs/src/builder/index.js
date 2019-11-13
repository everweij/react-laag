import React from "react";
import styled from "styled-components";

import Left from "./Left";
import NavTop from "../components/NavTop";

import Meta from "../components/Meta";

import { LEFT_WIDTH } from "../components/constants";
import ScrollBox from "./ScrollBox";
import Preview from "./Preview";
import CodeHighlight from "./CodeHighlight";

const Body = styled.div`
  position: absolute;
  top: 0;
  height: 100vh;
  left: ${LEFT_WIDTH}px;
  right: 0;
  display: flex;
`;

const Center = styled.div`
  /* background-color: #d3dbe4; */
  background-color: white;
  height: 100%;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Right = styled.div`
  background: #222e3a;
  height: 100%;
  max-height: 100%;
  box-sizing: border-box;
  width: 50%;
  padding-top: 100px;
  overflow: auto;
`;

export default function Builder() {
  const [state, setState] = React.useState({
    width: 150,
    height: 100,
    backgroundColor: "#e7f5ff",
    borderColor: "#d8d6d9",
    borderWidth: 1,
    arrow: true,
    arrowSize: 8,
    arrowAngle: 45,
    arrowRoundness: 0.5,
    anchor: "TOP_CENTER",
    possibleAnchors: [
      "TOP_CENTER",
      "TOP_LEFT",
      "TOP_RIGHT",
      "LEFT_TOP",
      "LEFT_CENTER",
      "LEFT_BOTTOM",
      "BOTTOM_LEFT",
      "BOTTOM_CENTER",
      "BOTTOM_RIGHT",
      "RIGHT_TOP",
      "RIGHT_CENTER",
      "RIGHT_BOTTOM"
    ],
    autoAdjust: true,
    snapToAnchor: false,
    preferX: "RIGHT",
    preferY: "BOTTOM",
    triggerOffset: 10,
    scrollOffset: 10,
    fixed: false,
    closeOnOutsideClick: false,
    closeOnDisappear: false,
    transition: false,
    duration: 250,
    opacity: true,
    scale: true
  });
  return (
    <>
      <Meta title={"Builder"} pageUrl={"/builder/"} />
      <main>
        <NavTop />
        <Left state={state} setState={setState} />

        <Body>
          <Center>
            <ScrollBox>
              <Preview state={state} />
            </ScrollBox>
          </Center>
          <Right>
            <CodeHighlight state={state} />
          </Right>
        </Body>
        <div style={{ height: 200 }} />
      </main>
    </>
  );
}
