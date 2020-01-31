import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Column } from "./column";
import SubscriptionList from "../components/subscription-list";
import { setLocation } from './../store/actions';

const SubscriptionsPage = ({ setLocation }) => {
  useEffect(() => {
    setLocation({ name: "Subscriptions", type: "other" });
  }, [setLocation]);
  return (
    <Column>
      <SubscriptionList page />
    </Column>
  );
};

export default connect(
  null,
  { setLocation }
)(SubscriptionsPage);
