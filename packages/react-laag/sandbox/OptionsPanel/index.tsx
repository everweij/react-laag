import * as React from "react";

import { TestCaseOptions } from "../options";
import { PlacementSelect } from "./PlacementSelect";
import { RadioGroup } from "./RadioGroup";

type Props = {
  options: TestCaseOptions;
  onOptionsChange: (options: TestCaseOptions) => void;
};

export function OptionsPanel({ options, onOptionsChange }: Props) {
  function handleOptionsChange<T extends keyof TestCaseOptions>(
    key: T,
    value: TestCaseOptions[T]
  ) {
    onOptionsChange({
      ...options,
      [key]: value
    });
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: 300,
        borderRight: "1px solid black",
        padding: 16,
        overflow: "auto",
        backgroundColor: "white"
      }}
    >
      <h3>Options</h3>
      <label>overflowContainer</label>
      <input
        type="checkbox"
        style={{ marginTop: 2 }}
        checked={options.overflowContainer}
        onChange={() =>
          handleOptionsChange("overflowContainer", !options.overflowContainer)
        }
      />
      <label>Placement</label>
      <PlacementSelect
        type="single"
        value={options.placement}
        onChange={placement => handleOptionsChange("placement", placement)}
      />
      <label>auto</label>
      <input
        type="checkbox"
        style={{ marginTop: 2 }}
        checked={options.auto}
        onChange={() => handleOptionsChange("auto", !options.auto)}
      />
      <label>possiblePlacements</label>
      <PlacementSelect
        disabled={!options.auto}
        type="multi"
        value={options.possiblePlacements}
        onChange={possiblePlacements =>
          handleOptionsChange("possiblePlacements", possiblePlacements)
        }
      />
      <label>snap</label>
      <input
        type="checkbox"
        style={{ marginTop: 2 }}
        disabled={!options.auto}
        checked={options.snap}
        onChange={() => handleOptionsChange("snap", !options.snap)}
      />
      <label>preferX</label>
      <RadioGroup
        disabled={!options.auto}
        items={[
          { value: "left", display: "left" },
          { value: "right", display: "right" }
        ]}
        value={options.preferX}
        onChange={value => handleOptionsChange("preferX", value as any)}
      />
      <label>preferY</label>
      <RadioGroup
        disabled={!options.auto}
        items={[
          { value: "top", display: "top" },
          { value: "bottom", display: "bottom" }
        ]}
        value={options.preferY}
        onChange={value => handleOptionsChange("preferY", value as any)}
      />
      <label>triggerOffset</label>
      <input
        type="range"
        min={0}
        max={24}
        step={1}
        value={options.triggerOffset}
        onChange={({ currentTarget: { value } }) =>
          handleOptionsChange("triggerOffset", Number(value))
        }
      />
      <label>containerOffset</label>
      <input
        type="range"
        min={0}
        max={24}
        step={1}
        value={options.containerOffset}
        onChange={({ currentTarget: { value } }) =>
          handleOptionsChange("containerOffset", Number(value))
        }
      />
      <label>arrowOffset</label>
      <input
        type="range"
        min={0}
        max={16}
        step={1}
        value={options.arrowOffset}
        onChange={({ currentTarget: { value } }) =>
          handleOptionsChange("arrowOffset", Number(value))
        }
      />
      <label>close when clicked outside</label>
      <input
        type="checkbox"
        style={{ marginTop: 2 }}
        checked={options.closeOnOutsideClick}
        onChange={() =>
          handleOptionsChange(
            "closeOnOutsideClick",
            !options.closeOnOutsideClick
          )
        }
      />
      <label>close when layer disappears</label>
      <RadioGroup
        items={[
          { value: false, display: "off" },
          { value: "partial", display: "partial" },
          { value: "full", display: "full" }
        ]}
        value={options.closeOnDisappear}
        onChange={value =>
          handleOptionsChange("closeOnDisappear", value as any)
        }
      />
      <label>Trigger is bigger</label>
      <input
        type="checkbox"
        style={{ marginTop: 2 }}
        checked={options.triggerIsBigger}
        onChange={() =>
          handleOptionsChange("triggerIsBigger", !options.triggerIsBigger)
        }
      />
    </div>
  );
}
