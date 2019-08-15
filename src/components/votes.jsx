import React from "react";
import styled, { withTheme } from "styled-components";
import Button from "./button";
import { formatNumber } from "../utils/format-number";

const VotesWrapper = styled.div`
  margin: ${({size}) => (size === "small" ? "0" : "0.25em")};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Score = styled.span`
  font-size: 0.85em;
  color: ${({mod, theme}) =>
    mod === 1
      ? theme.votes.up
      : mod === -1
      ? theme.votes.down
      : null};
  &:hover {
    text-decoration: underline dotted;
    cursor: help;
  }
`;

const Votes = ({
  size,
  mod,
  score,
  own,
  upvote,
  downvote,
  showDot,
  disabled,
  ...props
}) => (
  <VotesWrapper size={size} {...props}>
    <Button
      onClick={upvote}
      icon="upvote"
      type="flat"
      noMargin
      size={size}
      color={mod === 1 ? props.theme.votes.up : undefined}
      fill={mod === 1 ? true : undefined}
      disabled={disabled}
    />
    {score ? (
      <Score
        mod={mod}
        data-tip={Intl.NumberFormat().format(own ? score : score + mod) + " points"}
        data-tip-disabled={score.length <= 3}
      >
        {formatNumber(own ? score : score + mod)}
      </Score>
    ) : showDot ? (
      <span>•</span>
    ) : null}
    <Button
      onClick={downvote}
      icon="downvote"
      type="flat"
      noMargin
      size={size}
      color={mod === -1 ? props.theme.votes.down : undefined}
      fill={mod === -1 ? "true" : undefined}
      disabled={disabled}
    />
  </VotesWrapper>
);

export default withTheme(Votes);
