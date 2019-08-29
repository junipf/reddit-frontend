import React from "react";
import styled from "styled-components";

const SVGWrapepr = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  svg {
    z-index: 2;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -0.5em 0 0 -0.5em;
    width: 1em;
    height: 1em;

    animation: rotate 2s linear infinite;
    & circle {
      stroke: currentColor;
      stroke-linecap: round;
      stroke-width: 3px;
      animation: dash 1.5s ease-in-out infinite;
    }
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`;

export const Spinner = (props) => (
  <SVGWrapepr>
    <svg viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="20" fill="none" />
    </svg>
  </SVGWrapepr>
);

export const SpinnerPage = (props) => (
  <Page {...props}>
    <Spinner />
  </Page>
);
const Page = styled.div.attrs(({ color }) => ({
  style: { color },
}))`
  margin: auto auto;
  height: 20vh;
  font-size: 1.5rem;
  color: ${({theme}) => theme.text};
`;
