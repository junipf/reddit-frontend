import React from "react";
import styled, { ThemeProvider, withTheme } from "styled-components";
import { withRouter } from "react-router";

import Button from "../components/button";
import Toggle from "../components/toggle";
import { FormatNumber } from "../utils/format-number";

import Flair from "../components/flair";
import { Timestamp } from "../components/timestamp";
import { Votes } from "../components/votes";
import { Link } from "react-router-dom";
import { Author } from "../components/author";
import SubredditIcon from "../components/subreddit-icon";
import { Tags } from "../components/tags";
import { InfoBanners } from "../components/banners";
import Icon from "../components/icon";

import { genTheme } from "../utils/color";
import Preview from "../components/preview";
import Thumbnail from "../components/thumbnail";

function Crosspost(props) {
  const { crosspost, inListing } = props;
  if (inListing || crosspost === null) {
    return null;
  }
  const {
    url,
    title,
    permalink,
    preview,
    media,
    // subreddit,
    // author_flair_background_color,
    // author_flair_text_color,
    // author_flair_richtext,
    // author_flair_template_id,
    // author_flair_text,
    // author_flair_type,
    // authorName,
    // id,
    // distinguished,
    // crosspost_parent_list,
    // created_utc,
  } = crosspost[0];
  return (
    <StyledCrosspost>
      <Title url={url} permalink={permalink} title={title} />
      <Preview preview={preview} media={media} />
    </StyledCrosspost>
  );
}

const StyledCrosspost = styled.div`
  border: 1px solid ${props => props.theme.container.innerBorder};
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-top: 0.25em;
`;

const StyledPost = styled.div.attrs(props => ({
  id: props.id,
}))`
  border-width: 1px
  border-style: solid;
  margin: 0.5em 0.5em 0 0.5em;
  transition: outline 0.1s ease;
  outline: 1px solid transparent;
  /* display: flex; */
  /* flex-direction: row; */
  background: ${props => props.theme.container.levels[0]};
  border-color: ${props => props.theme.container.border};
  color: ${props => props.theme.container.color};
  
  display: grid;
  grid-template-columns: min-content auto min-content;
  grid-template-rows: min-content auto auto auto;
  grid-template-areas: "left tagline thumb" 
                       "left title   thumb"
                       "left media   thumb"
                       "left actions thumb";
  font-size: 0.85rem;
`;

const Left = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${props => props.theme.container.levels[2]};
  grid-area: left;
  padding-top: 0.5rem;
  min-width: 2rem;
`;

const Tagline = styled.span`
  margin: 0.65rem 0.5rem 0 0.5rem;
  grid-area: tagline;
  font-size: 0.75rem;
`;
const SubredditName = styled(Link)`
  font-weight: 500;
  color: ${props => props.theme.container.link};
  margin-right: 0.25rem;
`;

const TitleBox = styled.div`
  grid-area: title;
  margin: 0.25rem 0.5rem;
`;
const Title = styled(Link)`
  display: block;
  color: ${props => props.theme.container.titleColor};
  font-size: 1.2rem;
  font-weight: 400;
  text-decoration: none;
`;
const GoTo = styled.a`
  margin-top: 0.25rem;
  position: relative;
  top: -0.125em;
  display: block;
  color: inherit;
  text-decoration: none;
  font-size: 0.8rem;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`;

const ActionBar = styled.div`
  margin: 0.25rem;
  grid-area: actions;
