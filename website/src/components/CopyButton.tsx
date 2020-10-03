import * as React from "react";
import styled from "styled-components";
import { useLayer } from "../../../src";

import { Copy } from "@styled-icons/boxicons-solid/Copy";
import copy from "copy-text-to-clipboard";
import NotifyTip from "./NotifyTip";
import { mergeRefs } from "../../../src/util";

const CopyButtonBase = styled.button`
  color: #b5799f;
  width: 32px;
  height: 32px;
  border: 0;
  box-shadow: 0;
  background-color: white;
  outline: 0;
  /* border-radius: 3px; */
  background-image: linear-gradient(
    -180deg,
    #ffffff 0%,
    #ffebf9 4%,
    #ffeaf8 13%,
    #efdbe9 78%,
    #e2bed6 98%,
    #804a6e 100%
  );
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.13);
  cursor: pointer;

  :hover {
    color: #88436f;
    filter: brightness(0.97);
  }
  :active {
    color: #88436f;
    filter: brightness(0.92);
  }
`;

type CopyButtonProps = {
  text: string;
} & React.ComponentPropsWithoutRef<"button">;

const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  function CopyButton({ text, ...rest }, ref) {
    const [showCopied, setShowCopied] = React.useState(false);

    const { triggerProps, layerProps, renderLayer } = useLayer({
      isOpen: showCopied,
      placement: "bottom-center",
      triggerOffset: 8,
      auto: true
    });

    async function copyToClipboard() {
      try {
        copy(text);

        if (!showCopied) {
          setShowCopied(true);

          setTimeout(() => {
            setShowCopied(false);
          }, 1000);
        }
      } catch (e) {
        setShowCopied(false);
      }
    }

    return (
      <>
        <CopyButtonBase
          ref={mergeRefs(ref, triggerProps.ref)}
          onClick={copyToClipboard}
          aria-label="copy"
          {...rest}
        >
          <Copy size={16} />
        </CopyButtonBase>
        {renderLayer(
          <NotifyTip show={showCopied} {...layerProps}>
            Copied to clipboard!
          </NotifyTip>
        )}
      </>
    );
  }
);

export default CopyButton;
