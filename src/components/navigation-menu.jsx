import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Dropdown from "./dropdown";
import SubscriptionList from "./subscription-list";
import Button from "./button";
import SubredditIcon, { Logo } from "./subreddit-icon";

const NavigationMenu = ({ location, subreddits }) => {
  const [label, setLabel] = useState("Reddit");

  useEffect(() => {
    const loc = location.name.toLowerCase();
    if (subreddits[loc] === undefined) {
      document.title = location.name;
      document.querySelector(
        'link[rel="shortcut icon"]'
      ).href = require("../icons/favicon.png");
      setLabel(
        <>
          <Logo size="small" />
          {location.name}
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
  }, [location.name, subreddits]);

  return (
    <Dropdown toggle={<Button size="large">{label}</Button>}>
      <SubscriptionList fromMenu />
    </Dropdown>
  );
};

export default connect(({ location, subreddits }) => ({
  location,
  subreddits,
}))(NavigationMenu);
