import React from "react";
import styled from "styled-components";
import Post from "./post";

const StyledCrosspost = styled.div`
  grid-area: media;
`;

const Crosspost = ({ crosspost, ...props }) =>
  crosspost &&
  crosspost[0] && (
    <StyledCrosspost>
      <Post {...props} post={crosspost[0]} compact />
    </StyledCrosspost>
  );

export default Crosspost;
