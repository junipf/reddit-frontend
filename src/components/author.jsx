import React from "react";
import styled from "styled-components";
import Icon from "./icon";
// import { Link } from "react-router-dom";

// const User = styled(Link)`
const User = styled.span`
  color: ${({ type }) => (type ? "#fff" : null)};
  padding: ${({ type }) => (type ? "0 0.25em" : null)};
  border-radius: ${({ type }) => (type ? "0.25em" : null)};
  background-color: ${({ type, theme }) => theme.author[type] || "transparent"};
  text-decoration: none;
  margin-right: 0.25em;
  font-weight: 400;
`;

const ColoredIcon = styled(Icon)`
  color: ${({ type, theme }) => theme.author[type]};
  svg {
    fill: currentColor;
  }
`;

export const Author = ({
  authorName,
  distinguished,
  is_submitter = false,
  prefix,
}) => (
  <span>
    <User
      type={distinguished ? distinguished : is_submitter ? "submitter" : null}
      // to={"/u/" + authorName}
      // data-delay-show="500"
      // data-tip={`Go to ${authorName}'s page`}
    >
      {prefix && "u/"}
      {authorName}
    </User>
    {distinguished === "moderator" ? (
      <ColoredIcon
        type="moderator"
        icon="shield"
        data-tip="Moderator speaking officially"
      />
    ) : null}
    {distinguished === "administrator" ? (
      <ColoredIcon
        type="moderator"
        icon="hexagon"
        data-tip="Reddit employee speaking officially"
      />
    ) : null}
    {is_submitter ? (
      <ColoredIcon type="submitter" icon="user" data-tip="Original Poster" />
    ) : null}
  </span>
);
