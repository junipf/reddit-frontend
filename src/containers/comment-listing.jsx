import React from "react";

import { connect } from "react-redux";
import Post from "./post";
import Comment from "./Comment";
import { Spinner } from "../components/spinner";

class CommentListing extends React.Component {
  constructor(props) {
    super(props);
    this.column = React.createRef();
    this.state = { lightboxOpen: false };
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { post, comments } = this.props;
    const { post: nextPost, comments: nextComments } = nextProps;
    return (
      comments !== nextComments || post !== nextPost || this.state !== nextState
    );
  }
  toggleLightboxOpen = () => {
    this.setState({ lightboxOpen: !this.state.lightboxOpen });
  };
  render() {
    const { post, comments, currentPostId, subreddits } = this.props;
    if (currentPostId === null) return null;
    let threadPost =
      post === undefined ? (
        <Spinner />
      ) : (
        <Post
          subredditInfo={subreddits[post.subreddit.display_name]}
          post={post}
          key={post.id}
          toggleLightboxOpen={this.toggleLightboxOpen}
        />
      );
    let noComments = post ? (post.num_comments === 0 ? true : false) : false;
    let commentList =
      comments === undefined ? (
        noComments ? (
          "No comments yet!"
        ) : (
          <Spinner />
        )
      ) : (
        comments.map(comment => <Comment {...comment} key={comment.id} />)
      );
    const className = this.state.lightboxOpen
      ? "secondary column lightbox-open"
      : "secondary column";
    return (
      <div className={className} ref={this.column}>
        <div className="comment-listing">
          {threadPost}
          {commentList}
        </div>
      </div>
    );
  }
  btxfbc;
}

function mapStateToProps(state) {
  const { postsById, commentsById, currentPostId, subreddits } = state;

  return {
    post: postsById[currentPostId],
    comments: commentsById[currentPostId],
    currentPostId,
    subreddits,
  };
}

export default connect(mapStateToProps)(CommentListing);
