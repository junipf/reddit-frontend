import React, { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { setLocationName } from "../store/actions";
import PostListing from "./post-listing";
import CommentListing from "./comment-listing";
import Button, { Group } from "../components/button";
import Icon from "../components/icon";
import ReactTooltip from "react-tooltip";
import { Column } from "./column";
import SubredditThemeProvider from "./sub-theme-provider";

const SplitView = ({
  match: { params: path } = {},
  location: { search },
  setLocationName,
}) => {
  const searchParams = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  // Set location name on mount,
  const [locName, setLocName] = useState(path.subName || null);
  useEffect(() => {
    setLocationName(locName || "Frontpage");
  }, [locName, setLocationName]);

  const [state, setState] = useState({
    postListing: {
      controlsPath: path.id === undefined,
      visible: path.id === undefined,
      subName: path.id === undefined ? path.subName || null : null,
      sort: path.sort || "hot",
      time: searchParams.get("t") || "all",
    },
    commentListing: {
      visible: path.id !== undefined,
      id: path.id,
      subName: path.id ? path.subName || null : null,
      sort: searchParams.get("sort"),
    },
  });

  useEffect(() => {
    if (path.id === undefined) {
      setState((state) => ({
        ...state,
        commentListing: {
          ...state.commentListing,
          visible: false,
        },
        postListing: {
          ...state.postListing,
          visible: true,
          controlsPath: true,
          subName: path.subName || null,
          sort: path.sort || "hot",
          time: searchParams.get("t") || "all",
        },
      }));
      setLocName(path.subName);
    } else {
      setState((state) => ({
        ...state,
        commentListing: {
          ...state.commentListing,
          visible: true,
          id: path.id,
          subName: path.subName || null,
          sort: searchParams.get("sort") || "best",
        },
        postListing: {
          ...state.postListing,
          controlsPath: false,
        },
      }));
    }
  }, [path, searchParams]);

  const togglePostListing = () => {
    setState((state) => ({
      ...state,
      postListing: {
        ...state.postListing,
        visible: !state.postListing.visible,
        controlsPath: !state.commentListing.visible,
      },
      commentListing: {
        ...state.commentListing,
        // If postListing is hidden, enable commentListing
        visible: state.postListing.visible
          ? true
          : state.commentListing.visible,
      },
    }));
  };

  const toggleCommentListing = () => {
    setState((state) => ({
      ...state,
      commentListing: {
        ...state.commentListing,
        visible: !state.commentListing.visible,
      },
      postListing: {
        ...state.postListing,
        visible: state.commentListing.visible
          ? true
          : state.postListing.visible,
        controlsPath: state.commentListing.visible ? true : false,
      },
    }));
  };

  // Refresh tooltips
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  const modes = {
    split: {
      name: "split",
      icon: "columns",
      types: {
        postListing: "primary",
        commentListing: "primary",
      },
    },
    splitLeft: {
      name: "split left",
      icon: "sidebar",
      rotateIcon: "180deg",
      types: {
        postListing: "primary",
        commentListing: "secondary",
      },
    },
    splitRight: {
      name: "split right",
      icon: "sidebar",
      types: {
        postListing: "secondary",
        commentListing: "primary",
      },
    },
    overlay: {
      name: "overlay",
      icon: "square",
      types: {
        postListing: "primary",
        commentListing: "primary",
      },
    },
  };
  const [viewMode, setViewMode] = useState(modes.split);
  const updateMode = (value) => setViewMode(value);

  return (
    <>
      <SubredditThemeProvider subName={state.postListing.subName}>
        <Column
          type={viewMode.types.postListing}
          className={state.postListing.visible ? "shown" : "hidden"}
        >
          <PostListing {...state.postListing} hideSelf={togglePostListing} />
        </Column>
      </SubredditThemeProvider>
      <SubredditThemeProvider subName={state.commentListing.subName}>
        <Column
          type={viewMode.types.commentListing}
          className={state.commentListing.visible ? "shown" : "hidden"}
        >
          <CommentListing
            {...state.commentListing}
            hideSelf={toggleCommentListing}
            setLocName={setLocName}
          />
        </Column>
      </SubredditThemeProvider>
      <Navbar>
        <Group>
          <Button
            label="PostListing"
            onClick={togglePostListing}
            type={state.postListing.visible ? "primary" : "secondary"}
          />
          <Button
            label="CommentListing"
            onClick={toggleCommentListing}
            type={state.commentListing.visible ? "primary" : "secondary"}
          />
        </Group>
        <Group>
          {Object.entries(modes).map(([key, mode]) => (
            <Button
              label={mode.name}
              hideLabel
              key={mode.name}
              type={viewMode.name === mode.name ? "primary" : "secondary"}
              value={mode}
              onClick={updateMode}
            >
              <Icon icon={mode.icon} rotate={mode.rotateIcon} />
            </Button>
          ))}
        </Group>
      </Navbar>
    </>
  );
};

export default connect(
  null,
  { setLocationName }
)(SplitView);

const Navbar = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 2rem;
  background-color: ${({ theme }) => theme.card.bg};
  border-top: 1px solid ${({ theme }) => theme.card.border}
  text-align: center;
`;
