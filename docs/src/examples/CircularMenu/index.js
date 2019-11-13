import * as React from "react";
import { ToggleLayer } from "react-laag";
import ResizeObserver from "resize-observer-polyfill";

import { ITEM_SIZE, MARGIN_RIGHT } from "./constants";

import ScrollBox from "../ScrollBox";

/**
 * Icons
 */

import { Image } from "styled-icons/boxicons-regular/Image";
import { PlayCircle as Video } from "styled-icons/boxicons-regular/PlayCircle";
import { Music } from "styled-icons/boxicons-solid/Music";
import { File } from "styled-icons/boxicons-regular/File";
import { LocationOn as Location } from "styled-icons/material/LocationOn";
import { Code } from "styled-icons/boxicons-regular/Code";

/**
 * Components
 */

import Button from "./Button";
import Menu from "./Menu";

/**
 * Main
 */

function Example() {
  return (
    <ScrollBox>
      <div style={{ display: "inline-block" }}>
        <ToggleLayer
          ResizeObserver={ResizeObserver}
          placement={{
            anchor: "CENTER",
            autoAdjust: true,
            snapToAnchor: true,
            triggerOffset: 12,
            possibleAnchors: [
              "TOP_CENTER",
              "BOTTOM_CENTER",
              "LEFT_CENTER",
              "RIGHT_CENTER"
            ],
            layerDimensions: layerSide => {
              return {
                width:
                  layerSide === "center" ? 160 : (ITEM_SIZE + MARGIN_RIGHT) * 6,
                height: layerSide === "center" ? 140 : ITEM_SIZE
              };
            }
          }}
          renderLayer={({ isOpen, layerProps, close, layerSide }) => {
            return (
              <Menu
                close={close}
                ref={layerProps.ref}
                style={layerProps.style}
                layerSide={layerSide}
                isOpen={isOpen}
                items={[
                  { Icon: Image, value: "image", label: "Image" },
                  { Icon: Video, value: "video", label: "Video" },
                  { Icon: Music, value: "music", label: "Music" },
                  { Icon: File, value: "file", label: "File" },
                  { Icon: Location, value: "location", label: "Location" },
                  { Icon: Code, value: "code", label: "Code" }
                ]}
              />
            );
          }}
        >
          {({ triggerRef, toggle, isOpen }) => (
            <Button
              ref={triggerRef}
              onClick={toggle}
              isOpen={isOpen}
              // style={{ margin: 96 }}
            />
          )}
        </ToggleLayer>
      </div>
    </ScrollBox>
  );
}

export default Example;
