import * as React from "react";
import { useGesture } from "react-use-gesture";
import { mergeRefs } from "../../util";
import { colors } from "../../theme";

import styled from "styled-components";

const BAR_HEIGHT = 5;
const CIRCLE_SIZE = 16;

const Base = styled.div`
  position: relative;
  height: ${CIRCLE_SIZE}px;
  margin-top: 2px;
`;

const Bar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  border-radius: 5px;
  transform: translateY(-50%);
  height: ${BAR_HEIGHT}px;
  overflow: hidden;
  background-color: ${colors["grey-200"]};
`;

const Circle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  width: ${CIRCLE_SIZE}px;
  height: ${CIRCLE_SIZE}px;
  background-color: ${colors["bg-dark"]};
  cursor: pointer;
  cursor: -webkit-grab;

  &:active {
    cursor: -webkit-grabbing;
  }
`;

interface SingleProps {
  style?: React.CSSProperties;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
}

function useDimensions() {
  const ref = React.useRef<HTMLDivElement>();
  const [state, setState] = React.useState({ width: 0, height: 0 });

  React.useLayoutEffect(() => {
    const { width, height } = ref.current!.getBoundingClientRect();
    setState({ width, height });
  }, []);

  return [ref, state] as [any, typeof state];
}

function round(num: number, increment: number, offset: number) {
  return Math.ceil((num - offset) / increment) * increment + offset;
}

type UseSliderProps = {
  value: number;
  width: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  step: number;
};

function useSlider({ value, width, onChange, min, max, step }: UseSliderProps) {
  const lastValue = React.useRef<number>(value);

  const [isDragging, setDragging] = React.useState(false);

  const bind = useGesture({
    onDragEnd: () => {
      setDragging(false);
    },
    onDragStart: (props: any) => {
      lastValue.current = value;
      setDragging(true);
      props.event.preventDefault();
    },
    onDrag: ({ delta }) => {
      const movedValue = (max - min) * (delta[0] / width);

      let newValue = lastValue.current! + movedValue;
      if (newValue < min) {
        newValue = min;
      }
      if (newValue > max) {
        newValue = max;
      }

      onChange(round(newValue, step, min));
    }
  });

  const x = ((value - min) / (max - min)) * width;

  return [bind as any, x as number, isDragging as boolean];
}

function useCircleAnimation(isDragging: boolean) {
  const [isOver, setOver] = React.useState(false);

  const style: React.CSSProperties = {
    backgroundColor: isDragging
      ? colors["gradient-light"]
      : isOver
      ? colors["gradient-light"]
      : colors["gradient-dark"],
    boxShadow: `0px 1px 2px 0.5px rgba(0, 0, 0, ${isDragging ? 0.4 : 0.2})`
  };

  return [
    style,
    {
      onMouseEnter: () => setOver(true),
      onMouseLeave: () => setOver(false)
    }
  ] as const;
}

export default React.forwardRef(function Single(
  {
    style,
    className,
    value = 0,
    min = 0,
    max = 100,
    onChange,
    step = 1
  }: SingleProps,
  ref: any
) {
  const [baseRef, { width }] = useDimensions();

  const [bind, x, isDragging] = useSlider({
    value,
    width,
    onChange,
    min,
    max,
    step
  });

  const [aniStyle, isOverBind] = useCircleAnimation(isDragging);

  return (
    <Base ref={mergeRefs(ref, baseRef)} style={style} className={className}>
      <Bar />
      <Circle
        {...bind()}
        {...isOverBind}
        style={{
          transform: `translateX(${x - CIRCLE_SIZE / 2}px)`,
          ...aniStyle
        }}
      />
    </Base>
  );
});
