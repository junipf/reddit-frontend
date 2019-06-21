import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Icon from "./icon";
import { Timestamp } from "./timestamp";

// for use with user reports
export class ExpandoBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }
  render() {
    return (
      <Banner>
        <button className="button">Expand</button>
      </Banner>
    );
  }
}

export const Banner = props => {
  const { type, icon, label, "data-tip": data_tip, children } = props;
  return (
    <StyledBanner type={type} data-tip={data_tip}>
      {icon && <Icon icon={icon} />}
      <span>
        {label}
        {children}
      </span>
    </StyledBanner>
  );
};
const StyledBanner = styled.span`
  cursor: help;
  color: ${props => props.theme.tag[props.type]};
`;
Banner.propTypes = {
  type: PropTypes.oneOf([
    "sticky",
    "restricted",
    "hidden",
    "mod-approved",
    "mod-removed",
    "mod-reports",
  ]),
  icon: PropTypes.node,
  label: PropTypes.string,
};

export const InfoBanners = props => {
  const { archived, locked, hidden, stickied } = props;
  let banners = [];

  if (stickied) {
    banners.push(
      <Banner
        type="sticky"
        icon="pin"
        data-tip="This post has been stickied."
        key="0"
      />
    );
  }
  if (archived) {
    banners.push(
      <Banner
        type="restricted"
        icon="Archive"
        // label="Archived"
        data-tip="This post has been archived. You won't be able to comment or vote."
        key="1"
      />
    );
  }
  if (locked) {
    banners.push(
      <Banner
        type="restricted"
        icon="Lock"
        // label="Locked"
        data-tip="This post has been locked. You won't be able to comment."
        key="2"
      />
    );
  }
  if (hidden) {
    banners.push(
      <Banner
        type="hidden"
        icon="EyeOff"
        // label="Hidden"
        data-tip="This post is hidden, so it isn't in any listing."
        key="3"
      />
    );
  }
  return <>{banners}</>;
};

export const ModBanners = props => {
  const {
    isMod,

    // report_reasons,
    // ignore_reports,
    user_reports,

    // approved_at_utc,
    approved_by,
    removed,
    spam,
  } = props;

  if (!isMod) return null;

  let banners = [];

  if (user_reports.length > 0) {
    banners.push(
      <Banner
        type="mod-reports"
        icon="Eye"
        label={"User reports! " + user_reports + " "}
        key="0"
      />
    );
  }
  if (removed) {
    banners.push(
      <Banner type="mod-removed" icon="x" label="Removed!" key="1" />
    );
  }
  if (spam) {
    banners.push(
      <Banner
        type="mod-reports"
        icon="Eye"
        label={"User reports! " + user_reports + " "}
        key="2"
      />
    );
  }
  if (approved_by) {
    banners.push(
      <Banner
        type="mod-approved"
        icon="Check"
        label={"Approved by " + approved_by.name + " "}
        key="3"
      >
        <Timestamp time={props.approved_at_utc} />
      </Banner>
    );
  }
  return <>{banners}</>;
};
