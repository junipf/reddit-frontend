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

import Button from "../components/button";
import { SpinnerPage } from "../components/spinner";
import Dropdown from "../components/dropdown";
import { ProgressUnderline } from "../components/progress-bar";
import genTheme from "../style/gen-theme";
import ReactTooltip from "react-tooltip";
import SubredditBanner from "../components/subreddit-banner";
import Post, { PostPlaceholder } from "./post";
import useIntersect from "../utils/use-intersect";
import Error from "../components/error";

const PostListing = ({
  subreddits,
  history,
  lightboxIsOpen,
  addSubreddit,
  themesBySubreddit,
  addSubredditTheme,
  themesByColor,
  theme,
  username,
  addColorTheme,
  toggleVisible,
  visible,
  controlsPath,
  subName,
  sort,
  time,
}) => {
  const r = useContext(Requester);

  const [error, setError] = useState(null);

  const [listing, setListing] = useState([]);
  const [listSettings, setListSettings] = useState({});
  const fetching = useMemo(() => listing.length === 0, [listing]);

  const fetchListing = useCallback(() => {
    if (
      sort !== listSettings.sort ||
      subName !== listSettings.subName ||
      time !== listSettings.time
    ) {
      setListSettings({ sort, subName, time });
      setListing([]);
      setError(null);
      r._getSortedFrontpage(sort, subName, {
        time,
      }).then(
        (listing) => {
          setListing(listing);
        },
        (e) => {
          setError({
            name: `r/${subName}`,
            e,
            type: "subreddit",
          });
        }
      );
    }
  }, [r, sort, time, subName, listSettings]);

  const fetchSubreddit = useCallback(
    (subName) => {
      if (
        subName &&
        subName !== "frontpage" &&
        subName !== "popular" &&
        subName !== "all" &&
        subreddits[subName.toLowerCase()] === undefined
      ) {
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
                (themesBySubreddit[subreddit.display_name] &&
                  themesBySubreddit[subreddit.display_name].color !==
                    subreddit.primary_color)
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
    [addSubreddit, r, addSubredditTheme, subreddits, themesBySubreddit]
  );

  // const setSubreddit = useCallback(() => {
  // document.title = subName ? "r/" + subName : "Frontpage";
  //   if (
  //     subName &&
  //     subName !== "frontpage" &&
  //     subName !== "popular" &&
  //     subName !== "all"
  //   ) {
  //     fetchSubreddit(subName);
  //   }
  // }, [subName, fetchSubreddit]);

  const path = useMemo(() => {
    const pathSubName =
      subName && subreddits[subName.toLowerCase()]
        ? subreddits[subName.toLowerCase()].display_name
        : subName;
    let path = pathSubName ? "/r/" + pathSubName : "";
    path += sort && sort !== "hot" ? "/" + sort : "/";
    path +=
      (sort === "controversial" || sort === "top") && time ? "?t=" + time : "";
    return path;
  }, [subName, sort, time, subreddits]);

  const updatePath = useCallback(() => {
    if (path !== window.location.pathname) {
      const pathName = window.location.pathname.toLowerCase();
      if (
        path.toLowerCase() === pathName ||
        path.toLowerCase() === pathName + "/"
      ) {
        history.replace(path);
        console.info(`updatePath REPLACE: ${pathName} -> ${path}`);
      } else {
        history.push(path);
        console.info(`updatePath PUSH: ${path}`);
      }
    }
  }, [path, history]);

  useEffect(() => {
    if (controlsPath) updatePath();
  }, [controlsPath, updatePath]);

  // Generate themes from flair color if theme does not
  // already exist.
  const generateFlairThemes = useCallback(
    (colors) => {
      colors.forEach((color) => {
        if (themesByColor[color] === undefined)
          genTheme({ color }).then((themes) => addColorTheme(color, themes));
      });
    },
    [themesByColor, addColorTheme]
  );

  useEffect(() => {
    if (visible) fetchListing();
  }, [subName, sort, time, visible, fetchListing]);

  useEffect(() => {
    if (
      subName &&
      subName !== "frontpage" &&
      subName !== "popular" &&
      subName !== "all"
    ) {
      fetchSubreddit(subName);
    }
  }, [subName, fetchSubreddit]);

  // LISTING
  useEffect(() => {
    // Generate list of subreddits to be fetched
    // and link flair colors to generate themes on
    if (listing.length === 0) return;

    const fetchSubreddits = (subNames) => {
      subNames.forEach((subName) => {
        if (subreddits[subName] === undefined) {
          fetchSubreddit(subName);
        }
      });
    };

    const subreddits = listing.reduce((subs, post) => {
      const subName = post.subreddit.display_name.toLowerCase();
      if (!subs.includes(subName)) subs.push(subName);
      return subs;
    }, []);
    fetchSubreddits(subreddits);
    const flairColors = listing.reduce((flairColors, post) => {
      const color = post.link_flair_background_color;
      if (color && color !== "" && !flairColors.includes(color))
        flairColors.push(color);
      return flairColors;
    }, []);
    generateFlairThemes(flairColors);
  }, [listing, generateFlairThemes, fetchSubreddit]);

  // Refresh tooltips
  useEffect(() => {
    ReactTooltip.rebuild();
  });

  /*** Fetch More posts when scrolled down far enough ***/

  // Use intersection of placeholder post (at bottom of listing)
  // to fetch more posts.
  const [ref, entry] = useIntersect({
    threshold: [0],
    rootMargin: "0px 0px 2000px 0px",
  });

  const [fetchingMore, setFetchingMore] = useState(false);
  const fetchMoreAmount = 10;

  const fetchMore = () => {
    setFetchingMore(true);
    listing.fetchMore({ amount: fetchMoreAmount }).then(
      (listing) => {
        setListing(listing);
        setFetchingMore(false);
      },
      (e) => {
        setError({ name: "Fetch more", e, type: "subreddit" });
        setFetchingMore(false);
      }
    );
  };
  if (entry.isIntersecting) {
    if (!fetchingMore) fetchMore();
  }

  if (error) console.log(error);

  const goTo = useCallback(
    ({ _sort = sort, _time = time }) =>
      `/${subName ? `r/${subName}` : ""}/${
        _sort && _sort !== "hot" ? _sort : ""
      }${
        _time && (_sort === "controversial" || _sort === "top")
          ? `?t=${_time}`
          : ""
      }`,
    [sort, time, subName]
  );

  if (!visible) return null;
  return (
    <>
      {subreddits && subName && subreddits[subName.toLowerCase()] ? (
        <SubredditBanner subName={subName} />
      ) : null}
      <ViewSettings>
        <VSContents>
          <Dropdown label={sort || "hot"}>
            <Button label="hot" to={goTo({ _sort: "hot" })} />
            <Button label="best" to={goTo({ _sort: "best" })} />
            <Button label="new" to={goTo({ _sort: "new" })} />
            <Button label="rising" to={goTo({ _sort: "rising" })} />
            {TimeDropdown("controversial", goTo)}
            {TimeDropdown("top", goTo)}
          </Dropdown>
          {sort === "top" || sort === "controversial"
            ? TimeDropdown(sort, goTo, time)
            : null}
          {path}
        </VSContents>
        {(!error && fetching) || fetchingMore ? <ProgressUnderline /> : null}
      </ViewSettings>
      {error ? (
        <Error {...error} />
      ) : fetching ? (
        <SpinnerPage />
      ) : (
        <ScrollWrapper>
          <Listing>
            {listing.map((post, i) => (
              <Post
                inSubreddit={subName === post.subreddit.display_name}
                post={post}
                key={i}
                inListing
                id={post.id}
              />
            ))}
          </Listing>
          {fetchingMore
            ? Array(fetchMoreAmount)
                .fill()
                .map((x, i) => <PostPlaceholder key={"placeholder-" + i} />)
            : null}
          <PostPlaceholder forwardRef={ref} />
        </ScrollWrapper>
      )}
    </>
  );
};

// Just a function (i.e. not a component) so Dropdowns are treated as Sub
const TimeDropdown = (_sort, goTo, label) => (
  <Dropdown label={label || _sort}>
    <Button label="hour" to={goTo({ _sort, _time: "hour" })} />
    <Button label="day" to={goTo({ _sort, _time: "day" })} />
    <Button label="week" to={goTo({ _sort, _time: "week" })} />
    <Button label="month" to={goTo({ _sort, _time: "month" })} />
    <Button label="year" to={goTo({ _sort, _time: "year" })} />
    <Button label="all time" to={goTo({ _sort, _time: "all" })} />
  </Dropdown>
);

const Listing = styled.div`
  max-width: 75rem;
  margin: 1rem auto;
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
    themesBySubreddit,
    themesByColor,
  } = state;
  return {
    subreddits,
    lightboxIsOpen,
    themesBySubreddit,
    themesByColor,
  };
}

export default connect(
  mapStateToProps,
  {
    addSubreddit,
    addSubredditTheme,
    addColorTheme,
  }
)(withRouter(withTheme(PostListing)));
