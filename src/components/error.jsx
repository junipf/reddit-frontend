import React from "react";
import styled from "styled-components";
import Icon from "./icon";
import Card from "./card";
import Button from "./button";

const Error = ({ e = {}, name, type, onClose, ...props }) => {
  const message = {
    403: `You aren't allowed to access this ${type}`,
    404: `${name} does not exist.`,
    "": `${name} does not exist.`,
  };

  const errors = {
    400: `Bad request`,
    401: `Not authorized`,
    403: `Forbidden`,
    404: `Not found`,
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
  };

  console.error(e);

  // console.log(`${type} error ${e.message} on ${name}`);

  const title =
    type === "subreddit" && e.message === "403"
      ? `${name} is private`
      : e.message.includes("ratelimit")
      ? "You're loading too much too fast. This is probably a bug with the app."
      : message[e.message]
      ? message[e.message]
      : e.message.charAt(0) === 4
      ? "Something went wrong."
      : e.message.charAt(0) === 5
      ? "Something went wrong with reddit."
      : e.message;

  const details =
    type === "subreddit" && e.message === "403"
      ? "You must be invited to this community"
      : e.message.includes("ratelimit")
      ? "Ratelimit exceeded."
      : errors[e.message]
      ? message[e.message]
        ? `(Error ${e.message}: ${errors[e.message]})`
        : `(${errors[e.message]})`
      : null;

  const icon = type === "subreddit" && e.message === "403" ? "lock" : "frown";

  const reportable =
    e.message.includes("ratelimit") || e.message.charAt(0) === "4";

  const reportUrl = `https://github.com/junipf/reddit-frontend/issues/new?labels=bug&title=[Bug:+${encodeURIComponent(type)}]&body=${encodeURIComponent(`## Expected Behavior


  ## Actual Behavior
  
  
  ## Steps to Reproduce the Problem
  
    1.
    2.
    3.
  
  ## Specifications
  
  message: ${e.message}
  type: ${type}
  path: ${document.location.pathname}
  origin: ${document.location.origin}
  
  ## Specifications
  
  browser: ${navigator.userAgent}`)}`;

  return (
    <StyledError {...props}>
      <Icon icon={icon} size="xl" />
      <Title>{title}</Title>
      {details ? <Details>{details}</Details> : null}
      <Actions>
        {reportable ? <Button href={reportUrl}>report bug</Button> : null}
        {onClose ? <Button primary onClick={onClose}>
          dismiss
        </Button> : null}
      </Actions>
    </StyledError>
  );
};

export default Error;

const Actions = styled.div`
  margin-left: auto;
  float: right;
  /* display: flex; */
  /* flex-flow: row wrap; */
  /* justify-content: space-between; */
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 400;
`;

const Details = styled.div`
  font-size: 0.85rem;
  font-weight: 300;
  opacity: 0.6;
`;

const StyledError = styled(Card)`
  text-align: center;
  padding: 1rem;
  width: 400px;
  margin: 1rem auto;
`;
