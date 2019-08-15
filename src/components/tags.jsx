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

export default class Tag extends React.Component {
  static NSFW = ({ flat }) => (
    <StyledTag type="nsfw" data-tip="Not Safe For Work" key="nsfw" flat={flat}>
      NSFW
    </StyledTag>
  );
  static Spoiler = ({ flat }) => (
    <StyledTag
      type="spoiler"
      data-tip="This post contains spoilers"
      key="spoiler"
      flat={flat}
    >
      Spoiler
    </StyledTag>
  );
  static OC = ({ flat }) => (
    <StyledTag type="oc" data-tip="Original Content" key="oc" flat={flat}>
      OC
    </StyledTag>
  );
  static Quarantine = ({ flat = true }) => (
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
  static Stickied = ({ flat = true }) => (
    <StyledTag flat={flat} type="stickied" data-tip="stickied" key="stickied">
      <Icon icon="pin" fill />
    </StyledTag>
  );
  static Hidden = ({ flat = true }) => (
    <StyledTag flat={flat} type="hidden" data-tip="Hidden" key="locked">
      <Icon icon="eyeOff" />
    </StyledTag>
  );
  static Archived = ({ flat = true }) => (
    <StyledTag
      flat={flat}
      type="restricted"
      data-tip="Archived. You won't be able to reply or vote."
      key="archived"
    >
      <Icon icon="archive" fill />
    </StyledTag>
  );
  static Locked = ({ flat = true }) => (
    <StyledTag
      flat={flat}
      type="restricted"
      data-tip="Locked. You won't be able to reply."
      key="locked"
    >
      <Icon icon="lock" fill />
    </StyledTag>
  );
  static Approved = ({ flat = true }) => (
    <StyledTag flat={flat} type="approved" data-tip="Approved" key="approved">
      <Icon icon="check" fill />
    </StyledTag>
  );
  static Removed = ({ flat = true }) => (
    <StyledTag flat={flat} type="removed" data-tip="Removed" key="removed">
      <Icon icon="x" fill />
    </StyledTag>
  );
  render() {
    const { type, children, "data-tip": dataTip } = this.props;
    return (
      <StyledTag type={type} data-tip={dataTip}>
        {children}
      </StyledTag>
    );
  }
}

// "quarantine", // tag
// "nsfw", // tag
// "spoiler", // tag
// "sticky",
// "restricted",
// "hidden",
// "mod-approved",
// "mod-removed",
// "mod-reports",
