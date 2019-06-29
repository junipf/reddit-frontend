import React from "react";
import styled from "styled-components";
import Post from "./post";

const StyledCrosspost = styled.div`
  grid-area: media;
`;

const Crosspost = props => {
  const { crosspost, inListing } = props;
  if (inListing || crosspost === null) {
    return null;
  }
  return (
    <StyledCrosspost>
      <Post post={crosspost[0]} compact />
    </StyledCrosspost>
  );
};

export default Crosspost;
