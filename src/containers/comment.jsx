import React from "react";
import styled from "styled-components";
import { colors } from "../components/color-theme";

import Flair from "../components/flair";
import { Votes } from "../components/votes";
import { Timestamp } from "../components/timestamp";
import { SimplifyNumber } from "../components/simplify-number";
import { FormatNumber } from "../components/format-number";
import { ActionBar } from "../components/action-bar";
// import { Banner } from "./banners";
import { Author } from "../components/author";
// import Button from "./icon-button";
// import ReactTooltip from "react-tooltip";

import { ReactComponent as Expand } from "../icons/plus-square.svg";

const Score = ({ score, mod, score_hidden }) => {
  return score_hidden ? (
    <span className="score">[score hidden]</span>
  ) : (
    <SimplifyNumber number={score + mod} className="score" label="point" />
  );
};

// const Scorey = styled.span``;

const Separator = styled.span`
  color: ${colors.grey30};
  after: {
    content: "•";
    margin: 0 0.35em;
  }
`;

export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      depth: 0,
      mod: 0,
      collapse: props.collapse,
      className: "comment",
      numChildren: 0,
      hideButtonLabels: true,
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
      primary_color,
      key_color,
      author,
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
    const { collapse, mod, hideButtonLabels } = this.state;

    let _className = collapse ? "collapsed comment" : "comment";

    if (author.name === "automoderator") {
      _className += " automoderator";
    }
    return (
      <div className={_className} id={id}>
        <div className="left">
          {/* <Button
            icon={collapse ? "Expand" : "Collapse"}
            onClick={this.toggleCollapse}
            className="expando"
          /> */}
          <Expand className="expando" onClick={this.toggleCollapse} />
          <Votes mod={mod} upvote={this.upvote} downvote={this.downvote} />
          <div className="collapse" onClick={this.toggleCollapse}>
            <div className="threadline" />
          </div>
        </div>
        <div className="right">
          <div className="tagline">
            <Author
              authorName={author.name}
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
            <Separator />
            <Score>{FormatNumber(score + mod, "point")}</Score>
            <Separator />
            <Timestamp time={created_utc} to={"#" + id} />
            {edited ? (
              <Timestamp
                time={edited}
                data-tip="view comments"
                tooltipLabel="Edited "
                label="*"
              />
            ) : null}
          </div>
          <div
            className="body"
            dangerouslySetInnerHTML={{
              __html: body_html,
            }}
          />
          <ActionBar
            hideLabels={hideButtonLabels}
            id={id}
            permalink={permalink}
            color={primary_color || key_color}
            toggleButtonLabels={this.toggleButtonLabels}
            showVoteButtons
            mod={mod}
            upvote={this.upvote}
            downvote={this.downvote}
          />
          <div className={"context depth-" + depth}>
            {replies.map(child => (
              <Comment {...child} key={child["id"]} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
