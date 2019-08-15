import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Requester } from "../components/requester";
import {
  addSubreddit,
  addSubredditTheme,
  addColorTheme,
} from "../store/actions";
import styled, { withTheme } from "styled-components";

import Icon from "../components/icon";
import Button from "../components/button";
import { SpinnerPage } from "../components/spinner";
import Dropdown from "../components/dropdown";
import { ProgressUnderline } from "../components/progress-bar";
import genTheme from "../style/gen-theme";
import ReactTooltip from "react-tooltip";
import SubredditBanner from "../components/subreddit-banner";
import Post from "./post";
import Error from "../components/error";

const CommentListing = ({
  subreddits,
  location: { search },
  history,
  lightboxIsOpen,
  addSubreddit,
  themesBySubreddit,
  addSubredditTheme,
  themesByColor,
  theme,
  username,
  addColorTheme,
  currentPost,
  subName,
  id,
  sort,
  hideSelf,
  visible,
  setLocName,
}) => {
  const r = useContext(Requester);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(currentPost);
  const fetching = useMemo(() => post === null && id, [post, id]);

  const fetchPost = useCallback(
    (id) => {
      if (!visible || (post && post.id === id)) return;
      if (post && post.id)
        console.log(`Post id updated from ${post.id}, fetching ${id}`);
      else console.log(`cL got first post Id! Fetching ${id}`);
      if (error) setError(null);
      if (post) setPost(null);
      r.getSubmission(id)
        .refresh()
        .then(
          (post) => {
            setPost(post);
          },
          (e) => {
            setError((error) =>
              error ? error : { name: "this post", e, type: "post" }
            );
          }
        );
    },
    [r, visible, post, error]
  );

  const fetchSubreddit = useCallback(
    (subName) => {
      if (!visible) return;
      if (subreddits[subName.toLowerCase()] === undefined) {
        r.getSubreddit(subName)
          .refresh()
          .then(
            (subreddit) => {
              // Stores subreddit info.
              addSubreddit(subreddit);

              // Generate a new subredditTheme if there isn't one, or if
              // the subreddit has updated their primary_color. Additionally,
              // we set the theme to null if they don't have one ("")
              if (
                (themesBySubreddit[subreddit.display_name] === undefined &&
                  subreddit.primary_color !== "") ||
                themesBySubreddit[subreddit.display_name].color !==
                  subreddit.primary_color
              )
                genTheme({
                  color: subreddit.primary_color,
                  name: subreddit.display_name,
                }).then((themes) =>
                  addSubredditTheme(subreddit.display_name, themes)
                );
            },
            (e) => {
              setError({ name: `r/${subName}`, e, type: "subreddit" });
            }
          );
      }
    },
    [addSubreddit, r, visible, addSubredditTheme, subreddits, themesBySubreddit]
  );

  useEffect(() => {
    if (id) fetchPost(id);
  }, [id, fetchPost]);

  useEffect(() => {
    if (subName) fetchSubreddit(subName);
  }, [subName, fetchSubreddit]);

  // Redirects from e.g. /td/[threadId] to the appropriate path
  useEffect(() => {
    if (post && subName === null) {
      history.replace(post.permalink);
      fetchSubreddit(post.subreddit.display_name);
      setLocName(`r/${post.subreddit.display_name}`);
    }
  }, [post, subName, history, fetchSubreddit, setLocName]);

  // Generates themes from flair color if theme does not
  // already exist.
  const generateFlairTheme = useCallback(
    (color) => {
      if (themesByColor[color] === undefined)
        genTheme({ color }).then((themes) => addColorTheme(color, themes));
    },
    [themesByColor, addColorTheme]
  );

  // Fetches subreddit and generates flair theme.
  useEffect(() => {
    if (post) generateFlairTheme(post.link_flair_background_color);
  }, [post, generateFlairTheme]);

  // Refresh tooltips
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const setSort = (sort) => {
    history.push({ search: `?sort=${sort}` });
  };
  return (
    <>
      {subreddits && subName && subreddits[subName.toLowerCase()] ? (
        <SubredditBanner subName={subName} />
      ) : null}
      <ViewSettings>
        <VSContents>
          <Button label="Close" hideLabel icon="x" onClick={hideSelf} />
          <Dropdown label={sort}>
            <Button label="best" onClick={setSort} value="best" />
            <Button label="top" onClick={setSort} value="top" />
            <Button label="new" onClick={setSort} value="new" />
            <Button
              label="controversial"
              onClick={setSort}
              value="controversial"
            />
            <Button label="old" onClick={setSort} value="old" />
            <Button label="Q&amp;A" onClick={setSort} value="QA" />
          </Dropdown>
        </VSContents>
        {!error && fetching ? <ProgressUnderline /> : null}
      </ViewSettings>
      {error ? (
        <Error {...error} />
      ) : (
        <ScrollWrapper>
          <Listing>
            {post ? (
              <Post
                post={post}
                key={post.id}
                id={post.id}
                showComments
                sort={sort}
                inSubreddit={true}
                inListing={false}
              />
            ) : id ? (
              <SpinnerPage />
            ) : (
              <Placeholder>
                <Icon icon="logo" size="xl" />
              </Placeholder>
            )}
          </Listing>
        </ScrollWrapper>
      )}
    </>
  );
};

const Listing = styled.div`
  max-width: 75rem;
  margin: 1rem auto;
`;

const Placeholder = styled.div`
  margin: auto auto;
  height: 20vh;
  filter: grayscale(100%) contrast(60%);
  opacity: 0.1;
`;

// Prevents page contents from shifting when scrollbar disappears
// due to lightbox being open.
const ScrollWrapper = styled.div`
  overflow-y: ${({ lightboxIsOpen }) => (lightboxIsOpen ? "scroll" : "show")};
  color: ${({ theme }) => theme.color};
  height: 100%;
`;

const ViewSettings = styled.div`
  width: 100%;
  position: sticky;
  top: 0rem;
  border-bottom: 1px solid ${({ theme }) => theme.card.border};
  background-color: ${({ theme }) => theme.card.bg};
  color: ${({ theme }) => theme.color};
  padding: 0.25rem;
  z-index: 10;
`;

const VSContents = styled.div`
  /* max-width: 40rem; */
  margin: 0 auto;
`;

function mapStateToProps(state) {
  const {
    subreddits,
    lightboxIsOpen,
    locationName,
    themesBySubreddit,
    themesByColor,
    currentPost,
  } = state;
  return {
    subreddits,
    lightboxIsOpen,
    locationName,
    themesBySubreddit,
    themesByColor,
    currentPost,
  };
}

export default connect(
  mapStateToProps,
  {
    addSubreddit,
    addSubredditTheme,
    addColorTheme,
  }
)(withRouter(withTheme(CommentListing)));
