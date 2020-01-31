import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import styled, { withTheme } from "styled-components";
import { genSubIconColor } from "../style/gen-theme";
import { meetsContrastGuidelines } from "polished";

const SubredditIcon = ({
  subName = "",
  sub,
  sub: {
    primary_color = null,
    key_color = null,
    banner_background_color = null,
    community_icon = null,
    icon_img = null,
    icon_url = null,
  } = {},
  size,
  flat,
  theme,
  passRef,
  ...props
}) => {
  if (!sub) return null;

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
        flat={!url || flat ? "true" : undefined}
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

export default connect(({ subreddits }, { subName, sub }) => {
  if (sub) return { sub };
  if (subName && subreddits[subName.toLowerCase()])
    return { sub: subreddits[subName.toLowerCase()] };
  return { sub: {} };
})(withTheme(SubredditIcon));

SubredditIcon.propTypes = {
  size: PropTypes.oneOf(["small", "normal", "large", "xl"]),
};

const Circle = styled.div.attrs(({ url, bgColor, color }) => {
  return {
    style: {
      backgroundImage: url ? "url(" + url + ")" : null,
      backgroundColor: bgColor,
      color: color,
    },
  };
})`
  user-select: none;

  /* display: flex; */
  /* flex-flow: row nowrap; */
  /* align-items: center; */
  /* justify-content: center; */

  height: 1.5em;
  width: 1.5em;
  border-radius: 50%;
  /* margin-right: 0.25em; */
  flex: 0 0 1.5em;
  text-align: center;
  line-height: 1.618;
  font-size: ${({ size }) =>
    size === "xl"
      ? "4.236rem"
      : size === "large"
      ? "1.618rem"
      : size === "small"
      ? "0.618rem"
      : "1rem"};
      
  font-weight: ${({ size }) =>
    size === "xl"
      ? 100
      : size === "large"
      ? 300
      : size === "small"
      ? 800
      : 400};

  /* line-height: 1.4; */
  overflow: hidden;
  text-align: center;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: 100% auto;
  background-origin: border-box;
  background-clip: border-box;
  /* border: 0.0625em solid ${({ theme }) => theme.card.innerBorder}; */
  &.square {
    border-radius: 0;
  }
  &:hover,
  &:active,
  &:focus {
    text-decoration: none;
  }
`;
