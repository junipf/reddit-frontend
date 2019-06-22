import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

export const Tag = ({ type, label, ...props }) => (
  <StyledTag type={type} {...props}>
    {label}
  </StyledTag>
);
Tag.propTypes = {
  type: PropTypes.oneOf(["quarantine", "spoiler", "nsfw", "oc"]),
  label: PropTypes.string,
};

const StyledTag = styled.span`
  margin: 0 0.25em;
  padding: 0.125em 0.25em;
  border-radius: 0.25em;
  color: ${props => props.theme.tag[props.type].fg};
  background: ${props => props.theme.tag[props.type].bg};
`;

export const Tags = props => {
  const { nsfw, spoiler, quarantine, oc } = props;
  let banners = [];
  if (quarantine) {
    banners.push(
      <Tag
        type="quarantine"
        label="Quarantine"
        data-tip="This community is quarantined."
        key="0"
      />
    );
  }
  if (nsfw) {
    banners.push(
      <Tag type="nsfw" label="NSFW" data-tip="Not Safe For Work" key="1" />
    );
  }
  if (spoiler) {
    banners.push(
      <Tag
        type="spoiler"
        label="Spoiler"
        data-tip="This post contains spoilers"
        key="2"
      />
    );
  }
  if (oc) {
    banners.push(
      <Tag type="oc" label="OC" data-tip="Original Content" key="3" />
    );
  }
  return <>{banners}</>;
};
