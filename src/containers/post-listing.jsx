import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Requester } from "../components/requester";
import {
  addSubreddit,
  setCurrentPost,
  addSubredditTheme,
  addColorTheme,
  setLocationName,
} from "../store/actions";
import styled, { ThemeProvider, withTheme } from "styled-components";
import useIntersect from "../utils/use-intersect";

import Post from "./post";
import Button from "../components/button";
import { SpinnerPage } from "../components/spinner";
import Dropdown from "../components/dropdown";
import SubredditIcon from "../components/subreddit-icon";
import { ProgressOverlay, ProgressUnderline } from "../components/progress-bar";
import { genSubredditTheme, genTheme } from "../utils/color";

const SubredditBanner = styled.div.attrs(props => ({
  style: {
    backgroundColor: props.banner_background_color,
    backgroundImage: "url(" + props.banner_background_image + ")",
    height: props.display_name ? "10rem" : "0", // Detects frontpage/popular/all
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
`;
const StyledListing = styled.div`
  max-width: 48rem;
  margin: 0 auto 0.5rem auto;
`;

const Listing = props => {
  const {
    listing,
    subreddits,
    subredditName,
    setCurrentPost,
    fetchSubreddit,
    fetchMore,
    themesByColor,
    addColorTheme,
    inheritedTheme,
  } = props;

  const [ref, entry] = useIntersect({
    threshold: [0.0, 0.5, 1.0],
  });

  if (entry.isIntersecting) fetchMore();

  return listing ? (
    <StyledListing>
      {listing.map((post, i) => {
        if (
          subreddits[post.subreddit.display_name.toLowerCase()] === undefined
        ) {
          fetchSubreddit(post.subreddit.display_name);
        }
        let theme = inheritedTheme;
        if (
          post.link_flair_background_color &&
          post.link_flair_background_color !== ""
        ) {
          if (themesByColor[post.link_flair_background_color]) {
            theme = inheritedTheme.dark
              ? themesByColor[post.link_flair_background_color].dark
              : themesByColor[post.link_flair_background_color].light;
          } else {
            const generatedTheme = genTheme(post.link_flair_background_color);
            addColorTheme(post.link_flair_background_color, generatedTheme);
            theme = inheritedTheme.dark
              ? generatedTheme.dark
              : generatedTheme.light;
          }
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
            theme={theme}
          />
        );
      })}
      <NextPage ref={ref} />
    </StyledListing>
  ) : null;
};

const NextPage = styled(SpinnerPage)`
  display: block;
`;

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
    const { subredditName, id } = this.props.match.params;

    console.log(this.props.match.params);

    // We take the subredditName from the URL, but only if there is no ID.
    // (e.g. we take /r/firefox, but not /r/firefox/comments/c6xrwv/...)
    // This allows normal navigation (clicking links) to update the listing.
    if (!id && subredditName !== this.state.subredditName) {
      console.info(
        "PostListing detected subreddit switch to: " + subredditName
      );
      document.title = subredditName ? "r/" + subredditName : "Frontpage";
      this.setSubreddit(subredditName);
    }

    // If the subreddit name, sort, or sort time - in state - updates, we
    // fetch the new listing. This means that there is an update when we get
    // the subredditName from the URL, then another after it's set to state -
    // so it's important to prevent re-renders.
    if (sort !== prevSort || time !== prevTime) {
      this.fetchListing(this.state.subredditName);
    }

    // If the ID vanishes, we now have control of the URL.
    if (prevProps.match.params.id && !this.props.match.params.id)
      this.setSort({
        subredditName: this.props.match.params.subredditName || "frontpage",
      });
  }
  setSubreddit = subredditName => {
    console.info("Setting Subreddit to: " + subredditName);
    this.setState({ subredditName });
    this.fetchListing(subredditName);
    const {
      addSubreddit,
      themesBySubreddit,
      addSubredditTheme,
      setLocationName,
    } = this.props;
    setLocationName(subredditName || "Frontpage");
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
  refreshListing = () => this.fetchListing(this.state.subredditName);
  fetchListing = subredditName => {
    const { sort = "hot", time = "all" } = this.state;
    console.info("Fetching: " + subredditName);
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
  // handleScroll = e => {
  //   if (!this.state.fetchingMore) {
  //     const bottom =
  //       e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <=
  //       1000;
  //     if (bottom) {
  //       this.fetchMore();
  //     }
  //   }
  // };

  // Passes sort & time to state, and, if we control the URL,
  // we build and update it.
  setSort = ({
    subredditName = this.state.subredditName,
    sort = this.state.sort,
    time = this.state.time,
  }) => {
    const subName = subredditName === "frontpage" ? undefined : subredditName;
    if (
      this.state.subredditName !== subName ||
      this.state.sort !== sort ||
      this.state.time !== time
    ) {
      this.setState({
        subredditName: subName,
        sort,
        time,
      });
    }
    if (!this.props.match.params.id) {
      let url = subName ? "/r/" + subName : "";
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
      themesByColor,
      addColorTheme,
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
                  onClick={this.setSort}
                  value={{ sort: "hot" }}
                />
                <Button
                  label="best"
                  onClick={this.setSort}
                  value={{ sort: "best" }}
                />
                <Button
                  label="new"
                  onClick={this.setSort}
                  value={{ sort: "new" }}
                />
                <Button
                  label="rising"
                  onClick={this.setSort}
                  value={{ sort: "rising" }}
                />
                {TimeDropdown("controversial", this.setSort)}
                {TimeDropdown("top", this.setSort)}
              </Dropdown>
              {sort === "top" || sort === "controversial"
                ? TimeDropdown(sort, this.setSort, time)
                : null}
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
                fetchMore={this.fetchMore}
                themesByColor={themesByColor}
                addColorTheme={addColorTheme}
                inheritedTheme={theme}
              />
            </ScrollWrapper>
          )}
          {fetching || fetchingMore ? <ProgressOverlay /> : null}
        </Column>
      </ThemeProvider>
    );
  }
}

// Just a function (e.g. not a component) so Dropdowns are treated as Sub
const TimeDropdown = (sort, onClick, label) => (
  <Dropdown label={label || sort}>
    <Button label="hour" onClick={onClick} value={{ sort, time: "hour" }} />
    <Button label="day" onClick={onClick} value={{ sort, time: "day" }} />
    <Button label="week" onClick={onClick} value={{ sort, time: "week" }} />
    <Button label="month" onClick={onClick} value={{ sort, time: "month" }} />
    <Button label="year" onClick={onClick} value={{ sort, time: "year" }} />
    <Button label="all time" onClick={onClick} value={{ sort, time: "all" }} />
  </Dropdown>
);

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
  position: sticky;
  top: 0rem;
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
    themesByColor,
  } = state;
  return {
    currentPostId,
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
    setCurrentPost,
    addSubredditTheme,
    addColorTheme,
    setLocationName,
  }
)(withTheme(withRouter(PostListing)));
