import React from "react";

import NavTop from "../NavTop";
import Body from "../Body";

import Meta from "../Meta";

export default function Docs({ children, pageUrl, title }) {
  return (
    <>
      <Meta pageUrl={pageUrl} title={title} />
      <main>
        <NavTop />
        <Body noPadding>{children}</Body>
        <div style={{ height: 200 }} />
      </main>
    </>
  );
}
