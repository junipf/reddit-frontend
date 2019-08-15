import React, { useState } from "react";
import styled from "styled-components";

import Flair from "../components/flair";
import Votes from "../components/votes";
import { Timestamp } from "../components/timestamp";
import Tag from "../components/tags";
import Button from "../components/button";
import { Author } from "../components/author";
import { formatNumber } from "./../utils/format-number";
import Reply from "./../components/reply";

const StyledComment = styled.div`
  display: flex;
  margin-top: 0.75rem;
`;
const Left = styled.div`
  margin-right: 0.125rem;
  font-size: 1rem;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Collapse = styled.div`
  height: 100%;
  width: 1rem;
  display: flex;
  justify-content: center;
  :hover > * {
    opacity: 0.5;
  }
`;
const Threadline = styled.div`
  background-color: currentColor;
  opacity: 0.3;
  width: 0.125rem;
  border-radius: 0.5rem;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
`;
const Right = styled.div`
  flex: 1 1 auto;
  max-width: 100%;
`;
const Tagline = styled.div`
  font-size: 0.75rem;
  margin-top: 0.25rem;
  & > * {
    margin-right: 0.5rem;
  }
`;
const Tags = styled.span`
  font-size: 1.25em;
`;
const Context = styled.div`
  z-index: 1;
`;
const Actions = styled.div`
  opacity: 0.8;
  margin: 0 0.25rem 0 -0.25rem;
  font-size: 0.85rem;
  z-index: 10;
`;
const Body = styled.div`
  font-size: 0.9rem;
  /* margin: 0.5rem 0.125rem; */
  blockquote {
    border-color: ${({ theme }) => theme.card.innerBorder};
  }
  a {
    color: ${({ theme }) => theme.link};
  }
`;

const Comment = ({ comment, username, loggedIn }) => {
  const {
    permalink,
    id,
    // primary_color,
    // key_color,
    author: { name: authorName },
    depth: inheritedDepth,
    score,
    score_hidden,
    edited,
    created_utc,
    body_html,
    distinguished,
    is_submitter,
    likes,
    saved: inheritedSaved,
    hidden: inheritedHidden,
    replies: inheritedReplies,
    collapse: inheritedCollapse,

    author_flair_type,
    author_flair_text,
    author_flair_template_id,
    author_flair_richtext,
    author_flair_text_color,
    author_flair_background_color,
    locked,
    stickied,
  } = comment;

  const [mod, setMod] = useState(likes === true ? 1 : likes === false ? -1 : 0);
  const [saved, setSaved] = useState(inheritedSaved);
  const [hidden, setHidden] = useState(inheritedHidden);
  const [replies, setReplies] = useState(inheritedReplies);
  // const [showReplies, setShowReplies] = useState(props.collapse);
  const [collapse, setCollapse] = useState(inheritedCollapse);
  const [showReply, setShowReply] = useState(false);
  const [draft, setDraft] = useState("");
  const toggleShowReply = () => {
    setShowReply(!showReply);
  };

  const reply = (value) => {
    comment.reply(value).then(
      (reply) => {
        setReplies([reply, ...replies]);
      },
      (error) => console.error(error)
    );
    setShowReply(false);
  };

  const cancelReply = (value) => {
    setDraft(value);
    setShowReply(false);
  };

  const save = () =>
    saved
      ? comment.unsave().then(setSaved(false))
      : comment.save().then(setSaved(true));
  const hide = () =>
    hidden
      ? comment.unhide().then(setHidden(false))
      : comment.hide().then(setHidden(true));
  const upvote = () =>
    mod > 0
      ? comment.unvote().then(setMod(0))
      : comment.upvote().then(setMod(1));
  const downvote = () =>
    mod < 0
      ? comment.unvote().then(setMod(0))
      : comment.downvote().then(setMod(-1));
  const toggleCollapse = () => setCollapse(!collapse);
  // const toggleShowReplies = () => setShowReplies(!showReplies);

  const depth = inheritedDepth || 0;

  const own = username === authorName;
  return (
    <StyledComment id={id}>
      <Left>
        {collapse ? (
          <Button
            size="small"
            type="flat"
            icon={collapse ? "plus" : "minus"}
            label={collapse ? "plusSquare" : "minusSquare"}
            hideLabel
            noMargin
            onClick={toggleCollapse}
          />
        ) : (
          <>
            <Votes
              own={own}
              mod={mod}
              upvote={upvote}
              downvote={downvote}
              size="small"
              disabled={!loggedIn}
            />
            <Collapse onClick={toggleCollapse}>
              <Threadline />
            </Collapse>
          </>
        )}
      </Left>
      <Right>
        <Tagline>
          <Author
            authorName={authorName}
            distinguished={distinguished}
            is_submitter={is_submitter}
          />
          <Flair
            backgroundColor={author_flair_background_color}
            color={author_flair_text_color}
            richText={author_flair_richtext}
            w
            templateId={author_flair_template_id}
            text={author_flair_text}
            type={author_flair_type}
          />
          {score_hidden ? (
            <span>Score hidden</span>
          ) : (
            <span data-tip={score + mod}>
              {formatNumber(score + mod, "point")}
            </span>
          )}
          <Timestamp time={created_utc} to={"#" + id} />
          {edited ? (
            <Timestamp
              time={edited}
              data-tip="view comments"
              tooltipLabel="Edited "
              label="*"
            />
          ) : null}
          <Tags>
            {stickied ? <Tag.Stickied /> : null}
            {locked ? <Tag.Locked /> : null}
          </Tags>
        </Tagline>
        {!collapse && (
          <>
            <Body
              dangerouslySetInnerHTML={{
                __html: body_html,
              }}
            />
            {loggedIn ? (
              <Actions>
                {!locked ? (
                  <Button
                    label="Reply"
                    type="flat"
                    size="small"
                    icon="cornerDownRight"
                    onClick={toggleShowReply}
                    key="reply"
                  />
                ) : null}
                <Button
                  hideLabel
                  type="flat"
                  toggled={saved}
                  label={saved ? "unsave" : "save"}
                  icon="star"
                  onClick={save}
                  key="save"
                />
                <Button
                  hideLabel
                  type="flat"
                  toggled={hidden}
                  label={hidden ? "unhide" : "hide"}
                  icon="star"
                  onClick={hide}
                  key="hide"
                />
                <Button
                  label="view on reddit"
                  hideLabel
                  type="flat"
                  size="small"
                  icon="externalLink"
                  href={"https://www.reddit.com" + permalink}
                  key="onReddit"
                />
                {process.env.NODE_ENV === "development" ? (
                  <Button
                    label="Log to console"
                    type="flat"
                    size="small"
                    hideLabel
                    icon="terminal"
                    onClick={() => console.log(comment)}
                    key="log"
                  />
                ) : null}
              </Actions>
            ) : null}
            {loggedIn && showReply ? (
              <Reply
                autoFocus
                onSubmit={reply}
                onCancel={cancelReply}
                draft={draft}
              />
            ) : null}
            <Context depth={depth}>
              {/* {replies.length} replies */}
              {replies.map((child) => (
                <Comment
                  comment={child}
                  username={username}
                  key={child.id}
                  loggedIn={loggedIn}
                />
              ))}
            </Context>
          </>
        )}
      </Right>
    </StyledComment>
  );
};

export default Comment;
