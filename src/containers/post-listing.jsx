import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Requester } from "../components/requester";
import {
  addSubreddit,
  setCurrentPost,
  addSubredditTheme,
} from "../store/actions";
import styled, { ThemeProvider, withTheme } from "styled-components";
// import queryString from "query-string";

import Post from "./post";
import Button from "../components/button";
import { SpinnerPage } from "../components/spinner";
import Dropdown from "../components/dropdown";
import SubredditIcon from "../components/subreddit-icon";
import { ProgressOverlay, ProgressUnderline } from "../components/progress-bar";
import { genSubredditTheme } from "../utils/color";

const SubredditBanner = styled.div.attrs(props => ({
  style: {
    backgroundColor: props.banner_background_color,
    backgroundImage: "url(" + props.banner_background_image + ")",
    height: props.display_name ? "12rem" : "2.5rem", // Detects frontpage/popular/all
  },
}))`
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.container.levels[1]};
  border-top-right-radius: inherit;
  border-top-left-radius: inherit;
  padding-bottom: 2.5rem;
`;
const StyledListing = styled.div`
  max-width: 48rem;
  margin: 0 auto;
`;

class Listing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // visiblePosts: [],
    };
    this.listing = React.createRef();
  }
  handleIntersection = e => {
    // this.setState({ visiblePosts: e.map(entry => entry.target.id)})
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state !== nextState || this.props !== nextProps) return true;
    else return false;
  }
  render() {
    const { visiblePosts } = this.state;
    const { listing, subreddits, subredditName, setCurrentPost } = this.props;
    return listing ? (
      <StyledListing>
        {listing.map((post, i) => {
          if (subreddits[post.subreddit.display_name] === undefined) {
            this.props.fetchSubreddit(post.subreddit.display_name);
          }
          return (
            <Post
              subredditInfo={subreddits[post.subreddit.display_name]}
              inSubreddit={subredditName === post.subreddit.display_name}
              post={post}
              key={i}
              inListing
              id={post.id}
              setCurrentPost={setCurrentPost}
            />
          );
        })}
      </StyledListing>
    ) : null;
  }
}

