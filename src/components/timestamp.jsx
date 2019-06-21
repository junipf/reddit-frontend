import React from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

export const formatTime = time =>
  timeAgo.format(new Date(time * 1000), "twitter");

export const TimestampTestPage = props => (
  <div style={{ margin: "2em" }}>
    <div />
    <Timestamp time={1558516866} />
    <div />
    <Timestamp time={1558516866} to="/lmao" />
    <div />
    <Timestamp time={1558516866}>Text</Timestamp>
    <div />
    <Timestamp time={1558516866}>
      <span>span 1</span>
      <span>span 2</span>
    </Timestamp>
    <div />
    <Timestamp time={1558516866} />
    <div />
    <Timestamp time={1558516866} tooltipLabel="Edited" label="*" />
    <div />
  </div>
);

const StyledTs = styled.span`
  color: ${props => props.theme.container.link};
`;

const StyledTsLink = styled(Link)`
  color: ${props => props.theme.container.color};
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
    ...props,
  };

  return to ? (
    <StyledTsLink to={to} {...properties}>
      {children}
      {_label}
    </StyledTsLink>
  ) : (
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
