import React, { useEffect, useState } from "react";
import { withTheme } from "styled-components";
import { connect } from "react-redux";
import Dropdown from "./dropdown";
import SubscriptionList from "./subscription-list";
import Button from "./button";
import SubredditIcon from "./subreddit-icon";
import Logo from "./logo";
import Icon from "./icon";

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
    if (path.id) return;
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

    const isSearch = searchParams.get("q");

    let label = path.subName
      ? isSearch
        ? `Search r/${path.subName}`
        : "r/" + path.subName
      : isSearch
      ? "Search"
      : path.multi
      ? "m/" + path.multi
      : path.username
      ? "u/" + path.username
      : path.page || "Frontpage";

    document.title = pathname.includes("/search/")
      ? `${searchParams.get("q")} - search ${
          path.subName ? "r/" + path.subName : "reddit"
        }`
      : label;

    const subname = path.subName ? path.subName.toLowerCase() : null;

    setLabel(
      <>
        {isSearch ? (
          <Icon icon="search" />
        ) : subreddits[subname] ? (
          <SubredditIcon subName={subname} size="small" />
        ) : null}
        {label}
      </>
    );

    if (!subreddits[subname]) setFavicon();
  }, [
    defaultFavicon,
    search,
    pathname,
    path.subName,
    path.page,
    path.username,
    path.id,
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
