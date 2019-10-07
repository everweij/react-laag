import React from "react";
import styled from "styled-components";
import media from "styled-media-query";

const Base = styled.nav`
  position: absolute;
  top: 0;
  left: -280px;
  width: 200px;

  ${media.lessThan("1480px")`
    position: static;
    margin-bottom: 32px;
    margin-top: -32px;
  `}

  border-radius: 4px;
  background-color: #f9fafb;
  padding: 16px;
`;

const List = styled.ul`
  margin: 0;
  padding: 0;

  & ul {
    padding-left: 16px;
  }

  & a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      color: black;
    }
  }
`;

const Item = styled.li`
  list-style: none;
  font-size: 16px;
  font-weight: bold;
  padding: 4px 0px;
`;

const SubItem = styled.li`
  list-style: none;
  font-weight: 400;
  font-size: 14px;
  padding: 4px 0px;
`;

export default function TableOfContents({ items }) {
  return (
    <Base>
      <List>
        {items.map(item => {
          return (
            item.title && (
              <Item key={item.url}>
                <a href={item.url}>{item.title}</a>
                {item.items && (
                  <List>
                    {item.items.map(item => {
                      return (
                        <SubItem key={item.url}>
                          <a href={item.url}>{item.title}</a>
                        </SubItem>
                      );
                    })}
                  </List>
                )}
              </Item>
            )
          );
        })}
      </List>
    </Base>
  );
}
