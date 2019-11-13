import React from "react";
import styled from "styled-components";

const Base = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border: 1px solid black;
  margin: 8px 8px 16px 8px;
`;

function AnchorSelect({ type = "single", onChange, value }) {
  const v = type === "single" ? [value] : value;

  const isChecked = anchor => v.indexOf(anchor) > -1;

  function handleChange(evt) {
    const anchor = evt.target.getAttribute("data-anchor");
    if (type === "single") {
      onChange(anchor);
    } else {
      onChange(
        isChecked(anchor)
          ? value.filter(x => x !== anchor)
          : value.concat(anchor)
      );
    }
  }

  return (
    <Base>
      <input
        data-anchor="TOP_LEFT"
        type="checkbox"
        style={{
          position: "absolute",
          top: 0,
          left: 10,
          transform: "translateY(-50%)"
        }}
        checked={isChecked("TOP_LEFT")}
        onChange={handleChange}
      />
      <input
        data-anchor="TOP_CENTER"
        type="checkbox"
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
        checked={isChecked("TOP_CENTER")}
        onChange={handleChange}
      />
      <input
        data-anchor="TOP_RIGHT"
        type="checkbox"
        style={{
          position: "absolute",
          top: 0,
          right: 10,
          transform: "translateY(-50%)"
        }}
        checked={isChecked("TOP_RIGHT")}
        onChange={handleChange}
      />
      <input
        data-anchor="LEFT_TOP"
        type="checkbox"
        style={{
          position: "absolute",
          top: 10,
          left: 0,
          transform: "translateX(-50%)"
        }}
        checked={isChecked("LEFT_TOP")}
        onChange={handleChange}
      />
      <input
        data-anchor="RIGHT_TOP"
        type="checkbox"
        style={{
          position: "absolute",
          top: 10,
          right: 0,
          transform: "translateX(50%)"
        }}
        checked={isChecked("RIGHT_TOP")}
        onChange={handleChange}
      />
      <input
        data-anchor="LEFT_CENTER"
        type="checkbox"
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          transform: "translate(-50%, -50%)"
        }}
        checked={isChecked("LEFT_CENTER")}
        onChange={handleChange}
      />
      <input
        data-anchor="RIGHT_CENTER"
        type="checkbox"
        style={{
          position: "absolute",
          top: "50%",
          right: 0,
          transform: "translate(50%, -50%)"
        }}
        checked={isChecked("RIGHT_CENTER")}
        onChange={handleChange}
      />
      <input
        data-anchor="LEFT_BOTTOM"
        type="checkbox"
        style={{
          position: "absolute",
          bottom: 10,
          left: 0,
          transform: "translateX(-50%)"
        }}
        checked={isChecked("LEFT_BOTTOM")}
        onChange={handleChange}
      />
      <input
        data-anchor="RIGHT_BOTTOM"
        type="checkbox"
        style={{
          position: "absolute",
          bottom: 10,
          right: 0,
          transform: "translateX(50%)"
        }}
        checked={isChecked("RIGHT_BOTTOM")}
        onChange={handleChange}
      />
      <input
        data-anchor="BOTTOM_LEFT"
        type="checkbox"
        style={{
          position: "absolute",
          bottom: 0,
          left: 10,
          transform: "translateY(50%)"
        }}
        checked={isChecked("BOTTOM_LEFT")}
        onChange={handleChange}
      />
      <input
        data-anchor="BOTTOM_CENTER"
        type="checkbox"
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translate(-50%, 50%)"
        }}
        checked={isChecked("BOTTOM_CENTER")}
        onChange={handleChange}
      />
      <input
        data-anchor="BOTTOM_RIGHT"
        type="checkbox"
        style={{
          position: "absolute",
          bottom: 0,
          right: 10,
          transform: "translateY(50%)"
        }}
        checked={isChecked("BOTTOM_RIGHT")}
        onChange={handleChange}
      />
    </Base>
  );
}

export default AnchorSelect;
