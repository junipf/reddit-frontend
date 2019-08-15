import React from "react";
import styled from "styled-components";
import Icon from "./icon";

const Error = ({ e, name, type }) => {
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
      : e.message.charAt(0) === 4
      ? "Something went wrong with reddit."
      : `Error ${e.message}`;

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

  return (
    <StyledError>
      <Icon icon={icon} size="xl" />
      <Title>{title}</Title>
      {details ? <Details>{details}</Details> : null}
    </StyledError>
  );
};

export default Error;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 400;
`;

const Details = styled.div`
  font-size: 0.85rem;
  font-weight: 300;
  opacity: 0.6;
`;

const StyledError = styled.div`
  width: auto;
  background-color: ${({ theme }) => theme.card.bg};
  text-align: center;
  padding: 1rem;
  border-radius: 0.15rem;
  width: 400px;
  margin: 1rem auto;
`;
