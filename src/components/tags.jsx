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

const Tag = ({ flat, type, children, "data-tip": dataTip }) => (
  <StyledTag type={type} data-tip={dataTip}>
    {children}
  </StyledTag>
);

Tag.NSFW = ({ flat }) => (
  <StyledTag type="nsfw" data-tip="Not Safe For Work" key="nsfw" flat={flat}>
    NSFW
  </StyledTag>
);

Tag.Spoiler = ({ flat }) => (
  <StyledTag
    type="spoiler"
    data-tip="This post contains spoilers"
    key="spoiler"
    flat={flat}
  >
    Spoiler
  </StyledTag>
);
Tag.OC = ({ flat }) => (
  <StyledTag type="oc" data-tip="Original Content" key="oc" flat={flat}>
    OC
  </StyledTag>
);

Tag.Quarantine = ({ flat = true }) => (
  <StyledTag
    flat={flat}
    type="quarantine"
    data-tip="This community is quarantined."
    key="quarantine"
  >
    <Icon icon="alertTriangle" />
    Quarantined
  </StyledTag>
);

Tag.Stickied = ({ flat = true }) => (
  <StyledTag flat={flat} type="stickied" data-tip="stickied" key="stickied">
    <Icon icon="pin" fill />
  </StyledTag>
);

Tag.Hidden = ({ flat = true }) => (
  <StyledTag flat={flat} type="hidden" data-tip="Hidden" key="locked">
    <Icon icon="eyeOff" />
  </StyledTag>
);

Tag.Archived = ({ flat = true }) => (
  <StyledTag
    flat={flat}
    type="restricted"
    data-tip="Archived. You won't be able to reply or vote."
    key="archived"
  >
    <Icon icon="archive" fill />
  </StyledTag>
);

Tag.Locked = ({ flat = true }) => (
  <StyledTag
    flat={flat}
    type="restricted"
    data-tip="Locked. You won't be able to reply."
    key="locked"
  >
    <Icon icon="lock" fill />
  </StyledTag>
);

Tag.Approved = ({ flat = true }) => (
  <StyledTag flat={flat} type="approved" data-tip="Approved" key="approved">
    <Icon icon="check" fill />
  </StyledTag>
);

Tag.Removed = ({ flat = true }) => (
  <StyledTag flat={flat} type="removed" data-tip="Removed" key="removed">
    <Icon icon="x" fill />
  </StyledTag>
);

export default Tag;
