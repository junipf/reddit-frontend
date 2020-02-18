import React, { useEffect, useState } from "react";
import { withTheme } from "styled-components";
import { connect } from "react-redux";
import Dropdown from "./dropdown";
import SubscriptionList from "./subscription-list";
import Button from "./button";
import SubredditIcon from "./subreddit-icon";
import Logo from "./logo";

const NavigationMenu = ({
  location,
  match,
  match: { params: path },
  location: { search, pathname },
  subreddits,
  theme,
}) => {
  const [label, setLabel] = useState(null);
  const defaultFavicon = require("../icons/favicon.png");

  useEffect(() => {
    const setFavicon = (href = defaultFavicon) =>
      (document.querySelector('link[rel="shortcut icon"]').href = href);

    const searchParams = new URLSearchParams(search);

    // let title = "";
    // title += pathname.includes("/search/")
    //   ? searchParams.get("q") + " - search "
    //   : "";
    // title += path.subName ? "r/" + path.subName : "";
    // title += path.username ? "u/" + path.username : "";
    // if (title === "") title = "Frontpage";
    // document.title = title;

    let label = path.subName
      ? "r/" + path.subName
      : path.multi
      ? "m/" + path.multi
      : path.username
      ? "u/" + path.username
      : path.page || "Frontpage";

    document.title = pathname.includes("/search/")
      ? searchParams.get("q") + " - search " + label
      : label;

    const subname = path.subName ? path.subName.toLowerCase() : null;

    setLabel(
      <>
        {subreddits[subname] ? (
          <SubredditIcon subName={subname} size="small" />
        ) : null}
        {label}
      </>
    );

    if (!subreddits[subname]) setFavicon();

    // if (subreddits[subname] === undefined) {
    //   setFavicon();
    //   setLabel(label);
    // } else {
    //   const sub = subreddits[subname];
    //   setLabel(
    //     <>
    //       <SubredditIcon subName={subname} size="small" />
    //       {(sub.curator ? " m/" : " r/") + sub.display_name}
    //     </>
    //   );
    // }
  }, [
    defaultFavicon,
    search,
    pathname,
    path.subName,
    path.page,
    path.username,
    path.multi,
    subreddits,
    theme.primary.base,
  ]);

  return (
    <>
      <Button size="large" flat to="/">
        <Logo color={theme.primary.base} />
      </Button>
      <Dropdown preRender toggle={<Button>{label}</Button>}>
        <SubscriptionList fromMenu />
      </Dropdown>
    </>
  );
};

export default connect(({ subreddits }) => ({
  subreddits,
}))(withTheme(NavigationMenu));
