import * as React from "react";
import styled from "styled-components";
import { Arrow } from "../../../src";
import { colors, media } from "../theme";
import useMedia from "../useMedia";

const Base = styled.div`
  position: relative;
  background: #fbfbfb;
  box-shadow: 15px 16px 50px 0 rgba(110, 26, 82, 0.55);
  max-width: 356px;
  width: 100%;
  padding: 48px;
  color: ${colors.text};
  margin-top: 48px;
  border-radius: 4px;

  h2 {
    text-align: center;
    margin-top: 0;
    margin-bottom: 24px;
  }

  @media ${media.tablet} {
    border-radius: 8px;
  }

  @media ${media.desktop} {
    margin-top: 0px;
    position: absolute;
    left: calc(100% + 56px);
    top: 50%;
    transform: translateY(-50%);
  }
`;

const ItemBase = styled.li`
  display: flex;

  > *:first-child {
    font-style: normal;
    font-size: 20px;
    margin-right: 16px;
  }
  > *:last-child {
    flex: 1;
  }

  h3 {
    font-family: "Noto Sans";
    font-size: 16px;
    font-weight: 700;
    margin: 0;
    margin-bottom: 6px;
    color: #232022;
  }

  p {
    font-size: 14px;
    color: #484848;
    margin: 0;
  }
`;

type ItemProps = {
  icon: string;
  title: string;
  children: string;
};

function Item({ icon, title, children }: ItemProps) {
  return (
    <ItemBase>
      <i>{icon}</i>
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </ItemBase>
  );
}

const Items = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  > *:not(:last-child) {
    margin-bottom: 24px;
  }
`;

function Features() {
  const isBottom = useMedia(1275);

  return (
    <Base>
      <h2>Features</h2>
      <Items>
        <Item icon="📦" title="Lightweight">
          Only 6kb minified & gzipped / tree-shakable / no dependencies
        </Item>
        <Item icon="🛠" title="Headless UI">
          We do the positioning, you do the rest. You maintain full control over
          the look and feel.
        </Item>
        <Item icon="🚀" title="Fast">
          Optimized for performance / no scroll lag whatsoever
        </Item>
        <Item icon="🏗" title="Simple & flexible">
          Comes with sensible defaults out of the box, but you can tweak things
          to your liking
        </Item>
      </Items>
      <Arrow
        backgroundColor="#fbfbfb"
        layerSide={isBottom ? "bottom" : "right"}
        size={16}
        roundness={0.8}
        style={
          isBottom
            ? { position: "absolute", bottom: "100%", left: "50%" }
            : { position: "absolute", top: "50%", right: "100%" }
        }
      />
    </Base>
  );
}

export default Features;
