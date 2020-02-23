import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import styled, { withTheme } from "styled-components";
import { withRouter } from "react-router-dom";
import { genSubIconColor } from "../style/gen-theme";
import { meetsContrastGuidelines } from "polished";

const SubredditIcon = ({
  subName = "",
  sub,
  sub: {
    display_name: displayName = null,
    primary_color: primaryColor = null,
    key_color: keyColor = null,
    banner_background_color: bannerBgColor = null,
    community_icon: comIcon = null,
    icon_img: iconImg = null,
    icon_url: iconUrl = null,
  } = {},
  size,
  flat,
  theme,
  passRef,
  history,
  ...props
}) => {
  if (!sub) return null;

  const subColor = primaryColor || keyColor || bannerBgColor || null;

  const url =
    comIcon !== ""
      ? comIcon
      : iconImg !== ""
      ? iconImg
      : iconUrl !== ""
      ? iconUrl
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

  const goTo = () => history.push(`/r/${displayName || subName}`);

  return (
    <div ref={passRef}>
      <Circle
        size={size}
        flat={!url || flat ? "true" : undefined}
        color={color}
        bgColor={bgColor}
        url={url}
        onClick={goTo}
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
})(withTheme(withRouter(SubredditIcon)));

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
  cursor: pointer;
  user-select: none;
  height: 1.5em;
  width: 1.5em;
  border-radius: 50%;
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
  overflow: hidden;
  text-align: center;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: 100% auto;
  background-origin: border-box;
  background-clip: border-box;
  &.square {
    border-radius: 0;
  }
  &:hover,
  &:active,
  &:focus {
    text-decoration: none;
  }
`;