class PostListing extends React.Component {
  static contextType = Requester;
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      fetchingMore: false,
      listing: [],
      sort: "hot",
      time: "all",
      subredditName: null,
    };
  }
  componentDidMount() {
    const { subredditName, id } = this.props.match.params;
    if (!id) {
      this.setSubreddit(subredditName);
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const { sort, time } = this.state;
    const { sort: prevSort, time: prevTime } = prevState;
    const { params } = this.props.match;

    // We take the subredditName from the URL, but only if there is no ID.
    // (e.g. we take /r/firefox, but not /r/firefox/comments/c6xrwv/...)
    // This allows normal navigation (clicking links) to update the listing.
    if (!params.id && params.subredditName !== this.state.subredditName) {
      document.title = params.subredditName
        ? "r/" + params.subredditName
        : "Frontpage";
      this.setSubreddit(params.subredditName);
    }

    // If the subreddit name, sort, or sort time - in state - updates, we
    // fetch the new listing. This means that there is an update when we get
    // the subredditName from the URL, then another after it's set to state -
    // so it's important to prevent re-renders.
    if (
      this.state.subredditName === prevState.subredditName &&
      (sort !== prevSort || time !== prevTime)
    ) {
      this.fetchListing(this.state.subredditName);
    }

    // If the ID vanishes, we now have control of the URL.
    if (prevProps.match.params.id && !this.props.match.params.id)
      this.setSort({ subredditName: this.props.match.params.subredditName });
  }
  setSubreddit = subredditName => {
    this.setState({ subredditName });
    this.fetchListing(subredditName);
    const { addSubreddit, themesBySubreddit, addSubredditTheme } = this.props;
    if (
      subredditName &&
      subredditName !== "frontpage" &&
      subredditName !== "popular" &&
      subredditName !== "all"
    ) {
      this.context
        .getSubreddit(subredditName)
        .refresh()
        .then(
          subreddit => {
            // Stores subreddit info.
            addSubreddit(subreddit);

            // Sets favicon and tab title.
            document.title = subreddit.display_name_prefixed;
            document.querySelector('link[rel="shortcut icon"]').href =
              subreddit.community_icon ||
              subreddit.icon_img ||
              subreddit.icon_url ||
              "favicon.ico";

            // Generate a new subredditTheme if there isn't one, or if
            // the subreddit has updated their primary_color. Additionally,
            // we set the theme to null if they don't have one ("")
            if (
              (themesBySubreddit[subreddit.display_name] === undefined &&
                subreddit.primary_color !== "") ||
              themesBySubreddit[subreddit.display_name].color !==
                subreddit.primary_color
            )
              addSubredditTheme(
                subreddit.display_name,
                genSubredditTheme(subreddit.primary_color)
              );
          },
          error => console.error(error)
        );
    }
  };
  fetchSubreddit = subredditName => {
    // Passed to descendents.
    if (
      subredditName &&
      subredditName !== "frontpage" &&
      subredditName !== "popular" &&
      subredditName !== "all"
    ) {
      this.context
        .getSubreddit(subredditName)
        .refresh()
        .then(
          result => this.props.addSubreddit(result),
          error => console.error(error)
        );
    }
  };
  fetchListing = (passedSubName = null) => {
    const {
      subredditName: stateSubName,
      sort = "hot",
      time = "all",
    } = this.state;
    const subredditName = passedSubName ? passedSubName : stateSubName;
    const t = sort === "controversial" || sort === "top" ? time : null;
    this.setState({ fetching: true });
    this.context._getSortedFrontpage(sort, subredditName, { t }).then(
      result => {
        this.setState({ fetching: false, listing: result });
      },
      error => console.error(error)
    );
  };
  fetchMore = () => {
    const { fetchingMore, listing } = this.state;
    if (fetchingMore) return;
    this.setState({ fetchingMore: true });

    listing
      .fetchMore({ amount: 25 })
      .then(
        result => this.setState({ listing: result, fetchingMore: false }),
        error => console.error(error)
      );
  };
  handleScroll = e => {
    if (!this.state.fetchingMore) {
      const bottom =
        e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <=
        1000;
      if (bottom) {
        this.fetchMore();
      }
    }
  };

  // Passes sort & time to state, and, if we control the URL,
  // we build and update it.
  setSort = ({
    subredditName = this.state.subredditName,
    sort = this.state.sort,
    time = this.state.time,
  }) => {
    if (
      this.state.subredditName !== subredditName ||
      this.state.sort !== sort ||
      this.state.time !== time
    ) {
      this.setState({
        subredditName,
        sort,
        time,
      });
    }
    if (!this.props.match.params.id) {
      let url = subredditName ? "/r/" + subredditName : "";
      url += sort && sort !== "hot" ? "/" + sort : "";
      url +=
        (sort === "controversial" || sort === "top") && time
          ? "?t=" + time
          : "";
      this.props.history.push(url);
    }
  };
  render() {
    if (this.state.subredditName === null) return null;
    const {
      subreddits,
      theme: { dark: useDark },
      theme: inheritedTheme,
      themesBySubreddit,
      lightboxIsOpen,
    } = this.props;
    const {
      listing,
      fetching,
      fetchingMore,
      subredditName,
      sort = "hot",
      time,
    } = this.state;

    let theme = inheritedTheme;
    if (themesBySubreddit[subredditName]) {
      theme = useDark
        ? themesBySubreddit[subredditName].dark
        : themesBySubreddit[subredditName].light;
    }
    return (
      <ThemeProvider theme={theme}>
        <Column
          ref={this.parentColumn}
          // onScroll={this.handleScroll}
          lightboxIsOpen={lightboxIsOpen}
        >
          <SubredditBanner {...subreddits[subredditName]}>
            <SubredditIcon {...subreddits[subredditName]} size="xl" flat />
          </SubredditBanner>
          <ViewSettings>
            <VSContents>
              <Button
                label="Refresh"
                hideLabel
                icon="refresh"
                onClick={this.fetchListing}
              />
              <Dropdown label={sort}>
                <Button
                  label="hot"
                  onClick={() => this.setSort({ sort: "hot" })}
                />
                <Button
                  label="best"
                  onClick={() => this.setSort({ sort: "best" })}
                />
                <Button
                  label="new"
                  onClick={() => this.setSort({ sort: "new" })}
                />
                <Button
                  label="rising"
                  onClick={() => this.setSort({ sort: "rising" })}
                />
                <Dropdown label="controversial">
                  <Button
                    label="hour"
                    onClick={() =>
                      this.setSort({ sort: "controversial", time: "hour" })
                    }
                  />
                  <Button
                    label="day"
                    onClick={() =>
                      this.setSort({ sort: "controversial", time: "day" })
                    }
                  />
                  <Button
                    label="week"
                    onClick={() =>
                      this.setSort({ sort: "controversial", time: "week" })
                    }
                  />
                  <Button
                    label="month"
                    onClick={() =>
                      this.setSort({ sort: "controversial", time: "month" })
                    }
                  />
                  <Button
                    label="year"
                    onClick={() =>
                      this.setSort({ sort: "controversial", time: "year" })
                    }
                  />
                  <Button
                    label="all time"
                    value="all"
                    onClick={() =>
                      this.setSort({ sort: "controversial", time: "all" })
                    }
                  />
                </Dropdown>
                <Dropdown label="top">
                  <Button
                    label="hour"
                    onClick={() => this.setSort({ sort: "top", time: "hour" })}
                  />
                  <Button
                    label="day"
                    onClick={() => this.setSort({ sort: "top", time: "day" })}
                  />
                  <Button
                    label="week"
                    onClick={() => this.setSort({ sort: "top", time: "week" })}
                  />
                  <Button
                    label="month"
                    onClick={() => this.setSort({ sort: "top", time: "month" })}
                  />
                  <Button
                    label="year"
                    onClick={() => this.setSort({ sort: "top", time: "year" })}
                  />
                  <Button
                    label="all time"
                    value="all"
                    onClick={() => this.setSort({ sort: "top", time: "all" })}
                  />
                </Dropdown>
              </Dropdown>
              {(sort === "top" || sort === "controversial") && (
                <Dropdown label={time}>
                  <Button
                    label="hour"
                    onClick={() => this.setSort({ sort, time: "hour" })}
                  />
                  <Button
                    label="day"
                    onClick={() => this.setSort({ sort, time: "day" })}
                  />
                  <Button
                    label="week"
                    onClick={() => this.setSort({ sort, time: "week" })}
                  />
                  <Button
                    label="month"
                    onClick={() => this.setSort({ sort, time: "month" })}
                  />
                  <Button
                    label="year"
                    onClick={() => this.setSort({ sort, time: "year" })}
                  />
                  <Button
                    label="all time"
                    value="all"
                    onClick={() => this.setSort({ sort, time: "all" })}
                  />
                </Dropdown>
              )}
              <Button
                icon="search"
                hideLabel
                label={subredditName ? "Search r/" + subredditName : "Search"}
              />
            </VSContents>
            {fetching || fetchingMore ? <ProgressUnderline /> : null}
          </ViewSettings>
          {fetching ? (
            <SpinnerPage />
          ) : (
            <ScrollWrapper>
              <Listing
                listing={listing}
                subreddits={subreddits}
                subredditName={subredditName}
                fetchSubreddit={this.fetchSubreddit}
                setCurrentPost={this.props.setCurrentPost}
              />
            </ScrollWrapper>
          )}
          {fetching || fetchingMore ? <ProgressOverlay /> : null}
        </Column>
      </ThemeProvider>
    );
  }
}

