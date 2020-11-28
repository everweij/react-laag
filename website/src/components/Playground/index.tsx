import * as React from "react";
import styled from "styled-components";
import { DEFAULT_OPTIONS } from "../../../../src";
import Preview from "./Preview";
import { Options as OptionsType, LayerSettings } from "./types";
import Options from "./Options";
import Code from "./Code";
import { colors } from "../../theme";
import useUrlState from "../../useUrlState";

const SCROLL_BOX_INNER_SIZE = 2000;
const SCROLL_BOX_SIZE = 480;
const BUTTON_SIZE = {
  width: 106,
  height: 46
};

const Layout = styled.div`
  min-height: 100vh;
  width: 100vw;
  max-width: 1680px;
  margin: 0 auto;
  display: flex;
  position: relative;
  align-items: flex-start;
`;

const OptionsContainer = styled.div`
  width: 260px;
  min-width: 260px;
  min-height: 600px;
  height: 100vh;
  position: sticky;
  overflow: auto;
  top: 0px;
  background: #fbfbfb;
  box-shadow: 4px 5px 20px 0 rgba(110, 26, 82, 0.08);
`;

const PreviewContainer = styled.div`
  flex: 2;
  min-height: 600px;
  height: 200vh;
  display: flex;
  justify-content: center;
  background: radial-gradient(#df75b8, #c34597);
  background-size: 100vh;
  background-position: 50%;
`;

const ScrollBox = styled.div`
  background-color: #d05aa4;
  width: ${SCROLL_BOX_SIZE}px;
  height: ${SCROLL_BOX_SIZE}px;
  overflow: scroll;
  border-radius: 4px;
  border: 2px dashed #a94382;
  margin-top: calc(100vh / 2 - ${SCROLL_BOX_SIZE}px / 2);
  position: relative;
  box-shadow: inset 1px 1px 20px 6px rgba(130, 11, 86, 0.16);

  &::-webkit-scrollbar {
    -webkit-appearance: none;

    :vertical {
      width: 7px;
    }

    :horizontal {
      height: 7px;
    }
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: ${colors["bg-dark"]};
  }

  &::-webkit-scrollbar-corner {
    -webkit-appearance: none;
    background-color: ${colors["bg-dark"]};
  }
`;

const CodeContainer = styled.div`
  flex: 1;
  max-width: 800px;
  min-width: 700px;
  height: 100vh;
  min-height: 600px;
  background-color: ${colors["bg-code"]};
  position: sticky;
  padding: 32px;
  top: 0;
  overflow: auto;
`;

function Playground() {
  const scrollBoxRef = React.useRef<HTMLDivElement>(null!);

  const [options, setOptions] = useUrlState<OptionsType>({
    placement: DEFAULT_OPTIONS.placement,
    possiblePlacements: DEFAULT_OPTIONS.possiblePlacements,
    preferX: DEFAULT_OPTIONS.preferX,
    preferY: DEFAULT_OPTIONS.preferY,
    auto: DEFAULT_OPTIONS.auto,
    snap: DEFAULT_OPTIONS.snap,
    arrowOffset: 4,
    containerOffset: DEFAULT_OPTIONS.containerOffset,
    triggerOffset: DEFAULT_OPTIONS.triggerOffset,
    overflowContainer: DEFAULT_OPTIONS.overflowContainer,
    closeOnDisappear: false,
    closeOnOutsideClick: false
  });

  const [layerSettings, setLayerSettings] = React.useState<LayerSettings>({
    width: 200,
    height: 150,
    color: "light",
    arrowSize: 5,
    arrowRoundness: 0
  });

  React.useEffect(() => {
    scrollBoxRef.current.scrollTop =
      SCROLL_BOX_INNER_SIZE / 2 - SCROLL_BOX_SIZE / 2 + BUTTON_SIZE.height / 2;
    scrollBoxRef.current.scrollLeft =
      SCROLL_BOX_INNER_SIZE / 2 - SCROLL_BOX_SIZE / 2 + BUTTON_SIZE.width / 2;
  }, []);

  return (
    <Layout>
      <OptionsContainer>
        <Options options={options} onOptionsChange={setOptions} />
      </OptionsContainer>
      <PreviewContainer>
        <ScrollBox ref={scrollBoxRef}>
          <Preview
            options={options}
            style={{
              position: "relative",
              top: SCROLL_BOX_INNER_SIZE / 2,
              left: SCROLL_BOX_INNER_SIZE / 2
            }}
            layerSettings={layerSettings}
            onLayerSettingsChange={setLayerSettings}
          />
          <div
            style={{
              width: SCROLL_BOX_INNER_SIZE,
              height: SCROLL_BOX_INNER_SIZE
            }}
          />
        </ScrollBox>
      </PreviewContainer>
      <CodeContainer>
        <Code options={options} layerSettings={layerSettings} />
      </CodeContainer>
    </Layout>
  );
}

export default Playground;
