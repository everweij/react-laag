import * as React from "react";
import { createPortal } from "react-dom";

import useCreateDomElement from "./useCreateDomElement";

type Props = {
  children: React.ReactNode;
  parentElement?: HTMLElement;
};

function Layer({ children, parentElement = document.body }: Props) {
  const element = useCreateDomElement({
    tag: "div",
    parentElement
  });

  if (!element) {
    return null;
  }

  return <>{createPortal(children, element)}</>;
}

export default Layer;
