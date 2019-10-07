import * as React from "react";

type Props<T> = {
  tag: T;
  parentElement?: HTMLElement;
};

// created a new dom element and attaches it to the parent element
function useCreateDomElement<T extends keyof ElementTagNameMap>({
  tag,
  parentElement = document.body
}: Props<T>) {
  const [domElement, setDomElement] = React.useState<
    null | ElementTagNameMap[T]
  >(null);

  React.useEffect(() => {
    const element = document.createElement(tag);

    parentElement.appendChild(element);
    setDomElement(element as any);

    return () => {
      parentElement.removeChild(element);
    };
  }, [tag, parentElement]);

  return domElement;
}

export default useCreateDomElement;
