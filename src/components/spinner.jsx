import React from "react";

import styled from "styled-components";

const SpinnerWrapper = styled.div`
  /* .loader { */
  box-sizing: content-box;
  --size: 0.5em;
  --circumference: 3.14 * 2 * var(--size);
  --offset: 0.85;
  --circumference: var(--circumference) * var(--offset);
  .circle {
    stroke: blue;
    fill: none;
    stroke-width: 3px;
    stroke-dashoffset: calc(var(--circumference) * -1);
    stroke-dasharray: var(--circumference);
    animation: loading5 1.4s linear infinite;
    transform: rotate(-90deg);
    transform-origin: 50%;
    position: relative;
  }
  @keyframes loading5 {
    0% {
      transform: rotate(0);
      stroke-dashoffset: var(--circumference);
    }
    50% {
      stroke-dashoffset: 0;
    }
    100% {
      transform: rotate(360deg);
      stroke-dashoffset: calc(var(--circumference) * -1);
    }
  }
  /* } */
`;

const SvgWrapper = styled.div`
  --size: 0.5em;
  background: white;
  width: var(--size) * 3;
  height: var(--size) * 3;
  margin: 0 Auto;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Spinner = props => (
  <SpinnerWrapper>
    <SvgWrapper>
      <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em">
        <circle cx="0.6em" cy="0.6em" r="0.5em" className="circle" />
      </svg>
    </SvgWrapper>
  </SpinnerWrapper>
);
