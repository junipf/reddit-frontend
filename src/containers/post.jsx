import React, { useState } from "react";
import styled, { ThemeProvider, withTheme } from "styled-components";
import { connect } from "react-redux";
import { setCurrentPost } from "../store/actions";

import Button from "../components/button";
import { formatNumber } from "../utils/format-number";

import Flair from "../components/flair";
import { Timestamp } from "../components/timestamp";
import Votes from "../components/votes";
import { Link } from "react-router-dom";
import { Author } from "../components/author";
import SubredditIcon from "../components/subreddit-icon";
import Tag from "../components/tags";
import Icon from "../components/icon";

import Comment from "./comment";
import Reply from "./../components/reply";

import Preview from "../components/preview";
import Thumbnail from "../components/thumbnail";
import Crosspost from "./crosspost";
import { SpinnerPage } from "../components/spinner";

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
  border-bottom-color: ${({ theme }) => theme.card.border};
  border-bottom-width: ${({ showComments }) => (showComments ? "1px" : "0")};
`;

const PostWrapper = styled.div.attrs(({ id }) => ({
  id: id,
}))`
  margin: 0.5rem;
  margin-top: ${({ compact }) => (compact ? "0" : "0.5rem")};
  background: ${({ theme }) => theme.card.bg};
  color: ${({ theme }) => theme.text};
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.card.border};
  border-radius: 0.25rem;
  font-size: 0.85rem;
  /* max-width: 75rem; */
`;

const Left = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.card.innerBg};
  grid-area: left;
  padding-top: 0.5rem;
  min-width: 2rem;
  font-size: 1rem;
  border-radius: 0.25rem 0 0 0.25rem;
`;

const Tagline = styled.span`
  margin: 0.65rem 0.5rem 0 0.5rem;
  grid-area: tagline;
  font-size: 0.75rem;
  & > * {
    margin-right: 0.5rem;
  }
`;
const SubredditName = styled(Link)`
  font-weight: 500;
  color: ${({ theme }) => theme.link};
  margin-right: 0.25rem;
`;

const TitleBox = styled.div`
  grid-area: title;
  margin: 0.25rem 0.5rem;
`;
const Title = ({ compact, to, children }) => (
  <StyledTitle compact={compact}>
    <Link to={to}>{children}</Link>
  </StyledTitle>
);

const StyledTitle = styled.span`
  a {
    display: block;
    color: ${({ theme }) => theme.title};
    font-size: ${({ compact }) => (compact ? "0.85rem" : "1.2rem")};
    font-weight: 400;
    text-decoration: none;
    font-size: 1.62rem;
  }
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

const Comments = styled.div`
  margin: 0 0.75rem 0.75rem 0.5rem;
