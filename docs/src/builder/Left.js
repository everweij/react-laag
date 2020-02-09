import React from "react";
import styled from "styled-components";

import { Link } from "gatsby";

import { LEFT_WIDTH, TOP_HEIGHT } from "../components/constants";

import logo from "../components/NavLeft/laag-logo2.png";

import Section from "./Section";
import AnchorSelect from "./AnchorSelect";

function evtToNumber(evt) {
  return parseFloat(evt.target.value);
}

const Base = styled.aside`
  top: 0;
  bottom: 0;
  left: 0;
  width: ${LEFT_WIDTH}px;
  position: fixed;

  background-color: var(--greybg);
  border-right: 1px solid var(--greybg-border);
  box-sizing: border-box;
  z-index: 998;
  transition: transform 0.15s ease-in-out, background-color 0.15s ease-in-out;

  & .toggle {
    display: none;
  }
`;

const Head = styled.div`
  padding-left: 32px;
  height: ${TOP_HEIGHT}px;
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: var(--lighter);

  & > img {
    margin-right: 16px;
    width: 32px;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: var(--lighter);
  text-transform: uppercase;
  /* margin-bottom: 6px; */
`;

export default function NavLeft({ state, setState }) {
  const [openSection, setOpenSection] = React.useState("layer");

  function handleToggleSection(id) {
    if (openSection === id) {
      setOpenSection(null);
      return;
    }

    setOpenSection(id);
  }

  return (
    <>
      <Base>
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <Head>
            <img alt="react-laag logo" src={logo} />
            <div>react-laag</div>
          </Head>
        </Link>

        <div
          style={{
            fontWeight: 700,
            marginTop: 24,
            marginBottom: 24,
            marginLeft: 12
          }}
        >
          Properties
        </div>

        <Section
          isFirst
          id="layer"
          title="Layer"
          isOpen={openSection === "layer"}
          onClick={handleToggleSection}
        >
          <Label>width</Label>
          <input
            type="range"
            value={state.width}
            min={50}
            max={250}
            step={1}
            onChange={evt => setState({ ...state, width: evtToNumber(evt) })}
          />
          <Label>height</Label>
          <input
            type="range"
            value={state.height}
            min={50}
            max={250}
            step={1}
            onChange={evt => setState({ ...state, height: evtToNumber(evt) })}
          />
          <Label>backgroundColor</Label>
          <input
            type="color"
            value={state.backgroundColor}
            onChange={evt =>
              setState({ ...state, backgroundColor: evt.target.value })
            }
          />
          <Label>borderWidth</Label>
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={state.borderWidth}
            onChange={evt =>
              setState({ ...state, borderWidth: evtToNumber(evt) })
            }
          />
          <Label>borderColor</Label>
          <input
            type="color"
            value={state.borderColor}
            onChange={evt =>
              setState({ ...state, borderColor: evt.target.value })
            }
          />
        </Section>
        <Section
          id="arrow"
          title="Arrow"
          isOpen={openSection === "arrow"}
          onClick={handleToggleSection}
        >
          <Label>enabled</Label>
          <input
            type="checkbox"
            checked={state.arrow}
            onChange={() => setState({ ...state, arrow: !state.arrow })}
          />
          <Label>size</Label>
          <input
            type="range"
            min={2}
            max={20}
            step={1}
            value={state.arrowSize}
            onChange={evt =>
              setState({ ...state, arrowSize: evtToNumber(evt) })
            }
          />
          <Label>angle</Label>
          <input
            type="range"
            min={10}
            max={88}
            step={1}
            value={state.arrowAngle}
            onChange={evt =>
              setState({ ...state, arrowAngle: evtToNumber(evt) })
            }
          />
          <Label>roundness</Label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={state.arrowRoundness}
            onChange={evt =>
              setState({ ...state, arrowRoundness: evtToNumber(evt) })
            }
          />
          <Label>arrowOffset</Label>
          <input
            type="range"
            min={0}
            max={10}
            step={0.1}
            value={state.arrowOffset}
            onChange={evt =>
              setState({ ...state, arrowOffset: evtToNumber(evt) })
            }
          />
        </Section>
        <Section
          id="placement"
          title="Placement"
          isOpen={openSection === "placement"}
          onClick={handleToggleSection}
        >
          <Label>anchor</Label>
          <AnchorSelect
            value={state.anchor}
            onChange={anchor => setState({ ...state, anchor })}
          />
          <Label>possible anchors</Label>
          <AnchorSelect
            type="multi"
            value={state.possibleAnchors}
            onChange={possibleAnchors =>
              setState({ ...state, possibleAnchors })
            }
          />

          <Label>autoAdjust</Label>
          <input
            type="checkbox"
            checked={state.autoAdjust}
            onChange={() =>
              setState({ ...state, autoAdjust: !state.autoAdjust })
            }
          />
          <Label>snapToAnchor</Label>
          <input
            type="checkbox"
            checked={state.snapToAnchor}
            onChange={() =>
              setState({ ...state, snapToAnchor: !state.snapToAnchor })
            }
          />

          <Label>preferX</Label>
          <input
            type="radio"
            checked={state.preferX === "LEFT"}
            onClick={() => setState({ ...state, preferX: "LEFT" })}
          />
          <label>Left</label>
          <input
            type="radio"
            checked={state.preferX === "RIGHT"}
            onClick={() => setState({ ...state, preferX: "RIGHT" })}
          />
          <label>Right</label>

          <Label>preferY</Label>
          <input
            type="radio"
            checked={state.preferY === "TOP"}
            onClick={() => setState({ ...state, preferY: "TOP" })}
          />
          <label>Top</label>
          <input
            type="radio"
            checked={state.preferY === "BOTTOM"}
            onClick={() => setState({ ...state, preferY: "BOTTOM" })}
          />
          <label>Bottom</label>

          <Label>triggerOffset</Label>
          <input
            type="range"
            min={0}
            max={32}
            step={1}
            value={state.triggerOffset}
            onChange={evt =>
              setState({ ...state, triggerOffset: evtToNumber(evt) })
            }
          />
          <Label>scrollOffset</Label>
          <input
            type="range"
            min={0}
            max={32}
            step={1}
            value={state.scrollOffset}
            onChange={evt =>
              setState({ ...state, scrollOffset: evtToNumber(evt) })
            }
          />
        </Section>
        <Section
          id="behavior"
          title="Behavior"
          isOpen={openSection === "behavior"}
          onClick={handleToggleSection}
        >
          <Label>mode</Label>
          <input
            type="radio"
            checked={!state.fixed}
            onClick={() => setState({ ...state, fixed: false })}
          />
          <label>Absolute</label>
          <input
            type="radio"
            checked={state.fixed}
            onClick={() => setState({ ...state, fixed: true })}
          />
          <label>Fixed</label>

          <Label>closeOnOutsideClick</Label>
          <input
            type="checkbox"
            checked={state.closeOnOutsideClick}
            onChange={() =>
              setState({
                ...state,
                closeOnOutsideClick: !state.closeOnOutsideClick
              })
            }
          />
          <Label>closeOnDisappear</Label>
          <input
            type="radio"
            checked={!state.closeOnDisappear}
            onClick={() => setState({ ...state, closeOnDisappear: false })}
          />
          <label>off</label>
          <input
            type="radio"
            checked={state.closeOnDisappear === "partial"}
            onClick={() => setState({ ...state, closeOnDisappear: "partial" })}
          />
          <label>partial</label>
          <input
            type="radio"
            checked={state.closeOnDisappear === "full"}
            onClick={() => setState({ ...state, closeOnDisappear: "full" })}
          />
          <label>full</label>
        </Section>
        <Section
          id="transition"
          title="Transition"
          isOpen={openSection === "transition"}
          onClick={handleToggleSection}
        >
          <Label>enabled</Label>
          <input
            type="checkbox"
            checked={state.transition}
            onChange={() =>
              setState({ ...state, transition: !state.transition })
            }
          />

          <Label>duration</Label>
          <input
            type="range"
            min={100}
            max={1000}
            step={10}
            value={state.duration}
            onChange={evt => setState({ ...state, duration: evtToNumber(evt) })}
          />

          <Label>opacity</Label>
          <input
            type="checkbox"
            checked={state.opacity}
            onChange={() => setState({ ...state, opacity: !state.opacity })}
          />

          <Label>scale</Label>
          <input
            type="checkbox"
            checked={state.scale}
            onChange={() => setState({ ...state, scale: !state.scale })}
          />
        </Section>
      </Base>
    </>
  );
}
