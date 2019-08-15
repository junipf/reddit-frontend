import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Dropdown from "./dropdown";
import SubscriptionList from "./subscription-list";
import Button from "./button";
import SubredditIcon, { Logo } from "./subreddit-icon";

const NavigationMenu = ({ locationName, subreddits }) => {
  const [label, setLabel] = useState("Reddit");

  useEffect(() => {
    const loc = locationName.toLowerCase();
    if (subreddits[loc] === undefined) {
      document.title = locationName;
      document.querySelector(
        'link[rel="shortcut icon"]'
      ).href = require("../icons/favicon.png");
      setLabel(
        <>
          <Logo size="small" />
          {locationName}
        </>
      );
    } else {
      const sub = subreddits[loc];
      document.title = (sub.curator ? " m/" : " r/") + sub.display_name;
      setLabel(
        <>
          <SubredditIcon subName={loc} size="small" />
          {(sub.curator ? " m/" : " r/") + sub.display_name}
        </>
      );
    }
  }, [locationName, subreddits]);

  return (
    <Dropdown toggle={<Button size="large">{label}</Button>}>
      <SubscriptionList fromMenu />
    </Dropdown>
  );
};

function mapStateToProps(state) {
  const { locationName, subreddits, user } = state;
  return {
    locationName,
    subreddits,
    user,
  };
}

export default connect(mapStateToProps)(NavigationMenu);
