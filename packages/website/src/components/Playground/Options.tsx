import * as React from "react";
import styled from "styled-components";

import { Options as OptionsType } from "./types";
import { colors } from "../../theme";

import PlacementSelect from "./PlacementSelect";
import Label from "./Label";
import RadioGroup from "./RadioGroup";
import Range from "./Range";
import Checkbox from "./Checkbox";

const Base = styled.div`
  color: ${colors.text};

  padding: 32px;
  max-height: 100vw;

  h2 {
    margin-top: 0;
    text-align: center;
  }
`;

type Props = {
  options: OptionsType;
  onOptionsChange: (options: OptionsType) => void;
};

function Options({ options, onOptionsChange }: Props) {
  function handleOptionsChange<T extends keyof OptionsType>(
    key: T,
    value: OptionsType[T]
  ) {
    onOptionsChange({
      ...options,
      [key]: value
    });
  }

  return (
    <Base>
      <h2>Options</h2>
      <Label info="Is the layer allowed to overflow its closest scroll-container (true), or should the layer be contained within the closest scroll-container (false)?">
        overflowContainer
      </Label>
      <Checkbox
        style={{ marginTop: 2 }}
        value={options.overflowContainer}
        onClick={() =>
          handleOptionsChange("overflowContainer", !options.overflowContainer)
        }
      />
      <Label info="Preferred placement of the layer">Placement</Label>
      <PlacementSelect
        type="single"
        value={options.placement}
        onChange={placement => handleOptionsChange("placement", placement)}
      />
      <Label info="Should we switch automatically to a placement that is more visible on the screen?">
        auto
      </Label>
      <Checkbox
        style={{ marginTop: 2 }}
        value={options.auto}
        onClick={() => handleOptionsChange("auto", !options.auto)}
      />
      <Label info="Only has impact when 'auto' is set to true. This prop describes which placements are possible. Priorities are set based on the preferred 'placement', and the 'preferX' and 'preferY' prop.">
        possiblePlacements
      </Label>
      <PlacementSelect
        disabled={!options.auto}
        type="multi"
        value={options.possiblePlacements}
        onChange={possiblePlacements =>
          handleOptionsChange("possiblePlacements", possiblePlacements)
        }
      />
      <Label info="should the layer gradually move between two placements or not? Only has impact when 'auto' is set to true.">
        snap
      </Label>
      <Checkbox
        style={{ marginTop: 2 }}
        disabled={!options.auto}
        value={options.snap}
        onClick={() => handleOptionsChange("snap", !options.snap)}
      />
      <Label info="When both left and right sides are available, which side is preferred? Only has impact when 'auto' is set to true and placement starts with 'top-*' or 'bottom-*.'">
        preferX
      </Label>
      <RadioGroup
        disabled={!options.auto}
        items={[
          { value: "left", display: "left" },
          { value: "right", display: "right" }
        ]}
        value={options.preferX}
        onChange={value => handleOptionsChange("preferX", value as any)}
      />
      <Label info="When both top and bottom sides are available, which side is preferred? Only has impact when 'auto' is set to true and placement starts with 'left-*' or 'right-*.'">
        preferY
      </Label>
      <RadioGroup
        disabled={!options.auto}
        items={[
          { value: "top", display: "top" },
          { value: "bottom", display: "bottom" }
        ]}
        value={options.preferY}
        onChange={value => handleOptionsChange("preferY", value as any)}
      />
      <Label info="Distance in pixels between layer and trigger">
        triggerOffset
      </Label>
      <Range
        min={0}
        max={24}
        step={1}
        value={options.triggerOffset}
        onChange={triggerOffset =>
          handleOptionsChange("triggerOffset", triggerOffset)
        }
      />
      <Label info="Distance in pixels between layer and scroll-containers">
        containerOffset
      </Label>
      <Range
        min={0}
        max={24}
        step={1}
        value={options.containerOffset}
        onChange={containerOffset =>
          handleOptionsChange("containerOffset", containerOffset)
        }
      />
      <Label info="Minimal distance between the arrow and the edges of layer & trigger">
        arrowOffset
      </Label>
      <Range
        min={0}
        max={16}
        step={1}
        value={options.arrowOffset}
        onChange={arrowOffset =>
          handleOptionsChange("arrowOffset", arrowOffset)
        }
      />
      <Label info="With help of the 'onOutsideClick' callback, we can close the layer when the user clicks somewhere except the trigger or layer.">
        close when clicked outside
      </Label>
      <Checkbox
        style={{ marginTop: 2 }}
        value={options.closeOnOutsideClick}
        onClick={() =>
          handleOptionsChange(
            "closeOnOutsideClick",
            !options.closeOnOutsideClick
          )
        }
      />
      <Label info="With help of the 'onDisappear' callback, we can close the layer when the layer or trigger partially or fully disappears from the screen. It looks at the trigger-element if 'overflowContainer' is set to 'true', or the layer-element when set to 'false'">
        close when layer disappears
      </Label>
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
    </Base>
  );
}

export default Options;
