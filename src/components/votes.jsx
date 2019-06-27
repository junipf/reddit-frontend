import React from "react";
import styled from "styled-components";
import Button from "./button";
import { SimplifyNumber } from "./simplify-number";

const VotesWrapper = styled.div`
  padding: 0.25em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Votes = ({ mod, score, upvote, downvote, showDot, ...props }) => (
  <VotesWrapper {...props}>
    <Button
      onClick={upvote}
      icon="chevronUp"
      type="flat"
      noMargin
      color={mod === 1 ? "orange" : null}
    />
    {score ? (
      <SimplifyNumber number={score} />
    ) : showDot ? (
      <span>•</span>
    ) : null}
    <Button
      onClick={downvote}
      icon="chevronDown"
      type="flat"
      noMargin
      color={mod === -1 ? "blue" : null}
    />
  </VotesWrapper>
);