import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import Dropdown from "./dropdown";
import SubscriptionList from "./subscription-list";
import { QuickNavigation } from "./quick-navigation";

const NavigationMenu = props => (
  <NavMenu>
    <Dropdown icon="menu" label={props.locationName}>
      <SubscriptionList />
    </Dropdown>
  </NavMenu>
);

const NavMenu = styled.div`
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
`;

function mapStateToProps(state) {
  const { locationName } = state;
  return {
    locationName,
  };
}

export default connect(mapStateToProps)(NavigationMenu);
