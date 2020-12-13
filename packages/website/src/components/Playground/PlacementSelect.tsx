import React from "react";
import styled from "styled-components";
import { Placement } from "react-laag";
import Radio from "./Radio";
import Checkbox from "./Checkbox";

const Base = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border: 1px solid #b7b7b7;
  margin: 8px 8px 16px 8px;
  border-radius: 2px;
  margin-top: 12px;
  margin-bottom: 20px;
`;

interface SingleProps {
  type?: "single";
  value: Placement;
  onChange: (value: Placement) => void;
  disabled?: boolean;
}

interface MultiProps {
  type: "multi";
  value: Placement[];
  onChange: (value: Placement[]) => void;
  disabled?: boolean;
}

type Props = (SingleProps | MultiProps) &
  Omit<React.ComponentPropsWithoutRef<"div">, "onChange" | "type" | "value">;

function AnchorSelect({
  type = "single",
  onChange,
  value,
  disabled,
  ...rest
}: Props) {
  const selectedPlacements = type === "single" ? [value] : value;

  const isChecked = (placement: Placement) =>
    selectedPlacements.includes(placement);

  function handleChange(evt: React.MouseEvent<HTMLDivElement>) {
    const placement = (evt.currentTarget as HTMLDivElement).getAttribute(
      "data-placement"
    ) as Placement;
    if (type === "single") {
      (onChange as SingleProps["onChange"])(placement);
    } else {
      (onChange as MultiProps["onChange"])(
        isChecked(placement)
          ? (value as Placement[]).filter(item => item !== placement)
          : (value as Placement[]).concat(placement)
      );
    }
  }

  const Component = type === "single" ? Radio : Checkbox;

  return (
    <Base {...rest}>
      <Component
        disabled={disabled}
        data-placement="top-start"
        style={{
          position: "absolute",
          top: 0,
          left: 10,
          transform: "translateY(-50%)"
        }}
        value={isChecked("top-start")}
        onClick={handleChange}
      />
      <Component
        disabled={disabled}
        data-placement="top-center"
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
        value={isChecked("top-center")}
        onClick={handleChange}
      />
      <Component
        disabled={disabled}
        data-placement="top-end"
        style={{
          position: "absolute",
          top: 0,
          right: 10,
          transform: "translateY(-50%)"
        }}
        value={isChecked("top-end")}
        onClick={handleChange}
      />
      <Component
        disabled={disabled}
        data-placement="left-start"
        style={{
          position: "absolute",
          top: 10,
          left: 0,
          transform: "translateX(-50%)"
        }}
        value={isChecked("left-start")}
        onClick={handleChange}
      />
      <Component
        disabled={disabled}
        data-placement="right-start"
        style={{
          position: "absolute",
          top: 10,
          right: 0,
          transform: "translateX(50%)"
        }}
        value={isChecked("right-start")}
        onClick={handleChange}
      />
      <Component
        disabled={disabled}
        data-placement="left-center"
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          transform: "translate(-50%, -50%)"
        }}
        value={isChecked("left-center")}
        onClick={handleChange}
      />
      <Component
        disabled={disabled}
        data-placement="right-center"
        style={{
          position: "absolute",
          top: "50%",
          right: 0,
          transform: "translate(50%, -50%)"
        }}
        value={isChecked("right-center")}
        onClick={handleChange}
      />
      <Component
        disabled={disabled}
        data-placement="left-end"
        style={{
          position: "absolute",
          bottom: 10,
          left: 0,
          transform: "translateX(-50%)"
        }}
        value={isChecked("left-end")}
        onClick={handleChange}
      />
      <Component
        disabled={disabled}
        data-placement="right-end"
        style={{
          position: "absolute",
          bottom: 10,
          right: 0,
          transform: "translateX(50%)"
        }}
        value={isChecked("right-end")}
        onClick={handleChange}
      />
      <Component
        disabled={disabled}
        data-placement="bottom-start"
        style={{
          position: "absolute",
          bottom: 0,
          left: 10,
          transform: "translateY(50%)"
        }}
        value={isChecked("bottom-start")}
        onClick={handleChange}
      />
      <Component
        disabled={disabled}
        data-placement="bottom-center"
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translate(-50%, 50%)"
        }}
        value={isChecked("bottom-center")}
        onClick={handleChange}
      />
      <Component
        disabled={disabled}
        data-placement="bottom-end"
        style={{
          position: "absolute",
          bottom: 0,
          right: 10,
          transform: "translateY(50%)"
        }}
        value={isChecked("bottom-end")}
        onClick={handleChange}
      />
    </Base>
  );
}

export default AnchorSelect;
