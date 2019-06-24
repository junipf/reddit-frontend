import React from "react";
import styled, { withTheme } from "styled-components";
import Icon from "./icon";
import { genSubIconColor } from "../utils/color";
import { meetsContrastGuidelines } from "polished";

const SubredditIcon = props => {
  const {
    primary_color,
    key_color,
    banner_background_color,
    display_name,
    size,
    theme,
    community_icon,
    icon_img,
    icon_url,
  } = props;

  const icon =
    community_icon !== ""
      ? community_icon
      : icon_img !== ""
      ? icon_img
      : icon_url !== ""
      ? icon_url
      : null;

  const bgColor =
    primary_color && primary_color !== ""
      ? genSubIconColor(primary_color)
      : key_color && key_color !== ""
      ? genSubIconColor(key_color)
      : banner_background_color && banner_background_color !== ""
      ? genSubIconColor(banner_background_color)
      : theme.subredditIcon.light;

  const color = bgColor
    ? meetsContrastGuidelines(bgColor, theme.subredditIcon.dark).AALarge
      ? theme.subredditIcon.dark
      : theme.subredditIcon.light
    : theme.subredditIcon.dark;

  const letter =
    !icon && display_name ? display_name.charAt(0).toUpperCase() : null;

  return (
      <Circle
        icon={icon ? "url(" + icon + ")" : null}
        bgColor={bgColor}
        color={color}
        size={size}
      >
        {letter}
      </Circle>
  );
};

export default withTheme(SubredditIcon);

const Circle = styled.div.attrs(props => {
  // console.log(props.bgColor);
  return {
    style: {
      backgroundImage: props.icon,
      backgroundColor: props.bgColor,
      color: props.color,
    },
  };
})`
  height: 1.5em;
  width: 1.5em;
  border-radius: 50%;
  /* margin-right: 0.25em; */
  flex: 0 0 1.5rem;
  text-align: center;

  line-height: 1.4;
  overflow: hidden;

  font-size: ${props => (props.size === "large" ? "1.5rem" : "1rem")};
  font-weight: 100;
  text-align: center;
  background-color: ${props => props.theme.container.levels[2]};
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: 100% auto;
  background-origin: padding-box;
  background-clip: border-box;
  transition: box-shadow 0.1s ease;
  border: 1px solid ${props => props.theme.container.innerBorder};
  &:hover {
    box-shadow: 0 0 0 3px ${props => props.theme.button.primary.focus};
  }
  &.square {
    border-radius: 0;
  }
  &:hover,
  &:active,
  &:focus {
    text-decoration: none;
  }
`;

const Square = styled(Circle)`
  border-radius: 0;
  border-width: 0;
  &:hover {
    box-shadow: none;
  }
`;

const IconCircle = styled(Circle)`
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LogoIcon = props => (
  <Square {...props}>
    <Icon icon="logo" doNotAlignBaseline thin />
  </Square>
);
export const FrontpageIcon = props => (
  <IconCircle {...props}>
    <Icon icon="home" doNotAlignBaseline thin />
  </IconCircle>
);
export const PopularIcon = props => (
  <IconCircle {...props}>
    <Icon icon="popular" doNotAlignBaseline thin />
  </IconCircle>
);
export const AllIcon = props => (
  <IconCircle {...props}>
    <Icon icon="all" doNotAlignBaseline thin />
  </IconCircle>
);
