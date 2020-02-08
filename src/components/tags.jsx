import React from "react";
import styled from "styled-components";
import Icon from "./icon";

const StyledTag = styled.span`
  cursor: help;
  margin: 0 0.25em;
  padding: 0;
  border-radius: 0.25em;
  color: ${({ theme, type }) => theme.tag[type] || null};
  font-weight: 500;
`;

const map = {
  nsfw: {
    tip: "Not Safe For Work",
    icon: null,
    text: "NSFW",
    type: "nsfw",
  },
  spoiler: {
    tip: "This post contains spoilers",
    icon: null,
    text: "Spoiler",
    type: "spoiler",
  },
  oc: {
    tip: "Original Content",
    icon: null,
    text: "OC",
    type: "oc",
  },
  quarantine: {
    tip: "This community is quarantined",
    icon: "alertTriangle",
    text: "Quarantined",
    type: "quarantine",
  },
  stickied: {
    tip: "stickied",
    icon: "pin",
    text: null,
    type: "stickied",
  },
  hidden: {
    tip: "Hidden",
    icon: "eyeOff",
    text: null,
    type: "hidden",
  },
  archived: {
    tip: "Archived. You won't be able to reply or vote.",
    icon: "archive",
    text: null,
    type: "restricted",
  },
  locked: {
    tip: "Locked. You won't be able to reply.",
    icon: "lock",
    text: null,
    type: "restricted",
  },
  approved: {
    tip: "Approved",
    icon: "check",
    text: null,
    type: "approved",
  },
  removed: {
    tip: "Removed",
    icon: "x",
    text: null,
    type: "removed",
  },
};

export default ({ flat, type, children, "data-tip": dataTip }) =>
  map[type] ? (
    <StyledTag
      type={map[type].type}
      data-tip={dataTip || map[type].tip}
      key={type}
      flat={flat ? "true" : undefined}
    >
      {map[type].icon ? <Icon inline icon={map[type].icon} /> : null}
      {map[type].text}
    </StyledTag>
  ) : (
    <StyledTag type={type} data-tip={dataTip}>
      {children}
    </StyledTag>
  );
