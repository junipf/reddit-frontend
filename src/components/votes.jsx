import React from "react";
import styled from "styled-components";
import Button from "./button";
import { formatNumber } from "../utils/format-number";

const VotesWrapper = styled.div`
  padding: ${props=>props.size === "small" ? "0" : "0.25em"};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Votes = ({ size, mod, score, upvote, downvote, showDot, ...props }) => (
  <VotesWrapper size={size} {...props}>
    <Button
      onClick={upvote}
      icon="chevronUp"
      type="flat"
      noMargin
      size={size}
      color={mod === 1 ? "orange" : null}
    />
    {score ? (
      <span>{formatNumber(score)}</span>
    ) : showDot ? (
      <span>•</span>
    ) : null}
    <Button
      onClick={downvote}
      icon="chevronDown"
      type="flat"
      noMargin
      size={size}
      color={mod === -1 ? "blue" : null}
    />
  </VotesWrapper>
);