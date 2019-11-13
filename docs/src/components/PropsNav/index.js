import React from "react";
import styled from "styled-components";

import { TOP_HEIGHT, CONTENT_TOP, PROP_NAV_WIDTH } from "../constants";

import media from "styled-media-query";

import field from "../../images/field.svg";

const MARGIN = 24;

const Base = styled.aside`
  position: fixed;
  top: ${TOP_HEIGHT + CONTENT_TOP}px;
  right: ${MARGIN}px;

  width: ${PROP_NAV_WIDTH - MARGIN * 2}px;

  ${media.lessThan("1124px")`
    display: none;
  `}
`;

const Title = styled.h3`
  margin: 0;
  font-weight: 700;
  font-size: 18px;
  color: var(--text);
  margin-bottom: 12px;
`;

const Items = styled.ul`
  padding: 0;
  margin: 0;
`;

const Item = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 4px;

  color: var(--lighter);

  &:hover {
    color: black;
    text-decoration: underline;
  }

  & > img {
    margin-right: 12px;
  }
`;

export default function PropNav({ items }) {
  // const [activeId, setActiveId] = React.useState(null);
  // React.useEffect(() => {
  //   const elements = items.map(item => document.getElementById(item.id));

  //   const observer = new IntersectionObserver(
  //     entries => {
  //       const entry = entries[0];

  //       if (!entry) {
  //         return;
  //       }

  //       if (entry.isIntersecting) {
  //         const id = entry.target.id;
  //         setActiveId(id);
  //       }
  //     },
  //     { rootMargin: `-${TOP_HEIGHT}px 0px 0px 0px`, threshold: 0 }
  //   );

  //   elements.forEach(element => observer.observe(element));

  //   return () => {
  //     observer.disconnect();
  //   };
  // }, []);

  return (
    <Base>
      <Title>Props</Title>
      <Items>
        {items.map(item => {
          return (
            <Item
              key={item.id}
              onClick={() => {
                const el = document.getElementById(item.id);

                window.scrollTo({ top: el.offsetTop - 100 });
              }}
              // style={{ fontWeight: activeId === item.id ? 700 : 400 }}
            >
              <img alt="field" src={field} />
              {item.title}
            </Item>
          );
        })}
      </Items>
    </Base>
  );
}
