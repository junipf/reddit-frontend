import React from "react";
import styled, { ThemeProvider, withTheme } from "styled-components";
import { connect } from "react-redux";
import { Requester } from "../components/requester";
import Post from "./post";
import Comment from "./comment";
import { Spinner } from "../components/spinner";

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
    };
  }
  componentDidMount() {
    this.fetchComments();
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { currentPost } = this.props;
    const { currentPost: nextPost } = nextProps;
    return currentPost !== nextPost || this.state !== nextState;
  }
  componentDidUpdate(prevProps) {
    if (this.props.match.params.id && this.props.match.params.id !== prevProps.match.params.id)
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
    } = this.props;
    const {
      // lightboxOpen,
      post: fetchedPost,
      focusedComments,
      // fetching,
      // fetchingMore,
    } = this.state;

    const post = fetchedPost ? fetchedPost : currentPost ? currentPost : null;
    if (post === null) {
      return <Column><Spinner /></Column>;
    }
    console.log(
      "fetchedPost",
      fetchedPost,
      "currentPost",
      currentPost,
      "post",
      post
    );
    const threadPost = post ? (
      <Post
        subredditInfo={subreddits[post.subreddit.display_name]}
        inSubreddit={false}
        post={post}
        key={post.id}
        id={post.id}
        toggleLightboxOpen={this.toggleLightboxOpen}
      />
    ) : (
      <Spinner />
    );
    const comments = focusedComments !== null ? focusedComments : post.comments;
    const noComments = post && post.comments === 0;
    let commentList =
      comments === undefined || comments === [] ? (
        noComments ? (
          "No comments yet!"
        ) : (
          <Spinner />
        )
      ) : (
        comments.map(comment => <Comment {...comment} key={comment.id} />)
      );
    let theme = inheritedTheme;
    if (themesBySubreddit[subredditName]) {
      theme = themesBySubreddit[subredditName][useDark ? "dark" : "light"];
    }
    console.log(themesBySubreddit[subredditName]);
    console.log(theme);
    return (
      <ThemeProvider theme={theme}>
        <Column ref={this.column}>
          <Listing>
            {threadPost}
            <Comments>
              {commentList}
            </Comments>
          </Listing>
        </Column>
      </ThemeProvider>
    );
  }
  btxfbc;
}

const Comments = styled.div`
  margin: 0 0.5rem;
  padding: 0.5rem;
  background-color: ${props => props.theme.container.levels[0]};
  color: ${props => props.theme.container.color};
  border: 1px solid ${props => props.theme.container.border};
  border-width: 0 1px;
`;

const Listing = styled.div`
  max-width: 800px;
  margin: 0 auto;
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
  const { subreddits, currentPost, themesBySubreddit } = state;
  return { subreddits, currentPost, themesBySubreddit };
}

export default connect(mapStateToProps)(withTheme(CommentListing));
