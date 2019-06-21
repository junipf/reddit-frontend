import React from "react";
import styled from "styled-components";
import Button from "./button";
import Toggle from "./toggle";
import { FormatNumber } from "../utils/format-number";

const Group = styled.div``;

export const ActionBar = props => {
  const {
    hideLabels,
    num_comments,
    color,
    permalink,
    saved,
    hide,
    save,
    post,
    children,
    toggleButtonLabels,
    upvote,
    downvote,
    mod,
    showVoteButtons,
  } = props;

  const numComments = FormatNumber(num_comments);

  const CommentsButton = () => (
    <Button
      type="primary"
      label={numComments}
      color={color}
      to={permalink}
      data-tip={numComments !== num_comments && num_comments}
      icon="message"
      key="1"
    />
  );

  const ReplyButton = () => (
    <Button
      isPrimary
      hideLabel={hideLabels}
      label="reply"
      icon="reply"
      key="2"
    />
  );

  const ShareButton = () => (
    <Button hideLabel={hideLabels} label="share" icon="share" key="3" />
  );

  const SaveButton = () => (
    <Button
      hideLabel={hideLabels}
      label="save"
      icon="star"
      isToggled={saved}
      onClick={save}
      key="4"
    />
  );

  const HideButton = () => (
    <Button
      hideLabel={hideLabels}
      label="hide"
      icon="trash"
      onClick={hide}
      key="5"
    />
  );
  const ReportButton = () => (
    <Button hideLabel={hideLabels} label="report" icon="eye" key="6" />
  );
  const RedditButton = () => (
    <Button
      hideLabel={hideLabels}
      label="view on reddit"
      icon="external"
      href={"https://www.reddit.com" + permalink}
      key="7"
    />
  );
  const ToggleLabelsButton = () => (
    <Toggle
      hideLabel
      label="toggle button labels"
      onIcon="chevronleft"
      offIcon="chevronright"
      onToggle={toggleButtonLabels}
      key="8"
    />
  );
  const Upvote = () => (
    <Button
      hideLabel
      label="upvote"
      icon="arrowup"
      onClick={upvote}
      toggle
      isToggled={mod === 1}
      key="9"
    />
  );
  const Downvote = () => (
    <Button
      hideLabel
      label="upvote"
      icon="arrowdown"
      onClick={downvote}
      toggle
      isToggled={mod === -1}
      key="10"
    />
  );

  if (post) {
    return (
      <Group>
        {children}
        <CommentsButton />
        <ShareButton />
        <SaveButton />
        <HideButton />
        <ReportButton />
        <RedditButton />
        <ToggleLabelsButton />
      </Group>
    );
  }
  return (
    <Group>
      {children}
      {showVoteButtons ? (
        <>
          <Upvote />
          <Downvote />
        </>
      ) : null}
      <ReplyButton />
      <ShareButton />
      <ReportButton />
      <RedditButton />
      <ToggleLabelsButton />
    </Group>
  );
};
