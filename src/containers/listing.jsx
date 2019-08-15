import React from "react";
import { connect } from "react-redux";
import { setCurrentPost, addColorTheme } from "../store/actions";
import styled, { withTheme } from "styled-components";
import Post from "./post";
import { genTheme } from "../utils/color";

const StyledListing = styled.div`
  max-width: 75rem;
  margin: 1rem auto;
`;

const Listing = ({
  listing,
  subName,
  setCurrentPost,
  themesByColor,
  addColorTheme,
  theme: inheritedTheme,
  username,
}) => {

  return listing ? (
    <StyledListing>
      {listing.map((post, i) => {
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
            inSubreddit={subName === post.subreddit.display_name}
            post={post}
            key={i}
            inListing
            id={post.id}
            setCurrentPost={setCurrentPost}
            theme={theme}
            username={username}
          />
        );
      })}
    </StyledListing>
  ) : null;
};

function mapStateToProps(state) {
  const { themesByColor, user } = state;
  return { themesByColor, username: user.name, };
}

export default connect(
  mapStateToProps,
  {
    setCurrentPost,
    addColorTheme
  }
)(withTheme(Listing));
