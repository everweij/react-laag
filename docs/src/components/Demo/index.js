import React from "react";
import styled from "styled-components";
import media from "styled-media-query";

import { ToggleLayer } from "react-laag";
import ResizeObserver from "resize-observer-polyfill";

import Menu from "../Menu";
import Button from "../Button";
import Filler from "../Filler";

import { motion, AnimatePresence } from "framer-motion";

const ScrollBox = styled.div`
  background-color: #f9fafb;
  position: relative;
  height: 350px;
  width: 500px;
  overflow: auto;
`;

const Base = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 128px;

  ${media.lessThan("medium")`
    display: none;
  `}
`;

const DemoWrapper = styled.div`
  display: inline-flex;
  box-shadow: 0px 0px 50px 0px rgba(55, 65, 72, 0.14),
    0px 0px 3px 1px rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  overflow: hidden;
`;

const GuideBox = styled.div`
  width: 300px;
  position: relative;
`;

const GuideText = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 18px;
  padding: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function useScript(run, queue) {
  React.useEffect(() => {
    if (!run) {
      return;
    }

    let timeoutRef = null;
    const localQueue = queue.slice(0);

    (async function processQueue() {
      while (localQueue.length) {
        const [timeout, func] = localQueue.shift();

        await new Promise(resolve => {
          timeoutRef = setTimeout(() => {
            func();
            timeoutRef = null;
            resolve();
          }, timeout);
        });
      }
    })();

    return () => {
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }
    };
  }, [run]);
}

const INITIAL_STATE = {
  anchor: "TOP_RIGHT",
  dark: false,
  triggerOffset: 12,
  scrollOffset: 16,
  menuWidth: 160,
  fixed: false
};

export default function Demo() {
  const scrollbox = React.useRef(null);

  const [runDemo, setRunDemo] = React.useState(false);

  const startDemoElement = (
    <Button onClick={() => setRunDemo(true)}>Start demo!</Button>
  );

  const [state, setState] = React.useState({
    bigLogo: true,
    showTagline: false,
    guideText: startDemoElement,
    ...INITIAL_STATE
  });

  useScript(runDemo, [
    [
      0,
      () => {
        setState(s => ({
          ...s,
          guideText: "First, we need a trigger"
        }));
      }
    ],
    [
      1000,
      () => {
        scrollbox.current.scrollTop = 339;
        scrollbox.current.scrollLeft = 284;
      }
    ],
    [
      1000,
      () => {
        setState(s => ({
          ...s,
          guideText: "And a layer of course"
        }));
      }
    ],
    [1000, () => document.querySelector("button").click()],
    [
      1000,
      () => {
        setState(s => ({
          ...s,
          guideText: "Styling is completely up to you"
        }));
      }
    ],
    [600, () => setState(s => ({ ...s, dark: true }))],
    [600, () => setState(s => ({ ...s, dark: false }))],
    [
      1500,
      () => {
        setState(s => ({
          ...s,
          guideText: "Describe where you want the layer to appear"
        }));
      }
    ],
    [
      2000,
      () => {
        setState(s => ({
          ...s,
          guideText: "There are 12 anchor points"
        }));
      }
    ],
    [500, () => setState(s => ({ ...s, anchor: "TOP_CENTER" }))],
    [200, () => setState(s => ({ ...s, anchor: "TOP_LEFT" }))],
    [200, () => setState(s => ({ ...s, anchor: "RIGHT_BOTTOM" }))],
    [200, () => setState(s => ({ ...s, anchor: "RIGHT_CENTER" }))],
    [200, () => setState(s => ({ ...s, anchor: "RIGHT_TOP" }))],
    [200, () => setState(s => ({ ...s, anchor: "BOTTOM_LEFT" }))],
    [200, () => setState(s => ({ ...s, anchor: "BOTTOM_CENTER" }))],
    [200, () => setState(s => ({ ...s, anchor: "BOTTOM_RIGHT" }))],
    [200, () => setState(s => ({ ...s, anchor: "LEFT_TOP" }))],
    [200, () => setState(s => ({ ...s, anchor: "LEFT_CENTER" }))],
    [200, () => setState(s => ({ ...s, anchor: "LEFT_BOTTOM" }))],
    [200, () => setState(s => ({ ...s, anchor: "TOP_CENTER" }))],
    [
      1000,
      () =>
        setState(s => ({
          ...s,
          guideText: (
            <div>
              <code style={{ backgroundColor: "#e7eaec" }}>autoAdjust</code> can
              be used to find the best suitable anchor
            </div>
          )
        }))
    ],
    [
      500,
      () => {
        scrollbox.current.scrollTo({ top: 487, left: 284 });
      }
    ],
    [
      2000,
      () =>
        setState(s => ({
          ...s,
          guideText: (
            <div>
              Gradually move between anchors when{" "}
              <code style={{ backgroundColor: "#e7eaec" }}>snapToAnchor</code>{" "}
              is disabled
            </div>
          )
        }))
    ],
    [
      1000,
      () => {
        scrollbox.current.scrollTo({ top: 345, left: 409, behavior: "smooth" });
      }
    ],
    [
      1000,
      () => {
        scrollbox.current.scrollTo({ top: 345, left: 489, behavior: "smooth" });
      }
    ],
    [
      1000,
      () => {
        scrollbox.current.scrollTo({ top: 484, left: 489, behavior: "smooth" });
      }
    ],
    [
      1000,
      () => {
        scrollbox.current.scrollTo({ top: 300, left: 284, behavior: "smooth" });
      }
    ],
    [
      2000,
      () =>
        setState(s => ({
          ...s,
          guideText: (
            <div>
              Add spacing between your trigger and layer with{" "}
              <code style={{ backgroundColor: "#e7eaec" }}>triggerOffset</code>{" "}
            </div>
          )
        }))
    ],
    [1000, () => setState(s => ({ ...s, triggerOffset: 32 }))],
    [1000, () => setState(s => ({ ...s, triggerOffset: 12 }))],
    [
      1500,
      () =>
        setState(s => ({
          ...s,
          scrollOffset: 32,
          guideText: (
            <div>
              or add spacing between the layer and it's container with{" "}
              <code style={{ backgroundColor: "#e7eaec" }}>scrollOffset</code>{" "}
            </div>
          )
        }))
    ],
    [
      1000,
      () => {
        scrollbox.current.scrollTo({ top: 483, left: 276, behavior: "smooth" });
      }
    ],
    [
      500,
      () => {
        scrollbox.current.scrollTo({ top: 300, left: 284, behavior: "smooth" });
      }
    ],
    [500, () => setState(s => ({ ...s, scrollOffset: 16 }))],
    [
      1500,
      () =>
        setState(s => ({
          ...s,
          anchor: "LEFT_CENTER",
          guideText:
            "react-laag watches and reacts to element dimension changes"
        }))
    ],
    [1000, () => setState(s => ({ ...s, menuWidth: 250 }))],
    [1000, () => setState(s => ({ ...s, menuWidth: 160 }))],
    [
      500,
      () => {
        scrollbox.current.scrollTo({ top: 300, left: 284, behavior: "smooth" });
      }
    ],
    [
      1000,
      () =>
        setState(s => ({
          ...s,
          anchor: "TOP_CENTER",
          fixed: true,
          guideText: "use 'fixed' mode to move the layer outside it's parent"
        }))
    ],
    [
      1000,
      () => {
        scrollbox.current.scrollTo({ top: 468, left: 284, behavior: "smooth" });
      }
    ],
    [
      1000,
      () => {
        scrollbox.current.scrollTo({ top: 300, left: 284, behavior: "smooth" });
      }
    ],
    [
      2000,
      () =>
        setState(s => ({
          ...s,
          anchor: "TOP_CENTER",
          fixed: false,
          guideText:
            "Oh, and it supports nested scroll containers too, including the window 😄"
        }))
    ],
    [
      1000,
      () => {
        window.scrollTo({ top: 700, behavior: "smooth" });
      }
    ],
    [
      1000,
      () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    ],
    [
      2000,
      () =>
        setState(s => ({
          ...s,
          guideText: "Explore more possibilities on the docs below!"
        }))
    ],
    [
      2000,
      () => {
        document.querySelector("button").click();
        setState(s => ({
          ...s,
          ...INITIAL_STATE,
          guideText: startDemoElement
        }));
        setRunDemo(false);
      }
    ]
  ]);

  return (
    <Base>
      <DemoWrapper>
        <ScrollBox ref={scrollbox}>
          <ToggleLayer
            fixed={state.fixed}
            ResizeObserver={ResizeObserver}
            renderLayer={props => (
              <AnimatePresence>
                {props.isOpen ? (
                  <Menu
                    ref={props.layerProps.ref}
                    style={props.layerProps.style}
                    arrowStyle={props.arrowStyle}
                    layerSide={props.layerSide}
                    dark={state.dark}
                    width={state.menuWidth}
                  >
                    <Menu.Item>Item 1</Menu.Item>
                    <Menu.Item>Item 2</Menu.Item>
                    <Menu.Item>Item 3</Menu.Item>
                    <Menu.Item>Item 4</Menu.Item>
                  </Menu>
                ) : null}
              </AnimatePresence>
            )}
            placement={{
              anchor: state.anchor,
              autoAdjust: true,
              snapToAnchor: false,
              triggerOffset: state.triggerOffset,
              scrollOffset: state.scrollOffset,
              preferX: "RIGHT"
            }}
          >
            {({ isOpen, triggerRef, toggle }) => (
              <Button
                ref={triggerRef}
                onClick={toggle}
                style={{
                  position: "relative",
                  left: 500,
                  top: 500
                }}
              >
                {isOpen ? "Hide" : "Show"}
              </Button>
            )}
          </ToggleLayer>

          <Filler />
        </ScrollBox>

        <GuideBox>
          <AnimatePresence>
            <GuideText
              as={motion.div}
              initial={{ opacity: 0, y: -100 }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{ opacity: 0, y: 100 }}
              key={state.guideText}
              positionTransition
            >
              {state.guideText}
            </GuideText>
          </AnimatePresence>
        </GuideBox>
      </DemoWrapper>
    </Base>
  );
}
