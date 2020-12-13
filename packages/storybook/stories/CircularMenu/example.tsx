import * as React from "react";
import { useLayer, mergeRefs, LayerSide } from "react-laag";
import { CONTAINER_SIZE, ITEM_SIZE, MARGIN_RIGHT } from "./constants";
import styled from "styled-components";
import { AnimatePresence } from "framer-motion";

import { Button } from "./Button";
import { MenuItem } from "./MenuItem";

/**
 * Icons
 */

import { Image } from "styled-icons/boxicons-regular";
import { PlayCircle as Video } from "styled-icons/boxicons-regular";
import { Music } from "styled-icons/boxicons-solid";
import { File } from "styled-icons/boxicons-regular";
import { LocationOn as Location } from "styled-icons/material";
import { Code } from "styled-icons/boxicons-regular";

const Menu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
`;

type Item = {
  icon: React.ElementType<any>;
  value: string;
  label: string;
};

const items: Item[] = [
  { icon: Image, value: "image", label: "Image" },
  { icon: Video, value: "video", label: "Video" },
  { icon: Music, value: "music", label: "Music" },
  { icon: File, value: "file", label: "File" },
  { icon: Location, value: "location", label: "Location" },
  { icon: Code, value: "code", label: "Code" }
];

export const CircularMenu = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(function CircularMenu(props, ref) {
  const [isOpen, setOpen] = React.useState(false);

  function getMenuDimensions(layerSide: LayerSide) {
    const centerSize = CONTAINER_SIZE + ITEM_SIZE;

    return {
      width:
        layerSide === "center"
          ? centerSize
          : ITEM_SIZE * items.length + (MARGIN_RIGHT * items.length - 1),
      height: layerSide === "center" ? centerSize : ITEM_SIZE
    };
  }

  const { renderLayer, triggerProps, layerProps, layerSide } = useLayer({
    isOpen,
    onOutsideClick: () => setOpen(false),
    overflowContainer: false,
    auto: true,
    snap: true,
    placement: "center",
    possiblePlacements: [
      "top-center",
      "bottom-center",
      "left-center",
      "right-center"
    ],
    triggerOffset: ITEM_SIZE / 2,
    containerOffset: 16,
    layerDimensions: getMenuDimensions
  });

  return (
    <>
      {renderLayer(
        <AnimatePresence>
          {isOpen && (
            <Menu
              ref={layerProps.ref}
              style={{
                ...layerProps.style,
                ...getMenuDimensions(layerSide)
              }}
            >
              {items.map(({ icon, label, value }, index) => (
                <MenuItem
                  key={value}
                  icon={icon}
                  label={label}
                  index={index}
                  nrOfItems={items.length}
                  layerSide={layerSide}
                />
              ))}
            </Menu>
          )}
        </AnimatePresence>
      )}
      <Button
        {...props}
        ref={mergeRefs(triggerProps.ref, ref)}
        isOpen={isOpen}
        onClick={() => setOpen(!isOpen)}
      />
    </>
  );
});
