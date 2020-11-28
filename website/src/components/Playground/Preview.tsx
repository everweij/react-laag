import * as React from "react";
import styled, { css } from "styled-components";
import { useLayer, Arrow, ArrowProps } from "../../../../src";
import PrimaryButton from "../PrimaryButton";
import { mergeRefs } from "../../util";
import { colors } from "../../theme";

import { Options, LayerSettings } from "./types";

import Label from "./Label";
import Range from "./Range";
import RadioGroup from "./RadioGroup";

const SettingsLayerBase = styled.div`
  background-color: ${colors["bg-code"]};
  padding: 24px;
  border-radius: 4px;
  box-shadow: 3px 3px 20px 0px rgba(0, 0, 0, 0.15);
  opacity: 0.85;

  h3 {
    margin: 0;
    margin-bottom: 16px;
    font-size: 16px;
    text-align: center;
  }
`;

type SettingsLayerProps = {
  title: string;
  arrowProps: ArrowProps;
} & React.ComponentPropsWithoutRef<"div">;

const SettingsLayer = React.forwardRef<HTMLDivElement, SettingsLayerProps>(
  function SettingsLayer({ children, arrowProps, ...props }, ref) {
    return (
      <SettingsLayerBase ref={ref} {...props}>
        {children}
        <Arrow
          size={8}
          backgroundColor={colors["bg-code"]}
          borderColor="#de6fb3"
          borderWidth={1}
          {...arrowProps}
        />
      </SettingsLayerBase>
    );
  }
);

const layerDark = css`
  background-color: ${colors["bg-code"]};
  color: white;
`;

const layerLight = css`
  background-color: white;
  color: ${colors.text};
`;

const LayerBase = styled.div<{ $selected?: boolean; $color: "light" | "dark" }>`
  width: 200px;
  height: 150px;
  box-shadow: 4px 4px 10px 0px rgba(0, 0, 0, 0.15)
    ${p => p.$selected && `, 0 0 0 3px #70afe4`};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  user-select: none;

  > div:first-child {
    display: flex;
    flex-direction: column;
    align-items: center;

    > div:last-child {
      font-weight: 400;
      color: grey;
      font-size: 10px;
    }
  }

  ${p => (p.$color === "light" ? layerLight : layerDark)}
`;

type LayerProps = {
  arrowProps: ArrowProps;
  layerSettings: LayerSettings;
  onLayerSettingsChange: (layerSettings: LayerSettings) => void;
} & React.ComponentPropsWithoutRef<"div">;

const Layer = React.forwardRef<HTMLDivElement, LayerProps>(function Layer(
  {
    arrowProps: externalArrowProps,
    layerSettings,
    onLayerSettingsChange,
    ...props
  },
  ref
) {
  const [isOpen, setOpen] = React.useState(false);

  const { triggerProps, layerProps, renderLayer, arrowProps } = useLayer({
    isOpen,
    placement: "right-center",
    auto: true,
    triggerOffset: 16,
    onOutsideClick: () => setOpen(false),
    onParentClose: () => setOpen(false)
  });

  return (
    <>
      <LayerBase
        $color={layerSettings.color}
        $selected={isOpen}
        ref={mergeRefs(ref, triggerProps.ref)}
        {...props}
        onClick={() => setOpen(!isOpen)}
      >
        <div>
          <div>Layer</div>
          <div>Click to edit layer-settings</div>
        </div>
        <Arrow
          {...externalArrowProps}
          backgroundColor={
            layerSettings.color === "light" ? "white" : "#330e25"
          }
          size={layerSettings.arrowSize}
          roundness={layerSettings.arrowRoundness}
        />
      </LayerBase>
      {isOpen &&
        renderLayer(
          <SettingsLayer
            {...layerProps}
            arrowProps={arrowProps}
            title="Layer settings"
          >
            <h3>Layer settings</h3>
            <Label>width</Label>
            <Range
              passive
              min={50}
              max={500}
              value={layerSettings.width}
              onChange={width =>
                onLayerSettingsChange({ ...layerSettings, width })
              }
              step={1}
            />
            <Label>height</Label>
            <Range
              passive
              min={50}
              max={500}
              value={layerSettings.height}
              onChange={height =>
                onLayerSettingsChange({ ...layerSettings, height })
              }
              step={1}
            />
            <Label>Color</Label>
            <RadioGroup
              items={[
                { value: "light", display: "light" },
                { value: "dark", display: "dark" }
              ]}
              value={layerSettings.color}
              onChange={(color: any) =>
                onLayerSettingsChange({ ...layerSettings, color })
              }
            />
            <Label>Arrow size</Label>
            <Range
              min={1}
              max={20}
              value={layerSettings.arrowSize}
              onChange={arrowSize =>
                onLayerSettingsChange({ ...layerSettings, arrowSize })
              }
              step={1}
            />
            <Label>Arrow roundness</Label>
            <Range
              min={0}
              max={1}
              value={layerSettings.arrowRoundness}
              onChange={arrowRoundness =>
                onLayerSettingsChange({ ...layerSettings, arrowRoundness })
              }
              step={0.1}
            />
          </SettingsLayer>
        )}
    </>
  );
});

type Props = {
  options: Omit<Options, "isOpen">;
  layerSettings: LayerSettings;
  onLayerSettingsChange: (layerSettings: LayerSettings) => void;
  style?: React.CSSProperties;
};

function Preview({
  options,
  style,
  layerSettings,
  onLayerSettingsChange
}: Props) {
  const [isOpen, setOpen] = React.useState(true);

  const { layerProps, triggerProps, renderLayer, arrowProps } = useLayer({
    isOpen,
    ...options,
    onDisappear: options.closeOnDisappear
      ? type => {
          if (options.closeOnDisappear === "partial" && type === "partial") {
            setOpen(false);
          } else if (options.closeOnDisappear === "full" && type === "full") {
            setOpen(false);
          }
        }
      : undefined,
    onOutsideClick: options.closeOnOutsideClick
      ? () => setOpen(false)
      : undefined
  });

  return (
    <>
      {isOpen &&
        renderLayer(
          <Layer
            {...layerProps}
            style={{
              ...layerProps.style,
              width: layerSettings.width,
              height: layerSettings.height
            }}
            layerSettings={layerSettings}
            onLayerSettingsChange={onLayerSettingsChange}
            arrowProps={arrowProps}
          >
            Layer
          </Layer>
        )}
      <PrimaryButton
        {...triggerProps}
        style={style}
        onClick={() => setOpen(!isOpen)}
      >
        Trigger
      </PrimaryButton>
    </>
  );
}

export default Preview;
