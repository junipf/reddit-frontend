import React from "react";
import styled, { ThemeProvider, withTheme } from "styled-components";
import { genSimpleTheme } from "../utils/color";
import Button from "../components/button";
import Toggle from "../components/toggle";
import Dropdown from "../components/dropdown";
import { connect } from "react-redux";
import queryString from "query-string";

import {
  addSubreddit,
  setCurrentPost,
} from "../store/actions";
import Post from "./post";
// import { Spinner } from "../components/spinner";
import { ProgressOverlay, ProgressUnderline } from "../components/progress-bar";
import { Requester } from "../components/requester";

const SubredditBanner = styled.div.attrs(props => ({
  style: {
    backgroundColor: props.banner_background_color,
    backgroundImage: "url(" + props.banner_background_image + ")",
    height: props.banner_background_image ? "12rem" : "2.5rem",
  },
}))`
  height: 8rem;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.container.levels[1]};
  border-top-right-radius: inherit;
  border-top-left-radius: inherit;
`;

const StyledListing = styled.div`
  max-width: 48rem;
  margin: 0 auto;
`;

class Listing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newSubreddit: true,
    };
  }
  shouldComponentUpdate(nextProps) {
    if (this.props !== nextProps) return true;
    else return false;
  }
  render() {
    const {
      listing,
      subreddits,
      subredditName,
      compact,
      fetching,
    } = this.props;
    return fetching || listing === [] || listing === undefined ? null : (
      <StyledListing>
        {listing.map((post, i) => {
          if (subreddits[post.subreddit.display_name] === undefined) {
            this.props.fetchSubreddit(post.subreddit.display_name);
          }
          return (
            <Post
              compact={compact}
              subredditInfo={subreddits[post.subreddit.display_name]}
              inSubreddit={subredditName === post.subreddit.display_name}
              post={post}
              key={i}
              inListing
              id={post.id}
            />
          );
        })}
      </StyledListing>
    );
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
      compact: false,
    };
    this.fetchMore = this.fetchMore.bind(this);
    this.fetchSubreddit = this.fetchSubreddit.bind(this);
    this.setSubreddit = this.setSubreddit.bind(this);
  }
  toggleView = () => {
    this.setState({ compact: !this.state.compact });
  };
  componentDidMount() {
    const { subredditName } = this.props.match.params;
    this.setSubreddit(subredditName);
    this.fetchListing(subredditName);
  }
  componentDidUpdate(prevProps, prevState) {
    const { subredditName, sort, sortTime } = this.props.match.params;
    const {
      subredditName: prevSubredditName,
      sort: prevSort,
      sortTime: prevSortTime,
    } = prevProps.match.params;
    if (subredditName !== prevSubredditName) {
      document.title = subredditName ? "r/" + subredditName : "Frontpage";
      this.setSubreddit(subredditName);
      this.fetchListing(subredditName);
    }
    if (sort !== prevSort || sortTime !== prevSortTime) {
      this.fetchListing(subredditName);
    }
  }
  // Sets the post-listing to use this subreddit,
  // and fetches subreddit info.
  setSubreddit(subredditName) {
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
          result => {
            document.title = result.display_name_prefixed;
            document.querySelector('link[rel="shortcut icon"]').href =
              result.community_icon ||
              result.icon_img ||
              result.icon_url ||
              "favicon.ico";
            this.props.addSubreddit(result);
          },
          error => console.error(error)
        );
    }
  }
  fetchSubreddit(subredditName) {
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
  }
  fetchListing = () => {
    const { subredditName, sort, sortTime } = this.props.match.params;

    const get =
      sort === "hot" || sort === undefined
        ? this.context.getHot(subredditName, { time: sortTime })
        : sort === "new"
        ? this.context.getNew(subredditName, { time: sortTime })
        : sort === "rising"
        ? this.context.getRising(subredditName, { time: sortTime })
        : sort === "controversial"
        ? this.context.getControversial(subredditName, { time: sortTime })
        : sort === "top"
        ? this.context.getTop(subredditName, { time: sortTime })
        : null;
    if (get) this.setState({ fetching: true });
    get.then(
      result => this.setState({ fetching: false, listing: result }),
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
    // console.log(
    //   e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight
    // );
    if (!this.state.fetchingMore) {
      const bottom =
        e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <=
        1000;
      if (bottom) {
        this.fetchMore();
      }
    }
  };
  newPath = (sort, sortTime) => {
    const {
      match: {
        params: { subredditName },
      },
    } = this.props;
    let newPath = subredditName ? "/r/" + subredditName : "";
    newPath += sort ? "/" + sort : "";
    newPath += sortTime ? "?t=" + sortTime : "";
    return newPath;
  };
  render() {
    const {
      subreddits,
      match: { params: { subredditName, sort = "hot" } = {} },
      location,
      lightboxIsOpen,
    } = this.props;
    const searchValues = queryString.parse(location.search);
    const sortTime = searchValues.t;
    const { compact, listing, fetching, fetchingMore } = this.state;

    let theme = this.props.theme;

    if (subreddits[subredditName] && subreddits[subredditName].primary_color) {
      const simpleTheme = genSimpleTheme(
        subreddits[subredditName].primary_color,
        this.props.theme.dark
      );
      theme = {
        ...this.props.theme,
        container: {
          ...this.props.theme.container,
          ...simpleTheme.container,
        },
        button: {
          ...this.props.theme.button,
          primary: simpleTheme.button.primary,
        },
        column: simpleTheme.column,
      };
    }

    return (
      <ThemeProvider theme={theme}>
        <Column
          ref={this.parentColumn}
          onScroll={this.handleScroll}
          lightboxIsOpen={lightboxIsOpen}
        >
          <SubredditBanner {...subreddits[subredditName]} />
          <ViewSettings>
            <VSContents>
              <Toggle
                type="primary"
                label="Show media"
                onToggle={this.toggleView}
              />
              <Dropdown label={sort}>
                <Button label="hot" to={this.newPath("")} />
                <Button label="new" to={this.newPath("new")} />
                <Button label="rising" to={this.newPath("rising")} />
                <Button
                  label="controversial"
                  to={this.newPath("controversial", "all")}
                />
                <Button label="top" to={this.newPath("top", "all")} />
              </Dropdown>
              {(sort === "top" || sort === "controversial") && (
                <Dropdown label={sortTime}>
                  <Button label="hour" to={this.newPath(sort, "hour")} />
                  <Button label="day" to={this.newPath(sort, "day")} />
                  <Button label="week" to={this.newPath(sort, "week")} />
                  <Button label="month" to={this.newPath(sort, "month")} />
                  <Button label="year" to={this.newPath(sort, "year")} />
                  <Button
                    label="all time"
                    value="all"
                    to={this.newPath(sort, "all")}
                  />
                </Dropdown>
              )}
              <Button
                label="Refresh"
                hideLabel
                icon="refresh"
                onClick={this.fetchListing}
              />
            </VSContents>
            {fetching || fetchingMore ? <ProgressUnderline /> : null}
          </ViewSettings>
          <ScrollWrapper>
            <Listing
              compact={compact}
              listing={listing}
              subreddits={subreddits}
              subredditName={subredditName}
              fetching={fetching}
              fetchSubreddit={this.fetchSubreddit}
            />
          </ScrollWrapper>
          {fetching || fetchingMore ? <ProgressOverlay /> : null}
        </Column>
      </ThemeProvider>
    );
  }
}

// Prevents page contents from shifting when scrollbar disappears
// due to lightbox being open.
const ScrollWrapper = styled.div``;

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
  const { currentPostId, subreddits, lightboxIsOpen } = state;
  return {
    currentPostId,
    subreddits,
    lightboxIsOpen,
  };
}

export default connect(
  mapStateToProps,
  { addSubreddit, setCurrentPost }
)(withTheme(PostListing));
