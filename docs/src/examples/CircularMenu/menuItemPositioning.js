import { ITEM_SIZE, MARGIN_RIGHT, RADIUS } from "./constants";

function getCirclePositionPart1(progress, radius) {
  return {
    x: 0,
    y: progress * -radius
  };
}

function getCirclePositionPart2(progress, index, nrOfItems, radius) {
  const offset = -25;
  const endpoint = 100 - index * (100 / nrOfItems);
  const value = progress * endpoint + offset;

  const x = radius * Math.cos((Math.PI * value * 2) / 100);
  const y = radius * Math.sin((Math.PI * value * 2) / 100);

  return {
    x,
    y
  };
}

function getCircleItemPosition(value, radius, itemIndex, nrOfItems) {
  const SPLIT_ANIMATION_AT = 0.2;

  const scale = value / 2 + 0.5;

  const { x, y } =
    value < SPLIT_ANIMATION_AT
      ? getCirclePositionPart1(value / SPLIT_ANIMATION_AT, radius)
      : getCirclePositionPart2(
          (value - SPLIT_ANIMATION_AT) / (1 - SPLIT_ANIMATION_AT),
          itemIndex,
          nrOfItems,
          radius
        );

  return `translate(${x}px, ${y}px) scale(${scale})`;
}

function getHorizontalPosition(value, index, nrOfItems) {
  const totalItemSize = ITEM_SIZE + MARGIN_RIGHT;
  const half = (nrOfItems - 1) / 2;
  const halfWidth = half * totalItemSize;

  const scale = value / 2 + 0.5;

  return `translate(${index * totalItemSize * value -
    halfWidth}px, ${0}px) scale(${scale})`;
}

export default function getTransform(
  value,
  shouldTransitionShowHide,
  isHorizontal,
  index,
  nrOfItems
) {
  if (shouldTransitionShowHide && isHorizontal) {
    return value.interpolate(value => {
      return getHorizontalPosition(value - 1, index, nrOfItems);
    });
  }

  if (shouldTransitionShowHide && !isHorizontal) {
    return value.interpolate(x =>
      getCircleItemPosition(x, RADIUS, index, nrOfItems)
    );
  }

  if (isHorizontal) {
    return value.interpolate(
      [1, 2],
      [
        getCircleItemPosition(1, RADIUS, index, nrOfItems),
        getHorizontalPosition(1, index, nrOfItems)
      ]
    );
  }

  return value.interpolate(
    [2, 1],
    [
      getHorizontalPosition(1, index, nrOfItems),
      getCircleItemPosition(1, RADIUS, index, nrOfItems)
    ]
  );
}
