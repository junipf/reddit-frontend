// import React from "react";
import styled from "styled-components";

export const ScrollWrapper = styled.div`
  /* max-height: 80vh; */
  max-height: 100%;
  height: inherit;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: ${props => props.theme.scrollbar};
  /* padding-bottom: 0.5em; */
`;
