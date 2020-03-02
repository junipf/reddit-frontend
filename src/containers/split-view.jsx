import React, { useMemo, useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import { Requester } from "../components/requester";
import {
  addSubreddit,
  addSubredditTheme,
  addColorTheme,
} from "../store/actions";
import { withRouter } from "react-router";
import Listing from "./uni-listing";
import Thread from "./thread";
import ReactTooltip from "react-tooltip";
import Column from "./column";
import SubredditThemeProvider from "../style/sub-theme-provider";
import genTheme from "../style/gen-theme";
import SubredditBanner from "../components/subreddit-banner";

const SplitView = ({
  match: { params: path } = {},
  location,
  location: { search, pathname },
  split,
  subreddits,
  addSubreddit,
  addSubredditTheme,
  addColorTheme,
  themesBySubreddit,
  themesByColor,
  history,
}) => {
  const r = useContext(Requester);

  const [state, setState] = useState({
    listing: {
      path: path.id ? {} : path,
      search: path.id ? {} : search,
    },
    thread: {
      path: path.id ? path : {},
      search: path.id ? search : {},
    },
    return: location,
  });

  useEffect(() => {
    if (path.id === undefined) {
      setState((s) => ({
        ...s,
        listing: {
          path,
          search,
        },
        thread: {
          path: {},
          search: {},
        },
        return: location,
      }));
    } else {
      setState((s) => ({
        ...s,
        thread: {
          path,
          search,
        },
      }));
    }
  }, [path, location, search]);

  useEffect(() => {
    if (path.subName && subreddits[path.subName.toLowerCase()] === undefined) {
      r.getSubreddit(path.subName)
        .refresh()
        .then((subreddit) => {
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
        });
    }
  }, [
    path.subName,
    r,
    subreddits,
    addSubreddit,
    addSubredditTheme,
    themesBySubreddit,
  ]);

  // const toggleListing = () => {
  //   setPaths((p) => ({
  //     ...p,
  //     listing: {
  //       ...p.listing,
  //       visible: !p.listing.visible,
  //       controlsPath: !p.thread.visible,
  //     },
  //     thread: {
  //       ...p.thread,
  //       // If listing is hidden, enable thread
  //       visible: p.listing.visible ? true : p.thread.visible,
  //     },
  //   }));
  // };

  const closeThread = () => {
    setState((s) => ({
      ...s,
      thread: {
        path: {},
        search: {},
      },
    }));
    history.push(state.return);
  };

  // Refresh tooltips
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  // State changes:

  // Listing -> Thread   (/r/sub -> /r/sub/comments/id)
  // Listing only        (/r/sub)
  // Thread only         (/r/sub/comments/id)
  // Thread -> Listing   (/r/sub/comments/id -> /r/sub)
  // Listing, id -> id   (/r/sub/comments/id... -> .../comments/id)

  return (
    <>
      <SubredditThemeProvider subName={state.listing.path.subName} key="left">
        <Column
          type={split === "even" || split === "left" ? "primary" : "secondary"}
          // className={
          //   paths?.listing?.subName || !paths?.thread?.id ? "shown" : "hidden"
          // }
        >
          {state?.listing?.subName ? (
            <SubredditBanner subName={state.listing.path.subName} />
          ) : null}

          <Listing {...state.listing} />
        </Column>
      </SubredditThemeProvider>
      <SubredditThemeProvider subName={state.thread.path.subName} key="right">
        <Column
          type={
            split === "none"
              ? "floating"
              : split === "even" || split === "right"
              ? "primary"
              : "secondary"
          }
          className={state?.thread?.path.id ? "shown" : "hidden"}
        >
          {state?.listing?.path.subName !== state?.thread?.path.subName &&
          state?.thead?.path.subName ? (
            <SubredditBanner subName={state?.thread?.path.subName} />
          ) : null}
          <Thread {...state.thread} hideSelf={closeThread} />
        </Column>
      </SubredditThemeProvider>
    </>
  );
};

export default connect(
  ({
    subreddits,
    themesBySubreddit,
    themesByColor,
    layoutPrefs: { split },
  }) => ({
    subreddits,
    themesBySubreddit,
    themesByColor,
    split,
  }),
  {
    addSubreddit,
    addSubredditTheme,
    addColorTheme,
  }
)(withRouter(SplitView));
