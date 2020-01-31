import React, { useMemo, useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  setLocation,
  setPostListingSettings,
  setThreadSettings,
} from "../store/actions";
import PostListing from "./post-listing";
import Thread from "./thread";
import ReactTooltip from "react-tooltip";
import { Column } from "./column";
import SubredditThemeProvider from "../style/sub-theme-provider";

const SplitView = ({
  match: { params: path } = {},
  location: { search },
  setLocation,
  layoutPrefs: { split },
  setPostListingSettings,
  setThreadSettings,
}) => {
  const searchParams = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  const [state, setState] = useState({
    postListing: {
      controlsPath: path.id === undefined,
      visible: path.id === undefined,
      subName: path.subName,
    },
    thread: {
      visible: path.id !== undefined,
    },
  });

  // const [visible, setVisible] = useState({
  //   postListing: !path.id,
  //   thread: !!path.id,
  // });

  useEffect(() => {
    if (path.id === undefined) {
      // setVisible({
      //   postListing: true,
      //   thread: false,
      // });
      setLocation({
        name: path.subName || "Frontpage",
        type: path.subName ? "subreddit" : "listing",
      });
      setPostListingSettings({
        subName: path.subName,
        sort: path.sort || "hot",
        time: searchParams.get("t") || "all",
      });
      setState((state) => ({
        ...state,
        postListing: {
          ...state.postListing,
          subName: path.subName,
        },
      }));
    } else {
      setThreadSettings({
        id: path.id,
        subName: path.subName,
        sort: searchParams.get("sort") || "best",
      });
    }
  }, [
    path,
    searchParams,
    setLocation,
    setPostListingSettings,
    setThreadSettings,
  ]);

  const togglePostListing = () => {
    setState((state) => ({
      ...state,
      postListing: {
        ...state.postListing,
        visible: !state.postListing.visible,
        controlsPath: !state.thread.visible,
      },
      thread: {
        ...state.thread,
        // If postListing is hidden, enable thread
        visible: state.postListing.visible ? true : state.thread.visible,
      },
    }));
  };

  const togglethread = () => {
    setState((state) => ({
      ...state,
      thread: {
        ...state.thread,
        visible: !state.thread.visible,
      },
      postListing: {
        ...state.postListing,
        visible: state.thread.visible ? true : state.postListing.visible,
        controlsPath: state.thread.visible ? true : false,
      },
    }));
  };

  // Refresh tooltips
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  return (
    <>
      <SubredditThemeProvider subName={state.postListing.subName}>
        <Column
          type={split === "even" || split === "left" ? "primary" : "secondary"}
          className={state.postListing.visible ? "shown" : "hidden"}
        >
          <PostListing {...state.postListing} hideSelf={togglePostListing} />
        </Column>
      </SubredditThemeProvider>
      <SubredditThemeProvider subName={state.thread.subName}>
        <Column
          type={split === "even" || split === "right" ? "primary" : "secondary"}
          className={state.thread.visible ? "shown" : "hidden"}
        >
          <Thread {...state.thread} hideSelf={togglethread} />
        </Column>
      </SubredditThemeProvider>
    </>
  );
};

export default connect(
  ({ layoutPrefs }) => ({ layoutPrefs }),
  { setLocation, setThreadSettings, setPostListingSettings }
)(SplitView);
