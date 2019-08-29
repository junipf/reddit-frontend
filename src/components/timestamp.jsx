import React from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export const formatTime = (time) =>
  timeAgo.format(new Date(time * 1000), "twitter");

const StyledTs = styled.span`
  color: ${({theme}) => theme.text};
`;

export const Timestamp = ({
  time,
  to,
  tooltipLabel = "",
  label,
  children = null,
  ...props
}) => {
  const date = new Date(time * 1000);
  const timeAgoString = timeAgo.format(date, "twitter");
  const timeString = date.toLocaleTimeString() + ", " + date.toDateString();

  const _label = !children ? <span>{label || timeAgoString}</span> : null;

  let _tooltipLabel = tooltipLabel + " ";
  _tooltipLabel +=
    label || children
      ? timeAgoString + "<br> (" + timeString + ")"
      : timeString;

  const properties = {
    "data-tip": _tooltipLabel,
    "data-delay-show": 500,
    as: to ? Link : null,
    to: to ? to : null,
    ...props,
  };

  return (
    <StyledTs {...properties}>
      {children}
      {_label}
    </StyledTs>
  );
};

Timestamp.propTypes = {
  time: PropTypes.number.isRequired,
  to: PropTypes.string,
  tooltipLabel: PropTypes.string,
  label: PropTypes.string,
};