`;

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mod: 0,
      expand: !props.inListing,
      saved: false,
      hidden: false,
      hideButtonLabels: true,
      pinned: false,
      showLightbox: false,
      LbFullImage: false,
      fullImageCoords: [0, 0],
    };
    this.post = React.createRef();
    this.navigateToPost = this.navigateToPost.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state !== nextState ||
      this.props.post !== nextProps ||
      this.props.compact !== nextProps ||
      this.props.subredditInfo !== nextProps.subredditInfo
    );
  }
  save = () => {
    this.setState({ saved: !this.state.saved });
  };
  hide = () => {
    this.setState({ hidden: !this.state.hidden });
  };
  toggleButtonLabels = () => {
    this.setState({
      hideButtonLabels: !this.state.hideButtonLabels,
    });
  };
  upvote = () => {
    let _mod = this.state.mod > 0 ? 0 : 1;
    this.setState({ mod: _mod });
  };
  downvote = () => {
    let _mod = this.state.mod < 0 ? 0 : -1;
    this.setState({ mod: _mod });
  };
  navigateToPost() {
    const { history, post } = this.props;
    history.push(post.permalink);
  }
  navigateToSubreddit = () => {
    const { history, subredditInfo } = this.props;
    history.push("/" + subredditInfo.display_name_prefixed);
  };
  logPost = () => console.log(this.props.post);

  render() {
    const { inListing, post, subredditInfo, inSubreddit, compact } = this.props;
    const {
      title,
      url,
      author,
      subreddit_name_prefixed: subNamePrefixed,
      // subreddit,
      id,
      score,
      // comments,
      permalink,
      created_utc,
      num_comments,

      saved,
      hidden,
      locked,
      // pinned,
      // spam,
      stickied,
      // removed,
      // edited,
      quarantine,
      archived,
      distinguished,
      is_original_content: oc,

      // can_mod_post,
      // removal_reason,
      // report_reasons,

      is_self,
      secure_media: media,
      preview,
      thumbnail_height,
      thumbnail_width,
      selftext_html,
      crosspost_parent_list,

      // hide_score: hideScore,
      over_18: nsfw,
      spoiler,

      link_flair_background_color,
      link_flair_richtext,
      link_flair_template_id,
      link_flair_text,
      link_flair_text_color,
      link_flair_type,

      author_flair_background_color,
      author_flair_richtext,
      author_flair_template_id,
      author_flair_text,
      author_flair_text_color,
      author_flair_type,

      // primary_color,
      // key_color,
      // ...rest
    } = post;

    const theme =
      link_flair_background_color && link_flair_background_color !== ""
        ? genTheme(link_flair_background_color, this.props.theme.dark)
        : this.props.theme;

    const authorFlair = {
      backgroundColor: author_flair_background_color,
      richText: author_flair_richtext,
      templateId: author_flair_template_id,
      text: author_flair_text,
      color: author_flair_text_color,
      type: author_flair_type,
    };

    const linkFlair = {
      backgroundColor: link_flair_background_color,
      richText: link_flair_richtext,
      templateId: link_flair_template_id,
      text: link_flair_text,
      color: link_flair_text_color,
      type: link_flair_type,
    };

    const authorName = author.name; //avoids undefined error

    const isCrosspost = crosspost_parent_list !== undefined;

    const isRedditLink =
      url === permalink ||
      /https?:\/\/(i)?(v)?(www)?\.redd(\.it)?(it\.com)?\//.test(url);

    const numComments = FormatNumber(num_comments);

    let displayUrl = url.replace(/https?:\/\/(www.)?/, "");
    if (displayUrl.length > 30) displayUrl = displayUrl.substring(0, 30) + "…";

    const showThumbnail =
      is_self ? false :
      (preview && compact) ||
        (!media &&
          preview &&
          !preview.reddit_video_preview &&
          !preview.enabled);

    if (!this.props || author === undefined) return null;
    return (
      <ThemeProvider theme={theme}>
        <StyledPost id={id} ref={this.post}>
          <Left>
            {!inSubreddit ? (
              <SubredditIcon
                {...subredditInfo}
                data-tip={"Go to " + subNamePrefixed}
                data-delay-show="500"
              />
            ) : null}
            <Votes
              showDot
              mod={this.state.mod}
              upvote={this.upvote}
              downvote={this.downvote}
              score={score + this.state.mod}
            />
            <InfoBanners
              stickied={stickied}
              archived={archived}
              locked={locked}
              hidden={hidden}
            />
          </Left>
          <Tagline>
            {!inSubreddit ? (
              <SubredditName to={"/" + subNamePrefixed}>
                {subNamePrefixed}
              </SubredditName>
            ) : null}
            <Flair {...linkFlair} />
            <Tags
              spoiler={spoiler}
              nsfw={nsfw}
              quarantine={quarantine}
              oc={oc}
            />
            <Author
              prefix
              authorName={authorName}
              distinguished={distinguished}
              isCrosspost={isCrosspost}
            />
            <Flair {...authorFlair} />
            <Timestamp time={created_utc} />
          </Tagline>
          <TitleBox>
            <Title to={permalink}>{title}</Title>
            {isRedditLink ? null : (
              <GoTo href={url}>
                {displayUrl + " "}
                <Icon icon="external" />
              </GoTo>
            )}
          </TitleBox>
          {!showThumbnail ? (
            <Preview
              is_self={is_self}
              html={selftext_html}
              isRedditLink={isRedditLink}
              inListing={inListing}
              isCrosspost={isCrosspost}
              preview={preview}
              media={media}
              navigateToPost={this.navigateToPost}
              url={url}
              permalink={permalink}
              nsfw={nsfw}
            />
          ) : null}
          <Crosspost
            crosspost={crosspost_parent_list || null}
            inListing={inListing}
          />
          <ActionBar>
            <Button
              type="primary"
              label={numComments}
              to={permalink}
              data-tip={numComments !== String(num_comments) && num_comments}
              icon="message"
              key="1"
            />
            <Button
              hideLabel={this.state.hideButtonLabels}
              label="share"
              icon="share"
              key="3"
            />
            <Toggle
              hideLabel={this.state.hideButtonLabels}
              label="save"
              icon="star"
              startOn={saved}
              onToggle={this.save}
              key="4"
            />
            <Toggle
              hideLabel={this.state.hideButtonLabels}
              label="hide"
              icon="trash"
              startOn={hidden}
              onToggle={this.hide}
              key="5"
            />
            <Button
              hideLabel={this.state.hideButtonLabels}
              label="report"
              icon="eye"
              key="6"
            />
            <Button
              hideLabel={this.state.hideButtonLabels}
              label="view on reddit"
              icon="external"
              href={"https://www.reddit.com" + permalink}
              key="7"
            />
            <Button
              hideLabel={this.state.hideButtonLabels}
              label="Log submission object to console"
              icon="debug"
              onClick={this.logPost}
              key="9"
            />
            <Toggle
              hideLabel
              label="toggle button labels"
              iconOn="chevronleft"
              iconOff="chevronright"
              onToggle={this.toggleButtonLabels}
              key="8"
            />
          </ActionBar>
          {/* <ModBanners isMod={can_mod_post} {...post} /> */}
          {showThumbnail ? (
            <Thumbnail
              preview={preview}
              inListing={inListing}
              parent={this.post}
              width={thumbnail_width}
              height={thumbnail_height}
            />
          ) : null}
        </StyledPost>
      </ThemeProvider>
    );
  }
}

export default withRouter(withTheme(Post));
