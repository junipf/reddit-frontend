import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
`;

const Underline = styled.div`
  position: absolute;
  bottom: -0.125rem;
  width: 100%;
`;

const Progress = styled.div`
  width: inherit;
  background-color: transparent;
`;

const Bar = styled.div`
  width: 0;
  height: 0.25rem;
  background-color: ${({theme}) => theme.highlight};
  border-radius: 1rem;
  box-shadow: 0 0 5px 0 ${({theme}) => theme.focus.glow};
  animation: growInPushOut 2s cubic-bezier(0.5, 0, 0.66, 1) infinite;
  @keyframes growInPushOut {
    25% {
      margin-left: 0;
    }
    50% {
      width: 100%;
    }
    75% {
      margin-left: 100%;
    }
    100% {
      margin-left: 100%;
      width: 100%;
    }
  }
`;

export const ProgressUnderline = () => (
  <Underline>
    <Progress>
      <Bar />
    </Progress>
  </Underline>
);

export const ProgressOverlay = () => (
  <Overlay>
    <Progress>
      <Bar />
    </Progress>
  </Overlay>
);
