import React, { CSSProperties } from "react";
import { Placement } from "../src";

const baseStyle: CSSProperties = {
  position: "relative",
  width: 80,
  height: 80,
  border: "1px solid #b7b7b7",
  borderRadius: 2,
  marginTop: 12,
  marginBottom: 20,
  marginLeft: 8,
  marginRight: 8
};

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

export function PlacementSelect({
  type = "single",
  onChange,
  value,
  disabled,
  ...rest
}: Props) {
  const selectedPlacements = type === "single" ? [value] : value;

  const isChecked = (placement: Placement) =>
    selectedPlacements.includes(placement);

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
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

  const inputType = type === "single" ? "radio" : "checkbox";

  return (
    <div style={baseStyle} {...rest}>
      <input
        type={inputType}
        disabled={disabled}
        data-placement="top-start"
        style={{
          margin: 0,
          position: "absolute",
          top: 0,
          left: 10,
          transform: "translateY(-50%)"
        }}
        checked={isChecked("top-start")}
        onChange={handleChange}
      />
      <input
        type={inputType}
        disabled={disabled}
        data-placement="top-center"
        style={{
          margin: 0,
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
        checked={isChecked("top-center")}
        onChange={handleChange}
      />
      <input
        type={inputType}
        disabled={disabled}
        data-placement="top-end"
        style={{
          margin: 0,
          position: "absolute",
          top: 0,
          right: 10,
          transform: "translateY(-50%)"
        }}
        checked={isChecked("top-end")}
        onChange={handleChange}
      />
      <input
        type={inputType}
        disabled={disabled}
        data-placement="left-start"
        style={{
          margin: 0,
          position: "absolute",
          top: 10,
          left: 0,
          transform: "translateX(-50%)"
        }}
        checked={isChecked("left-start")}
        onChange={handleChange}
      />
      <input
        type={inputType}
        disabled={disabled}
        data-placement="right-start"
        style={{
          margin: 0,
          position: "absolute",
          top: 10,
          right: 0,
          transform: "translateX(50%)"
        }}
        checked={isChecked("right-start")}
        onChange={handleChange}
      />
      <input
        type={inputType}
        disabled={disabled}
        data-placement="left-center"
        style={{
          margin: 0,
          position: "absolute",
          top: "50%",
          left: 0,
          transform: "translate(-50%, -50%)"
        }}
        checked={isChecked("left-center")}
        onChange={handleChange}
      />
      <input
        type={inputType}
        disabled={disabled}
        data-placement="right-center"
        style={{
          margin: 0,
          position: "absolute",
          top: "50%",
          right: 0,
          transform: "translate(50%, -50%)"
        }}
        checked={isChecked("right-center")}
        onChange={handleChange}
      />
      <input
        type={inputType}
        disabled={disabled}
        data-placement="left-end"
        style={{
          margin: 0,
          position: "absolute",
          bottom: 10,
          left: 0,
          transform: "translateX(-50%)"
        }}
        checked={isChecked("left-end")}
        onChange={handleChange}
      />
      <input
        type={inputType}
        disabled={disabled}
        data-placement="right-end"
        style={{
          margin: 0,
          position: "absolute",
          bottom: 10,
          right: 0,
          transform: "translateX(50%)"
        }}
        checked={isChecked("right-end")}
        onChange={handleChange}
      />
      <input
        type={inputType}
        disabled={disabled}
        data-placement="bottom-start"
        style={{
          margin: 0,
          position: "absolute",
          bottom: 0,
          left: 10,
          transform: "translateY(50%)"
        }}
        checked={isChecked("bottom-start")}
        onChange={handleChange}
      />
      <input
        type={inputType}
        disabled={disabled}
        data-placement="bottom-center"
        style={{
          margin: 0,
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translate(-50%, 50%)"
        }}
        checked={isChecked("bottom-center")}
        onChange={handleChange}
      />
      <input
        type={inputType}
        disabled={disabled}
        data-placement="bottom-end"
        style={{
          margin: 0,
          position: "absolute",
          bottom: 0,
          right: 10,
          transform: "translateY(50%)"
        }}
        checked={isChecked("bottom-end")}
        onChange={handleChange}
      />
    </div>
  );
}
