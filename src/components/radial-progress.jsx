import React, { useState, useEffect } from "react";
import styled from "styled-components";

import formatMs from "../utils/format-ms";

export const Timer = ({ duration = 10, onComplete, showTimer }) => {
  const [s, setS] = useState(duration);

  useEffect(() => {
    const interval = setInterval(() => {
      setS((s) => (s <= 0 ? duration : s - 1));
    }, 100);
    return () => clearInterval(interval);
  }, [duration, setS]);

  // useEffect(() => {
  //   if (seconds === 0 && onComplete) onComplete();
  // }, [seconds, onComplete])

  return (
    <span>
      {formatMs(Math.ceil(s))}
      <RadialProgress progress={1 - s / duration} radius="32" />
    </span>
  );
};

const RadialProgress = ({ size = "24", progress }) => {
  const strokeWidth = size / 10;
  const r = size / 2 - strokeWidth;
  const c = 2 * Math.PI * r;
  return (
    <SVG width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={strokeWidth}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - progress)}
      >
        <Text>{progress}</Text>
      </Circle>
    </SVG>
  );
};
const SVG = styled.svg`
  transform: rotate(-90deg);
`;

const Circle = styled.circle`
  stroke: ${({theme}) => theme.highlight};
  fill: none;
  stroke-linecap: round;
`;

const Text = styled.text`
  color: ${({theme}) => theme.highlight};
`;

export default RadialProgress;
