import React from "react";

import NavLeft from "../NavLeft";
import NavTop from "../NavTop";
import Body from "../Body";

import Meta from "../Meta";

import PropsNav from "../PropsNav";
import PropTitle from "../PropTitle";

export default function Docs({ children, propsNav, title, pageUrl }) {
  const c = React.Children.toArray(children);

  const propTitles = c.filter(
    child => child.type === PropTitle && child.props.icon
  );

  return (
    <>
      <Meta title={title} pageUrl={pageUrl} />
      <main className="docs">
        <NavTop />
        <NavLeft />
        {propsNav && (
          <PropsNav
            items={propTitles.map(child => {
              const id = React.Children.toArray(
                child.props.children
              )[0].toLowerCase();

              return { title: child.props.children, id };
            })}
          />
        )}

        <Body>{children}</Body>
        <div style={{ height: 200 }} />
      </main>
    </>
  );
}
