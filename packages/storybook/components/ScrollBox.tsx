import * as React from "react";
import { mergeRefs } from "react-laag";
import styled from "styled-components";

const WIDTH = 500;
const HEIGHT = 380;
const SCROLL_SIZE = 2000;

export const ScrollBoxBase = styled.div`
  position: relative;
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
  overflow: auto;
  background-color: #fdf7fb;
  margin-top: 32px;
  border: 1px solid #f7e0ef;
  border-radius: 4px;
  margin-bottom: 32px;
`;

export const ScrollBox = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactElement }
>(function ScrollBox({ children }, ref) {
  const scrollRef = React.useRef<HTMLDivElement>(null!);
  const childRef = React.useRef<HTMLElement>(null!);

  React.useEffect(() => {
    const element = scrollRef.current;
    const child = childRef.current;

    const childBox = child
      ? child.getBoundingClientRect()
      : { width: 200, height: 50 };

    element.scrollLeft = SCROLL_SIZE / 2 - WIDTH / 2 + childBox.width / 2;
    element.scrollTop = SCROLL_SIZE / 2 - HEIGHT / 2 + childBox.height / 2;
  }, []);

  return (
    <ScrollBoxBase ref={mergeRefs(scrollRef, ref)}>
      {React.cloneElement(children, {
        style: {
          position: "relative",
          left: SCROLL_SIZE / 2,
          top: SCROLL_SIZE / 2,
          ...children.props.style
        },
        ref: childRef
      })}
      <div style={{ width: SCROLL_SIZE, height: SCROLL_SIZE }} />
    </ScrollBoxBase>
  );
});
