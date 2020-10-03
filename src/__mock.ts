import * as React from "react";
import { SubjectsBounds, Offsets, Scroll, OffsetType } from "./types";
import { createEmptyBounds } from "./bounds";

export const SCROLL_CONTAINER_SIZE = {
  width: 1000,
  height: 1000
};

export const FILLER_SIZE = {
  width: 2000,
  height: 2000
};

export const TRIGGER_SIZE = {
  width: 100,
  height: 100
};

export const LAYER_SIZE = {
  width: 200,
  height: 200
};

export const SCROLL_CENTER = {
  left: FILLER_SIZE.width / 2 - SCROLL_CONTAINER_SIZE.width / 2,
  top: FILLER_SIZE.height / 2 - SCROLL_CONTAINER_SIZE.height / 2
};

export const CONTAINER_STYLE: React.CSSProperties = {
  backgroundColor: "lightgrey",
  position: "relative",
  top: 0,
  left: 0,
  width: SCROLL_CONTAINER_SIZE.width,
  height: SCROLL_CONTAINER_SIZE.height,
  overflow: "auto"
};

export const FILLER_STYLE: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  height: FILLER_SIZE.height,
  width: FILLER_SIZE.width
};

export const LAYER_STYLE: React.CSSProperties = {
  width: LAYER_SIZE.width,
  height: LAYER_SIZE.height,
  backgroundColor: "blue"
};

export const TRIGGER_OFFSET = {
  left: 500,
  top: 500
};

export const TRIGGER_STYLE: React.CSSProperties = {
  position: "relative",
  top: TRIGGER_OFFSET.top,
  left: TRIGGER_OFFSET.left,
  width: TRIGGER_SIZE.width,
  height: TRIGGER_SIZE.height,
  backgroundColor: "green"
};

export const PARENT = {
  top: 0,
  left: 0,
  bottom: SCROLL_CONTAINER_SIZE.height,
  right: SCROLL_CONTAINER_SIZE.width,
  height: SCROLL_CONTAINER_SIZE.height,
  width: SCROLL_CONTAINER_SIZE.width
};

export const SUBJECTS_BOUNDS: SubjectsBounds = {
  ARROW: createEmptyBounds(),
  PARENT,
  TRIGGER: {
    top: TRIGGER_OFFSET.top,
    left: TRIGGER_OFFSET.left,
    bottom: TRIGGER_SIZE.height + TRIGGER_OFFSET.top,
    right: TRIGGER_SIZE.width + TRIGGER_OFFSET.left,
    width: TRIGGER_SIZE.width,
    height: TRIGGER_SIZE.height
  },
  LAYER: {
    top: 1,
    left: 1,
    bottom: 1,
    right: 1,
    width: LAYER_SIZE.width,
    height: LAYER_SIZE.height
  },
  WINDOW: PARENT,
  SCROLL_CONTAINERS: [PARENT]
};

export const OFFSETS: Offsets = {
  [OffsetType.container]: 0,
  [OffsetType.secondary]: 0,
  [OffsetType.trigger]: 10,
  [OffsetType.arrow]: 0
};

export const NO_SCROLL: Scroll = {
  left: 0,
  top: 0
};
