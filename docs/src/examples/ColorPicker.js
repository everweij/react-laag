import * as React from "react";
import styled from "styled-components";
import { useToggleLayer } from "react-laag";
import { ChromePicker } from "react-color";
import ResizeObserver from "resize-observer-polyfill";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Box = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 4px;
  margin-bottom: 12px;
  margin-right: 12px;
  box-sizing: border-box;
`;

const initialBoxes = new Array(100).fill(null).map((_, index) => ({
  id: index,
  color: "lightgrey"
}));

function Name({}) {
  const [boxes, setBoxes] = React.useState(initialBoxes);

  const [selectedId, setSelectedId] = React.useState(null);

  const [element, toggleLayerProps] = useToggleLayer(
    ({ isOpen, layerProps }) =>
      isOpen && (
        <div onClick={evt => evt.stopPropagation()} {...layerProps}>
          <ChromePicker
            disableAlpha
            color={boxes.find(box => box.id === selectedId).color}
            onChange={color => {
              const newBoxes = boxes.slice(0);
              const index = boxes.findIndex(box => box.id === selectedId);

              newBoxes.splice(index, 1, {
                ...newBoxes[index],
                color: color.hex
              });

              setBoxes(newBoxes);
            }}
          />
        </div>
      ),
    {
      ResizeObserver,
      placement: {
        anchor: "BOTTOM_CENTER",
        autoAdjust: true,
        triggerOffset: 12,
        scrollOffset: 16,
        snapToAnchor: true,
        possibleAnchors: [
          "BOTTOM_CENTER",
          "LEFT_CENTER",
          "RIGHT_CENTER",
          "TOP_CENTER"
        ]
      }
    }
  );

  return (
    <div
      onClick={() => {
        toggleLayerProps.close();
        setSelectedId(null);
      }}
    >
      {element}
      <Wrapper>
        {boxes.map(box => (
          <Box
            key={box.id}
            onClick={evt => {
              if (toggleLayerProps.isOpen && selectedId === box.id) {
                toggleLayerProps.close();
                return;
              }

              evt.stopPropagation();
              toggleLayerProps.openFromMouseEvent(evt);
              setSelectedId(box.id);
            }}
            style={{
              border: `2px solid ${
                selectedId === box.id ? "#00adff" : "transparent"
              }`,
              backgroundColor: box.color
            }}
          />
        ))}
      </Wrapper>
    </div>
  );
}

export default Name;
