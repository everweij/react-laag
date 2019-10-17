import React from "react";
import { createPortal } from "react-dom";
import { useHover, ToggleLayer, anchor } from "react-laag";
import { motion, AnimatePresence } from "framer-motion";

import "./Popper.css";
import "./Tooltip.css";

export default function Tooltip({
  children,
  tooltip,
  placement,
  container,
  hover = true
}: any) {
  const [show, hoverProps] = useHover({ delayEnter: 100, delayLeave: 250 });

  placement = placement || {
    anchor: anchor.BOTTOM_CENTER,
    autoAdjust: true,
    triggerOffset: 9,
    possibleAnchors: [anchor.BOTTOM_CENTER, anchor.TOP_CENTER]
  };

  return (
    <ToggleLayer
      isOpen={hover ? show : undefined}
      placement={placement}
      renderLayer={({ isOpen, layerProps, layerSide, arrowStyle }) => {
        return (
          <AnimatePresence>
            {isOpen && (
              <motion.div
                {...layerProps}
                className="popper laag tooltip"
                initial={{
                  opacity: 0,
                  y: layerSide === "top" ? -8 : 8,
                  scale: 0.8
                }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  type: "spring",
                  damping: 30,
                  stiffness: 500
                }}
              >
                {tooltip}
                <Arrow style={arrowStyle} side={layerSide} />
              </motion.div>
            )}
          </AnimatePresence>
        );
      }}
      // portalRenderLayer={({ isOpen, layerProps, layerSide, arrowStyle }) => {
      //   const layer = (
      //     <AnimatePresence>
      //       {isOpen && (
      //         <motion.div
      //           {...layerProps}
      //           className="popper laag tooltip"
      //           initial={{ opacity: 0, y: layerSide === "top" ? -8 : 8 }}
      //           animate={{ opacity: 1, y: 0 }}
      //           exit={{ opacity: 0 }}
      //           transition={{
      //             type: "spring",
      //             damping: 30,
      //             stiffness: 500
      //           }}
      //         >
      //           {tooltip}
      //           <Arrow style={arrowStyle} side={layerSide} />
      //         </motion.div>
      //       )}
      //     </AnimatePresence>
      //   );

      //   if (container) return createPortal(layer, container);
      //   return layer;
      // }}
    >
      {props => {
        const listeners = hover
          ? hoverProps
          : {
              onClick: props.toggle
            };
        // return (
        //   <span ref={props.triggerRef} {...hoverProps} onClick={props.toggle}>
        //     {children}
        //   </span>
        // );
        if (children && typeof children.type === "string") {
          // Add the hover listeners and ref automatically to keep it simple
          return React.cloneElement(children, {
            ref: props.triggerRef,
            ...listeners
          });
        } else {
          // Custom component; we're going to pass it a number of properties so
          // the component can decide how to control the tooltip
          props = {
            // @ts-ignore
            tooltip: props,
            listeners,
            ref: props.triggerRef
          };

          if (typeof children === "function") {
            return children(props);
          } else {
            return React.Children.map(children, child =>
              React.cloneElement(child, props)
            );
          }
        }
      }}
    </ToggleLayer>
  );
}

const Arrow = ({ style, side }: any) => (
  <div className={`arrow ${side}`} style={style} />
);
