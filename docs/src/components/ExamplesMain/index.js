import React from "react";

import NavLeft from "../ExamplesNav";
import NavTop from "../NavTop";
import Body from "../Body";

import Meta from "../Meta";

export default function Docs({ children, title, pageUrl }) {
  return (
    <>
      <Meta title={title} pageUrl={pageUrl} />
      <main className="examples">
        <NavTop />
        <NavLeft />

        <Body>
          <h1 style={{ marginTop: 0 }}>{title}</h1>
          {children}
        </Body>
        <div style={{ height: 200 }} />
      </main>
    </>
  );
}
