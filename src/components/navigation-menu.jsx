import React, { useEffect, useState } from "react";
import { withTheme } from "styled-components";
import { connect } from "react-redux";
import Dropdown from "./dropdown";
import SubscriptionList from "./subscription-list";
import Button from "./button";
import SubredditIcon from "./subreddit-icon";
import Logo from "./logo";

const NavigationMenu = ({ location, subreddits, theme }) => {
  const [label, setLabel] = useState("Reddit");

  useEffect(() => {
    const loc = location.name.toLowerCase();
    if (subreddits[loc] === undefined) {
      document.title = location.title || location.name;
      document.querySelector(
        'link[rel="shortcut icon"]'
      ).href = require("../icons/favicon.png");
      setLabel(
        <>
          <Logo color={theme.primary.base} />
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
  }, [location, subreddits, theme.primary.base]);

  return (
    <Dropdown toggle={<Button size="large">{label}</Button>}>
      <SubscriptionList fromMenu />
    </Dropdown>
  );
};

export default connect(({ location, subreddits }) => ({
  location,
  subreddits,
}))(withTheme(NavigationMenu));
