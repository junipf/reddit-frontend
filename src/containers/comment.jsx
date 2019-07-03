import React, { useState } from "react";
import styled from "styled-components";

import Flair from "../components/flair";
import { Votes } from "../components/votes";
import { Timestamp } from "../components/timestamp";
import Button from "../components/button";
import { Author } from "../components/author";
import { formatNumber } from "./../utils/format-number";

const StyledComment = styled.div`
  /* margin-top: 0.25rem; */
  display: flex;
  margin-top: 1rem;
`;
const Left = styled.div`
  width: 1.5rem;
  margin-right: 0.5rem;
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
  opacity: 0.8;
  & > * {
    margin-right: 0.5rem;
  }
`;
const Context = styled.div``;
const Actions = styled.div`
  opacity: 0.8;
  margin: 0 0.25rem 0 -0.25rem;
  font-size: 0.85rem;
`;
const Body = styled.div`
  font-size: 0.9rem;
  margin: 0.5rem 0.125rem;
  blockquote {
    border-color: ${props => props.theme.container.innerBorder};
  }
  a {
    color: ${props => props.theme.container.link};
  }
`;

export default props => {
  const [mod, setMod] = useState(0);
  const [collapse, setCollapse] = useState(props.collapse);
  // const [showReplies, setShowReplies] = useState(props.collapse);

  const upvote = () => setMod(mod > 0 ? 0 : 1);
  const downvote = () => setMod(mod < 0 ? 0 : -1);
  const toggleCollapse = () => setCollapse(!collapse);
  // const toggleShowReplies = () => setShowReplies(!showReplies);

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
    replies,
    distinguished,
    is_submitter,

    author_flair_type,
    author_flair_text,
    author_flair_template_id,
    author_flair_richtext,
    author_flair_text_color,
    author_flair_background_color,
  } = props;
  const depth = inheritedDepth || 0;
  return (
    <StyledComment id={id}>
      <Left>
        {collapse ? (
          <Button
            size="small"
            type="flat"
            icon={collapse ? "plus" : "minus"}
            label={collapse ? "Expand" : "Collapse"}
            hideLabel
            noMargin
            onClick={toggleCollapse}
          />
        ) : (
          <>
            <Votes mod={mod} upvote={upvote} downvote={downvote} size="small" />
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
            <span data-tip="score hidden">(?) </span>
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
        </Tagline>
        {!collapse && (
          <>
            <Body
              dangerouslySetInnerHTML={{
                __html: body_html,
              }}
            />
            <Actions>
              <Button
                label="Reply"
                // hideLabel
                type="flat"
                size="small"
                icon="reply"
                key="0"
              />
              <Button
                label="view on reddit"
                hideLabel
                type="flat"
                size="small"
                icon="external"
                href={"https://www.reddit.com" + permalink}
                key="1"
              />
              <Button
                label="Log submission object to console"
                type="flat"
                size="small"
                hideLabel
                icon="debug"
                onClick={() => console.log(props)}
                key="2"
              />
            </Actions>
            <Context depth={depth}>
              {replies.length} replies
              {/* {replies.map((child) => {
                  console.log(child);
                  if (!child.collapsed) {
                    return (<Comment {...child} key={child["id"]} />);
                  }
                  return <Button label="More" />;
                })} */}
            </Context>
          </>
        )}
      </Right>
    </StyledComment>
  );
};
