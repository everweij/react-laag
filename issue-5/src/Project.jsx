import * as React from "react";
import { useState } from "react";
import { clamp } from "@popmotion/popcorn";
import { motion, useMotionValue } from "framer-motion";

import Step from "./Step";

const onTop = { zIndex: 1 };
const flat = { zIndex: 0, transition: { delay: 0.3 } };
const grab = {
  cursor: "grab",
  boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 4px -1px"
};
const grabbing = {
  scale: 1.02,
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px 0px",
  cursor: "grabbing"
};
export default function Project({ project, steps, moveTo, i }) {
  const [dragging, setDragging] = useState();
  const dragOriginY = useMotionValue(0);

  return (
    <motion.div
      className="project"
      initial={false}
      animate={dragging ? onTop : flat}
      style={grab}
      whileTap={grabbing}
      whileHover={{ scale: 1.01 }}
      drag="y"
      dragOriginY={dragOriginY}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={1}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      onDrag={(e, { point }) => {
        const targetIndex = findIndex(i, point.y);
        if (targetIndex !== i) moveTo(i, targetIndex);
      }}
      positionTransition={({ delta }) => {
        if (dragging) {
          dragOriginY.set(dragOriginY.get() + delta.y);
        }
        return !dragging;
      }}
    >
      <div className="name">{project}</div>
      {steps && (
        <div className="steps">
          {steps.map((a, i) => (
            <Step key={i} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

const height = 80;
const marginBottom = 10;
const totalHeight = height + marginBottom;
const findIndex = (i, y) => {
  // Could use a ref with offsetTop
  const baseY = totalHeight * i;
  const totalY = baseY + y;
  return clamp(0, 15, Math.round(totalY / totalHeight));
};