`;

const Post = ({
  post,
  inListing,
  inSubreddit,
  compact,
  theme: inheritedTheme,
  themes,
  showComments,
  showTitle = true,
  setCurrentPost,
  user,
  themesByColor,
}) => {
  const {
    title,
    url,
    author: { name: authorName },
    subreddit_name_prefixed: subNamePrefixed,
    subreddit: { display_name: subName },
    id,
    score,
    comments: inheritedComments,
    permalink,
    created_utc,
    num_comments,
    likes,
    domain,

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
    secure_media_embed: mediaEmbed,
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
  const [comments, setComments] = useState(inheritedComments);

  if (
    showComments &&
    inheritedComments &&
    inheritedComments.length === 0 &&
    num_comments > 0
  )
    post
      .expandReplies({ limit: 50, depth: 5 })
      .then(
        (result) => setComments(result.comments),
        (error) => console.error(error)
      );

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
  const navigateToPost = () => setCurrentPost(post);

  const reply = (value) => {
    post.reply(value).then(
      (reply) => {
        setComments([reply, ...comments]);
      },
      (error) => console.error(error)
    );
  };

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
  const isRedditLink = /https?:\/\/(i)?(v)?(www)?\.redd(\.it)?(it\.com)?\//.test(
    url
  );

  const numComments = formatNumber(num_comments);

  let displayUrl = url.replace(/https?:\/\/(www.)?/, "");
  if (displayUrl.length > 30) displayUrl = displayUrl.substring(0, 30) + "…";

  const showThumbnail =
    is_self || isCrosspost
      ? false
      : !media && preview && !preview.reddit_video_preview && !preview.enabled;

  const theme = themes
    ? inheritedTheme.dark
      ? themes.dark
      : themes.light
    : inheritedTheme;

  const username = user ? user.name : null;
  const own = username === authorName;

  const loggedIn = user !== null;

  const debugPostToClipboard = () =>
    navigator.clipboard.writeText(
      JSON.stringify({ ...post, comments: [], _r: undefined })
    );
  const debugPostToConsole = () => console.log({ ...post, comments: [] });

  return (
    <ThemeProvider theme={theme}>
      <PostWrapper inListing={inListing}>
        <StyledPost id={id} compact={compact} showComments={showComments}>
          {!compact && (
            <Left>
              {!inSubreddit ? (
                <SubredditIcon
                  subName={subName}
                  data-tip={"Go to " + subNamePrefixed}
                  data-delay-show="500"
                />
              ) : null}
              <Votes
                showDot
                own={own}
                mod={mod}
                upvote={upvote}
                downvote={downvote}
                score={score + mod}
                disabled={!loggedIn || archived}
                data-tip={
                  !loggedIn
                    ? "You must be logged in to vote"
                    : archived
                    ? "You can't vote on archived posts"
                    : "Voting disabled"
                }
                data-event="click"
              />
              {stickied ? <Tag.Stickied /> : null}
              {archived ? <Tag.Archived /> : null}
              {locked ? <Tag.Locked /> : null}
              {hidden ? <Tag.Hidden /> : null}
              {saved ? <Tag.Saved /> : null}
            </Left>
          )}
          <Tagline>
            {!inSubreddit ? (
              <SubredditName to={"/" + subNamePrefixed}>
                {subNamePrefixed}
              </SubredditName>
            ) : null}
            <Flair {...linkFlair} />
            {quarantine ? <Tag.Quarantine /> : null}
            {nsfw ? <Tag.NSFW /> : null}
            {spoiler ? <Tag.Spoiler /> : null}
            {oc ? <Tag.OC /> : null}
            {isCrosspost ? (
              <Icon
                icon="shuffle"
                data-tip={"Crossposted by u/" + authorName}
              />
            ) : null}
            <Author
              prefix
              authorName={authorName}
              distinguished={distinguished}
            />
            <Flair {...authorFlair} />
            <Timestamp time={created_utc} />
          </Tagline>
          <TitleBox>
            {showTitle && (
              <Title onClick={navigateToPost} to={permalink} compact={compact}>
                {title}
              </Title>
            )}
            {isCrosspost ? null : (
              <GoTo href={domain.startsWith("self.") ? permalink : url}>
                {/* {displayUrl + " "} */}
                {domain + " "}
                {isRedditLink ? null : <Icon icon="externalLink" />}
              </GoTo>
            )}
          </TitleBox>
          {showThumbnail ? null : isCrosspost ? (
            <Crosspost
              crosspost={crosspost_parent_list}
              setCurrentPost={setCurrentPost}
            />
          ) : (
            <Preview
              isRedditLink={isRedditLink}
              inListing={inListing}
              isCrosspost={isCrosspost}
              preview={preview}
              media={media}
              mediaEmbed={mediaEmbed}
              navigateToPost={navigateToPost}
              url={url}
              permalink={permalink}
              nsfw={nsfw}
              spoiler={spoiler}
              isSelf={is_self}
              html={selftext_html}
              nightmode={theme.dark}
              title={title}
            />
          )}
          <ActionBar>
            <Button
              primary
              flat
              label={numComments}
              to={permalink}
              onClick={navigateToPost}
              data-tip={
                Intl.NumberFormat().format(num_comments) +
                (num_comments === 1 ? " comment" : " comments")
              }
              data-tip-disable={
                numComments.trim() === String(num_comments).trim()
              }
              icon="messageSquare"
              key="1"
            />
            {loggedIn || compact ? (
              <>
                <Button
                  flat
                  hideLabel
                  fill={saved}
                  toggle
                  toggled={saved}
                  label={saved ? "unsave" : "save"}
                  icon="star"
                  onClick={save}
                  key="2"
                />
                <Button
                  flat
                  hideLabel
                  toggle
                  toggled={hidden}
                  label={hidden ? "show" : "hide"}
                  icon={hidden ? "eyeOff" : "eye"}
                  onClick={hide}
                  key="3"
                />
                <Button
                  flat
                  hideLabel
                  label="report"
                  icon="flag"
                  key="4"
                />
              </>
            ) : null}
            <Button
              flat
              label="view on reddit"
              hideLabel
              icon="externalLink"
              href={"https://www.reddit.com" + permalink}
              key="5"
            />
            {process.env.NODE_ENV === "development" ? (
              <>
                <Button
                  flat
                  hideLabel
                  label="Log submission object to console"
                  icon="terminal"
                  onClick={debugPostToConsole}
                  key="6"
                />
                <Button
                  flat
                  hideLabel
                  label="Copy submission to clipboard"
                  icon="clipboard"
                  onClick={debugPostToClipboard}
                  key="7"
                />
              </>
            ) : null}
          </ActionBar>
          {showThumbnail ? (
            <Thumbnail
              preview={preview}
              inListing={inListing}
              width={thumbnail_width}
              height={thumbnail_height}
              url={url}
            />
          ) : null}
        </StyledPost>
        {showComments ? (
          num_comments > 0 && comments.length === 0 ? (
            <SpinnerPage />
          ) : (
            <Comments>
              {loggedIn && !locked && !archived ? (
                <Reply onSubmit={reply} />
              ) : null}
              {comments.map((comment) => (
                <Comment
                  comment={comment}
                  username={username}
                  key={comment.id}
                  loggedIn={loggedIn}
                />
              ))}
            </Comments>
          )
        ) : null}
      </PostWrapper>
    </ThemeProvider>
  );
};

function mapStateToProps(
  state,
  { theme, post: { link_flair_background_color: color } }
) {
  const { themesByColor, user } = state;

  return {
    themes: themesByColor[color],
    user,
  };
}

export default connect(
  mapStateToProps,
  { setCurrentPost }
)(withTheme(Post));

const Block = styled.span`
  display: inline-block;
  height: 1em;
  width: 40%;
  margin: 0.25em;
  border-radius: 0.25em;
  background-color: ${({ theme }) => theme.header.bg};
`;

const MediaBlock = styled(Block)`
  width: 100%;
  height: 20rem;
  grid-area: media;
  border-radius: 0;
  margin: 0.25em 0;
`;

const TitleBlock = styled(Block)`
  height: 1.5em;
  width: 80%;
`;

const ActionBlock = styled(Block)`
  height: 1.5em;
  width: 60%;
  grid-area: actions;
`;

const RoundBlock = styled(Block)`
  border-radius: 50%;
  height: 1.5rem;
  width: 1.5rem;
  margin: 0 0.5rem;
`;

export const PostPlaceholder = ({ forwardRef, showMediaBlock }) => (
  <PostWrapper ref={forwardRef}>
    <StyledPost>
      <Left>
        <RoundBlock />
        <Block />
        <Block />
      </Left>
      <Tagline>
        <Block />
      </Tagline>
      <TitleBox>
        <TitleBlock />
      </TitleBox>
      {showMediaBlock ? (
        <MediaBlock>
          <SpinnerPage />
        </MediaBlock>
      ) : null}
      <ActionBar>
        <ActionBlock />
      </ActionBar>
    </StyledPost>
  </PostWrapper>
);
