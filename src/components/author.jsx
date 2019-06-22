import React from "react";
import styled from "styled-components";
import Icon from "./icon";

import { Link } from "react-router-dom";

const User = styled(Link)`
  color: ${props => props.theme.author[props.type] || "inherit"};
  text-decoration: none;
  margin: 0 0.25em 0 0.5em;
`;

const ModIcon = styled(Icon)`
  color: ${props => props.theme.author.moderator};
`;

const AdminIcon = styled(Icon)`
  color: ${props => props.theme.author.administrator};
`;

const SubmitterIcon = styled(Icon)`
  color: ${props => props.theme.author.submitter};
`;

export const Author = ({
  authorName,
  distinguished,
  is_submitter = false,
  isCrosspost,
  prefix,
}) => {
  const crosspostIcon = isCrosspost ? (
    <Icon icon="xpost" data-tip={"Crossposted by u/" + authorName} />
  ) : null;

  let distinguishIcon = null;
  if (distinguished) {
    if (distinguished === "moderator") {
      distinguishIcon = (
        <ModIcon icon="shield" data-tip="Moderator speaking officially" />
      );
    }
    if (distinguished === "administrator") {
      distinguishIcon = (
        <AdminIcon
          icon="hexagon"
          data-tip="Reddit employee speaking officially"
        />
      );
    }
  }

  const submitterIcon = is_submitter ? (
    <SubmitterIcon icon="user" data-tip="Submitter" />
  ) : null;

  const distinguishType = is_submitter ? "submitter" : distinguished;

  return (
    <span>
      {crosspostIcon}
      <User
        type={distinguishType}
        to={"/u/" + authorName}
        data-delay-show="500"
        data-tip={"Go to " + authorName + "'s page"}
      >
        {prefix && "u/"}
        {authorName}
        {distinguishIcon}
        {submitterIcon}
      </User>
    </span>
  );
};