// Prevents page contents from shifting when scrollbar disappears
// due to lightbox being open.
const ScrollWrapper = styled.div`
  overflow-y: ${props => (props.lightboxIsOpen ? "scroll" : "show")};
  color: ${props => props.theme.container.color};
  height: 100%;
`;

const Column = styled.div`
  scroll-behavior: smooth;
  background-color: ${props => props.theme.column.background};
  overflow-x: hidden;
  overflow-y: ${props => (props.lightboxIsOpen ? "hidden" : "scroll")};
  flex: 1 1 auto;
  scrollbar-color: ${props => props.theme.scrollbar};
`;

const ViewSettings = styled.div`
  width: 100%;
  height: 2.5rem;
  position: sticky;
  top: 0rem;
  margin-top: -2.5rem;
  border: 1px solid ${props => props.theme.container.border};
  border-width: 1px 0;
  background-color: ${props => props.theme.container.levels[0]};
  color: ${props => props.theme.container.color};
  padding: 0.25rem;
  z-index: 10;
  font-size: 0.85rem;
`;

const VSContents = styled.div`
  max-width: 750px;
  margin: 0 auto;
`;

function mapStateToProps(state) {
  const {
    currentPostId,
    subreddits,
    lightboxIsOpen,
    themesBySubreddit,
  } = state;
  return {
    currentPostId,
    subreddits,
    lightboxIsOpen,
    themesBySubreddit,
  };
}

export default connect(
  mapStateToProps,
  { addSubreddit, setCurrentPost, addSubredditTheme }
)(withTheme(withRouter(PostListing)));
