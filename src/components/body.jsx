import React, { useState, useLayoutEffect, useRef } from "react";
import styled from "styled-components";
import Button from "./button";

const Text = styled.div`
  padding: 0.5rem 0.75rem;
  padding-bottom: ${({ overflow }) => (overflow ? "1.5rem" : null)};
  position: relative;
  overflow: ${({ clip }) => (clip ? "hidden" : null)};
  height: ${({ clip }) => (clip ? "384px" : "auto")};
  transition: height 0.1s ease;
  filter: ${({ blur }) => (blur ? "blur(3px)" : null)};
  &:after {
    display: ${({ clip }) => (clip ? "block" : "none")};
    content: "";
    width: 100%;
    height: 5rem;
    background: ${({ theme }) =>
      "linear-gradient(transparent 0%, " + theme.card.innerBg + " 78%)"};
    position: absolute;
    bottom: 0;
    left: 0;
    pointer-events: none;
  }
  a {
    color: ${({ theme }) => theme.link};
    text-decoration: underline;
  }
`;

const Actions = styled.div`
  width: 100%;
  text-align: center;
  /* padding: 0.25rem; */
  position: absolute;
  bottom: 0;
  left: 0;
  opacity: 0.9;
  overflow: visible;
`;

export const Body = ({ inListing, html, ...rest }) => {
  const [overflow, setOverflow] = useState(undefined);
  const [showAll, setShowAll] = useState(!inListing || undefined);
  const toggleShowAll = () => setShowAll(!showAll);
  const body = useRef(null);

  useLayoutEffect(() => {
    if (inListing && body.current.clientHeight >= 512) setOverflow("true");
  }, [body, inListing]);

  return (
    <div>
      <Text
        ref={body}
        clip={inListing && !showAll && overflow ? "true" : undefined}
        overflow={overflow}
        dangerouslySetInnerHTML={{ __html: html }}
        {...rest}
      />
      {overflow ? (
        <Actions>
          <Button
            flat
            align="center"
            size="fill"
            icon={showAll ? "chevronUp" : "chevronDown"}
            onClick={toggleShowAll}
          />
        </Actions>
      ) : null}
    </div>
  );
};
