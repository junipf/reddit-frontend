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
import { addColorTheme } from "../store/actions";
import styled, { withTheme } from "styled-components";

import Icon from "../components/icon";
import Button from "../components/button";
import { SpinnerPage } from "../components/spinner";
import Dropdown from "../components/dropdown";
import { ProgressUnderline } from "../components/progress-bar";
import genTheme from "../style/gen-theme";
import ReactTooltip from "react-tooltip";
import Post from "./post";
import Error from "../components/error";
// import { map } from "./settings";

const Thread = ({
  search,
  history,
  themesByColor,
  addColorTheme,
  path,
  hideSelf,
}) => {
  const r = useContext(Requester);
  const [fetched, setFetched] = useState({ post: null, id: null });
  const [error, setError] = useState(null);
  const loading = useMemo(
    () => fetched?.post === null || fetched?.post?.id !== path.id,
    [fetched, path.id]
  );

  const fetch = useCallback(
    (id) => {
      if (id && fetched.id !== id)
        r.getSubmission(id)
          .refresh()
          .then(
            (post) => {
              document.title = post.title;
              setFetched({
                post,
                id,
              });
            },
            (e) => {
              setError((error) =>
                error ? error : { name: "this post", e, type: "post" }
              );
            }
          );
    },
    [r, fetched]
  );

  useEffect(() => {
    // const searchParams = new URLSearchParams(search);
    // const options = {
    // id: path.id,
    // sort: searchParams.get("sort") || map.sorts.thread[0],
    // time: searchParams.get("t") || "all",
    // };
    if (path && path.id) {
      fetch(path.id);
    }
  }, [path, search, fetch]);

  // useEffect(() => {
  //   if (path.subName) fetchSubreddit(path.subName);
  // }, [path.subName, fetchSubreddit]);

  // Redirects from e.g. /td/[threadId] to the appropriate path
  // useEffect(() => {
  //   if (post && path.subName === null) {
  //     history.replace(post.permalink);
  //     fetchSubreddit(post.subreddit.display_name);
  //   }
  // }, [post, path.subName, history, fetchSubreddit]);

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
    if (fetched.post)
      generateFlairTheme(fetched.post.link_flair_background_color);
  }, [fetched.post, generateFlairTheme]);

  // Refresh tooltips
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const setSort = (sort) => {
    history.push({ search: `?sort=${sort}` });
  };
  return (
    <>
      <ViewSettings>
        <VSContents>
          <Button label="Close" hideLabel icon="x" onClick={hideSelf} />
          <Dropdown label={fetched.sort}>
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
        {!error && loading ? <ProgressUnderline /> : null}
      </ViewSettings>
      {error ? (
        <Error {...error} />
      ) : (
        <ScrollWrapper>
          <Listing>
            {fetched.post ? (
              <Post
                post={fetched.post}
                key={fetched.post?.id}
                id={fetched.post?.id}
                showComments
                sort={path.sort}
                inSubreddit={true}
                inListing={false}
              />
            ) : path.id ? (
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
  color: ${({ theme }) => theme.text};
  height: 100%;
`;

const ViewSettings = styled.div`
  width: 100%;
  position: sticky;
  top: 0rem;
  border-bottom: 1px solid ${({ theme }) => theme.card.border};
  background-color: ${({ theme }) => theme.card.bg};
  color: ${({ theme }) => theme.text};
  padding: 0.25rem;
  z-index: 10;
`;

const VSContents = styled.div`
  /* max-width: 40rem; */
  margin: 0 auto;
`;

export default connect(
  ({ themesByColor }) => ({
    themesByColor,
  }),
  {
    addColorTheme,
  }
)(withRouter(withTheme(Thread)));
