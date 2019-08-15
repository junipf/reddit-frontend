import React from "react";
import { connect } from "react-redux";
import styled, { withTheme } from "styled-components";
import { genSubIconColor } from "../style/gen-theme";
import { meetsContrastGuidelines } from "polished";

import { ReactComponent as LogoSVG } from "../icons/logo.svg";

export const Logo = (props) => (
  <Circle {...props}>
    <LogoSVG />
  </Circle>
);

const SubredditIcon = ({
  subName = "",
  subreddit,
  size,
  flat,
  theme,
  passRef,
  ...props
}) => {
  if (!subreddit) return;
  const {
    primary_color = null,
    key_color = null,
    banner_background_color = null,
    community_icon = null,
    icon_img = null,
    icon_url = null,
  } = subreddit;

  const subColor =
    primary_color || key_color || banner_background_color || null;

  const url =
    community_icon !== ""
      ? community_icon
      : icon_img !== ""
      ? icon_img
      : icon_url !== ""
      ? icon_url
      : null;

  const bgColor = subColor
    ? genSubIconColor(subColor)
    : theme.subredditIcon.light;

  const color = bgColor
    ? meetsContrastGuidelines(bgColor, theme.subredditIcon.dark).AALarge
      ? theme.subredditIcon.dark
      : theme.subredditIcon.light
    : theme.subredditIcon.dark;

  const letter = url ? null : subName ? subName.charAt(0).toUpperCase() : null;

  return (
    <div ref={passRef}>
      <Circle
        size={size}
        flat={url ? undefined : flat}
        color={color}
        bgColor={bgColor}
        url={url}
        {...props}
      >
        {letter}
      </Circle>
    </div>
  );
};

function mapStateToProps(state, { subName }) {
  const { subreddits } = state;

  if (subName && subreddits[subName.toLowerCase()]) {
    return { subreddit: subreddits[subName.toLowerCase()] };
  }
  return { subreddit: {} };
}

export default connect(mapStateToProps)(withTheme(SubredditIcon));

const Circle = styled.div.attrs(({url, bgColor, color}) => {
  return {
    style: {
      backgroundImage: url ? "url(" + url + ")" : null,
      backgroundColor: bgColor,
      color: color,
    },
  };
})`
  user-select: none;

  height: 1.5em;
  width: 1.5em;
  border-radius: 50%;
  /* margin-right: 0.25em; */
  flex: 0 0 1.5em;
  text-align: center;

  line-height: 1.4;
  overflow: hidden;

  font-size: ${({size}) =>
    size === "xl"
      ? "5rem"
      : size === "large"
      ? "1.5rem"
      : size === "small"
      ? "0.8rem"
      : "1rem"};
  font-weight: 100;
  text-align: center;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: 100% auto;
  background-origin: border-box;
  background-clip: border-box;
  /* border: 0.0625em solid ${({theme}) => theme.card.innerBorder}; */
  &.square {
    border-radius: 0;
  }
  &:hover,
  &:active,
  &:focus {
    text-decoration: none;
  }
`;
