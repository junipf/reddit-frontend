import React, { useState } from "react";
import styled, { ThemeProvider, withTheme } from "styled-components";

import Button from "../components/button";
import Toggle from "../components/toggle";
import { formatNumber } from "../utils/format-number";

import Flair from "../components/flair";
import { Timestamp } from "../components/timestamp";
import { Votes } from "../components/votes";
import { Link } from "react-router-dom";
import { Author } from "../components/author";
import SubredditIcon from "../components/subreddit-icon";
import { Tags } from "../components/tags";
import { InfoBanners } from "../components/banners";
import Icon from "../components/icon";

import Comment from "./comment";

import Preview from "../components/preview";
import Thumbnail from "../components/thumbnail";
import Crosspost from "./crosspost";

const StyledPost = styled.div`
  display: grid;
  grid-template-columns: min-content auto min-content;
  grid-template-rows: min-content auto auto auto;
  grid-template-areas:
    "left tagline thumb"
    "left title   thumb"
    "left media   thumb"
    "left actions thumb";
  border-bottom-style: solid;
  border-bottom-color: ${props => props.theme.container.border};
  border-bottom-width: ${props => (props.showComments ? "1px" : "0")};
`;

const PostWrapper = styled.div.attrs(props => ({
  id: props.id,
}))`
  margin: ${props => (props.compact ? "0 auto" : "0.5rem auto 0 auto")};
  background: ${props => props.theme.container.levels[0]};
  color: ${props => props.theme.container.color};
  border-width: 1px
  border-style: solid;
  border-color: ${props => props.theme.container.border};
  border-radius: 0.25rem;
  overflow: hidden;
  font-size: 0.85rem;
  max-width: ${props => props.inListing ? "40rem" : "50rem"};
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
  font-size: ${props => props.compact ? "1rem" : "1.2rem"};
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

const Post = props => {
  const {
    post,
    inListing,
    inSubreddit,
    compact,
    theme,
    showComments,
    subredditInfo,
  } = props;

  const {
    title,
    url,
    author: { name: authorName },
    subreddit_name_prefixed: subNamePrefixed,
    id,
    score,
    comments,
    permalink,
    created_utc,
    num_comments,
    likes,

    saved: redditSaved,
    hidden: redditHidden,
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

  const [mod, setMod] = useState(likes === true ? 1 : likes === false ? -1 : 0);
  const [saved, setSaved] = useState(redditSaved);
  const [hidden, setHidden] = useState(redditHidden);

  const save = () =>
    saved
      ? post.unsave().then(setSaved(false))
      : post.save().then(setSaved(true));
  const hide = () =>
    hidden
      ? post.unhide().then(setHidden(false))
      : post.hide().then(setHidden(true));
  const upvote = () =>
    mod > 0 ? post.unvote().then(setMod(0)) : post.upvote().then(setMod(1));
  const downvote = () =>
    mod < 0 ? post.unvote().then(setMod(0)) : post.downvote().then(setMod(-1));
  const navigateToPost = () => props.setCurrentPost(post);

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

  const isCrosspost = crosspost_parent_list !== undefined;
  const isRedditLink =
    url === permalink ||
    /https?:\/\/(i)?(v)?(www)?\.redd(\.it)?(it\.com)?\//.test(url);

  const numComments = formatNumber(num_comments);

  let displayUrl = url.replace(/https?:\/\/(www.)?/, "");
  if (displayUrl.length > 30) displayUrl = displayUrl.substring(0, 30) + "…";

  const showThumbnail =
    is_self || isCrosspost
      ? false
      : !media && preview && !preview.reddit_video_preview && !preview.enabled;

  if (!props || authorName === undefined) return null;
  return (
    <ThemeProvider theme={theme}>
      <PostWrapper inListing={inListing}>
        <StyledPost id={id} compact={compact} showComments={showComments}>
          {!compact && (
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
                mod={mod}
                upvote={upvote}
                downvote={downvote}
                score={score + mod}
              />
              <InfoBanners
                stickied={stickied}
                archived={archived}
                locked={locked}
                hidden={hidden}
                saved={saved}
              />
            </Left>
          )}
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
            {isCrosspost && title === crosspost_parent_list[0].title ? null : (
              <Title to={permalink} compact={compact}>{title}</Title>
            )}
            {isRedditLink || isCrosspost ? null : (
              <GoTo href={url}>
                {displayUrl + " "}
                <Icon icon="external" />
              </GoTo>
            )}
          </TitleBox>
          {!showThumbnail && !isCrosspost ? (
            <Preview
              is_self={is_self}
              html={selftext_html}
              isRedditLink={isRedditLink}
              inListing={inListing}
              isCrosspost={isCrosspost}
              preview={preview}
              media={media}
              navigateToPost={navigateToPost}
              url={url}
              permalink={permalink}
              nsfw={nsfw}
            />
          ) : null}
          <Crosspost
            crosspost={crosspost_parent_list || null}
            setCurrentPost={props.setCurrentPost}
            compact={compact}
          />
          {compact ? (
            <ActionBar>
              <Button
                type="flat"
                label={numComments}
                to={permalink}
                data-tip={numComments !== String(num_comments) && num_comments}
                icon="message"
                key="1"
              />
            </ActionBar>
          ) : (
            <ActionBar>
              <Button
                type="primary"
                label={numComments}
                to={permalink}
                onClick={navigateToPost}
                data-tip={num_comments}
                data-tip-disabled={String(numComments) === String(num_comments)}
                icon="message"
                key="1"
              />
              <Button hideLabel label="share" icon="share" key="3" />
              <Toggle
                hideLabel
                label="save"
                icon="star"
                startOn={saved}
                onToggle={save}
                key="4"
              />
              <Toggle
                hideLabel
                labelOn="show"
                labelOff="hide"
                iconOn="eye"
                iconOff="eyeOff"
                startOn={hidden}
                onToggle={hide}
                key="5"
              />
              <Button hideLabel label="report" icon="flag" key="6" />
              <Button
                label="view on reddit"
                hideLabel
                icon="external"
                href={"https://www.reddit.com" + permalink}
                key="7"
              />
              <Button
                hideLabel
                label="Log submission object to console"
                icon="debug"
                onClick={() => console.log(post)}
                key="9"
              />
            </ActionBar>
          )}
          {/* <ModBanners isMod={can_mod_post} {...post} /> */}
          {showThumbnail ? (
            <Thumbnail
              preview={preview}
              inListing={inListing}
              width={thumbnail_width}
              height={thumbnail_height}
            />
          ) : null}
        </StyledPost>
        {showComments
          ? comments.map(comment => <Comment {...comment} key={comment.id} />)
          : null}
      </PostWrapper>
    </ThemeProvider>
  );
};

export default withTheme(Post);
