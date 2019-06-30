import React from "react";
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
`;
const Context = styled.div`
  
`;
const Actions = styled.div`
  opacity: 0.8;
  margin: 0 0.25rem 0 -0.25rem;
  font-size: 0.75rem;
`;
const Body = styled.div`
  font-size: 0.9rem;
  margin: 0.25rem 0;
  blockquote {
    border-color: ${props => props.theme.container.innerBorder};
  }
  a {
    color: ${props => props.theme.container.link};
  }
`;

export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      depth: 0,
      mod: 0,
      collapse: props.collapse,
      numChildren: 0,
      hideButtonLabels: true,
      compact: false,
    };
  }
  upvote = () => {
    let mod = this.state.mod > 0 ? 0 : 1;
    this.setState({ mod });
  };
  downvote = () => {
    let mod = this.state.mod < 0 ? 0 : -1;
    this.setState({ mod });
  };
  toggle;
  toggleButtonLabels = () => {
    this.setState({
      hideButtonLabels: !this.state.hideButtonLabels,
    });
  };
  toggleCollapse = () => {
    this.setState({
      collapse: !this.state.collapse,
    });
  };
  shouldComponentUpdate(prevProps, prevState) {
    return this.state !== prevState;
  }
  render() {
    const {
      permalink,
      id,
      // primary_color,
      // key_color,
      author: { name: authorName },
      depth,
      score,
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
    } = this.props;
    const { collapse, mod } = this.state;

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
              onClick={this.toggleCollapse}
            />
          ) : (
            <>
              <Votes
                mod={mod}
                upvote={this.upvote}
                downvote={this.downvote}
                size="small"
              />
              <Collapse onClick={this.toggleCollapse}>
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
                  type="flat"
                  label="reply"
                  icon="reply"
                  key="2"
                />
                <Button
                  hideLabel
                  type="flat"
                  label="view on reddit"
                  icon="external"
                  href={"https://www.reddit.com" + permalink}
                  key="3"
                />
              </Actions>
              <Context depth={depth}>
                {replies.map(child => (
                  <Comment {...child} key={child["id"]} />
                ))}
              </Context>
            </>
          )}
        </Right>
      </StyledComment>
    );
  }
}
