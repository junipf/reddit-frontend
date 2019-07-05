import React from "react";
import { connect } from "react-redux";
import { Requester } from "../components/requester";
import {
  addSubreddit,
  setCurrentPost,
  addSubredditTheme,
  addColorTheme,
} from "../store/actions";
import Post from "./post";
import styled, { ThemeProvider, withTheme } from "styled-components";
import { Spinner } from "../components/spinner";
import Button from "../components/button";
import { genTheme } from "../utils/color";
import { ProgressUnderline } from "../components/progress-bar";
import Dropdown from "../components/dropdown";

class CommentListing extends React.Component {
  static contextType = Requester;
  constructor(props) {
    super(props);
    this.column = React.createRef();
    this.state = {
      lightboxOpen: false,
      post: null,
      focusedComments: null,
      fetching: true,
      fetchingMore: false,
      sort: "best",
    };
  }
  componentDidMount() {
    this.fetchComments();
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   const {
  //     currentPost,
  //     match: {
  //       params: { id },
  //     },
  //   } = this.props;
  //   const {
  //     match: {
  //       params: { id: nextId },
  //     },
  //   } = nextProps;
  //   const { currentPost: nextPost } = nextProps;
  //   return (
  //     id !== nextId || currentPost !== nextPost || this.state !== nextState
  //   );
  // }
  componentDidUpdate(prevProps) {
    if (
      this.props.match.params.id &&
      this.props.match.params.id !== prevProps.match.params.id
    )
      this.fetchComments();
  }
  fetchComments = () => {
    const { id, commentId } = this.props.match.params;

    this.setState({ fetching: true });

    // If we have a commentId it's treated as
    // a permalink to that comment, so only it's loaded.
    if (commentId)
      this.context
        .getComment(commentId)
        .then(
          focusedComments =>
            this.setState({ focusedComments, fetching: false }),
          error => console.error(error)
        );
    else if (id)
      this.context
        .getSubmission(id)
        .fetch()
        .then(
          post =>
            this.setState({
              fetching: false,
              post,
            }),
          error => console.error(error)
        );

    // TODO: .../?sort=new
    // const get =
    //   sort === "hot" || sort === undefined
    //     ? this.context.getHot(subredditName, { time: sortTime })
    //     : sort === "new"
    //     ? this.context.getNew(subredditName, { time: sortTime })
    //     : sort === "rising"
    //     ? this.context.getRising(subredditName, { time: sortTime })
    //     : sort === "controversial"
    //     ? this.context.getControversial(subredditName, { time: sortTime })
    //     : sort === "top"
    //     ? this.context.getTop(subredditName, { time: sortTime })
    //     : null;
    // if (get) {
    //   this.setState({ fetching: true });
    //   get.then(
    //     result => this.setState({ fetching: false, listing: result }),
    //     error => console.error(error)
    //   );
    // }
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
  toggleLightboxOpen = () => {
    this.setState({ lightboxOpen: !this.state.lightboxOpen });
  };
  setSort = ({ sort = this.state.sort }) => {
    if (this.state.sort !== sort) this.setState({ sort });
  };
  render() {
    const {
      subreddits,
      match: {
        params: { subredditName },
      },
      theme: { dark: useDark },
      theme: inheritedTheme,
      themesBySubreddit,
      currentPost,
      themesByColor,
    } = this.props;
    const {
      // lightboxOpen,
      post: fetchedPost,
      focusedComments,
      fetching,
      fetchingMore,
      sort,
    } = this.state;

    const post = fetchedPost ? fetchedPost : currentPost ? currentPost : null;
    if (post === null) {
      return (
        <Column>
          <Spinner />
        </Column>
      );
    }
    const threadPost = post ? (
      <Post
        subredditInfo={subreddits[post.subreddit.display_name.toLowerCase()]}
        inSubreddit={false}
        post={post}
        key={post.id}
        id={post.id}
        toggleLightboxOpen={this.toggleLightboxOpen}
        showComments
      />
    ) : (
      <Spinner />
    );
    const comments = focusedComments !== null ? focusedComments : post.comments;
    let theme = inheritedTheme;
    if (themesBySubreddit[subredditName]) {
      theme = useDark
        ? themesBySubreddit[subredditName].dark
        : themesBySubreddit[subredditName].light;
    }
    // if (
    //   post.link_flair_background_color &&
    //   post.link_flair_background_color !== ""
    // ) {
    //   if (themesByColor[post.link_flair_background_color]) {
    //     theme = inheritedTheme.dark
    //       ? themesByColor[post.link_flair_background_color].dark
    //       : themesByColor[post.link_flair_background_color].light;
    //   } else {
    //     const generatedTheme = genTheme(post.link_flair_background_color);
    //     addColorTheme(post.link_flair_background_color, generatedTheme);
    //     theme = inheritedTheme.dark
    //       ? generatedTheme.dark
    //       : generatedTheme.light;
    //   }
    // }
    console.log(comments);
    return (
      <ThemeProvider theme={theme}>
        <Column ref={this.column}>
          <ViewSettings>
            <VSContents>
              <Button
                label="Close comment thread"
                icon="x"
                hideLabel
                to={"/r/" + post.subreddit.display_name}
              />
              <Button
                label="Refresh"
                hideLabel
                icon="refresh"
                onClick={this.fetchComments}
              />
              <Dropdown label={sort}>
                <Button
                  label="best"
                  onClick={this.setSort}
                  value={{ sort: "best" }}
                />
                <Button
                  label="top"
                  onClick={this.setSort}
                  value={{ sort: "top" }}
                />
                <Button
                  label="new"
                  onClick={this.setSort}
                  value={{ sort: "new" }}
                />
                <Button
                  label="controversial"
                  onClick={this.setSort}
                  value={{ sort: "controversial" }}
                />
                <Button
                  label="old"
                  onClick={this.setSort}
                  value={{ sort: "old" }}
                />
                <Button
                  label="QnA"
                  onClick={this.setSort}
                  value={{ sort: "QnA" }}
                />
              </Dropdown>
            </VSContents>
            {fetching || fetchingMore ? <ProgressUnderline /> : null}
          </ViewSettings>
          <Listing>
            {threadPost}
            {/* {fetching ? (
              <Spinner />
            ) : comments.length === 0 ? (
              "No comments"
            ) : (
              <Comments>
                {comments.map(comment => (
                  <Comment {...comment} key={comment.id} />
                ))}
              </Comments>
            )} */}
          </Listing>
        </Column>
      </ThemeProvider>
    );
  }
}

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
  max-width: 800px;
  margin: 0 auto;
`;

// const Comments = styled.div`
//   margin: 0 0.5rem;
//   padding: 0.5rem;
//   background-color: ${props => props.theme.container.levels[0]};
//   color: ${props => props.theme.container.color};
//   border: 1px solid ${props => props.theme.container.border};
//   border-width: 0 1px 1px 1px;
// `;

const Listing = styled.div`
  max-width: 800px;
  margin: 0 auto;
  min-height: 5rem;
`;

const Column = styled.div`
  scroll-behavior: smooth;
  color: ${props => props.theme.container.color};
  background-color: ${props => props.theme.column.background};
  overflow-x: hidden;
  overflow-y: ${props => (props.lightboxIsOpen ? "hidden" : "scroll")};
  flex: 1 1 80vw;
  scrollbar-color: ${props => props.theme.scrollbar};
`;

function mapStateToProps(state) {
  const { subreddits, currentPost, themesBySubreddit, themesByColor } = state;
  return { subreddits, currentPost, themesBySubreddit, themesByColor };
}

export default connect(
  mapStateToProps,
  { addSubreddit, setCurrentPost, addSubredditTheme, addColorTheme }
)(withTheme(CommentListing));
