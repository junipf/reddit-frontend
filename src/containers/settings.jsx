import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Dropdown from "../components/dropdown";
import Button from "../components/button";

const sorts = {
  frontpage: ["best", "hot", "new", "rising", "controversial", "top"],
  subreddit: ["hot", "new", "rising", "controversial", "top"],
  search: ["relevance", "hot", "new", "comments", "top"],
  user: ["new", "hot", "top"],
  userLoggedIn: ["new", "hot", "top"],
};

const types = {
  // search: ["global", "subreddit"],
  user: ["overview", "posts", "comments"],
  userLoggedIn: [
    "overview",
    "posts",
    "comments",
    "saved",
    "hidden",
    "upvoted",
    "downvoted",
  ],
};

const timedSorts = ["top", "controversial"];

const times = ["hour", "day", "week", "month", "year", "all"];

const Settings = ({
  match: { params: path } = {},
  location,
  loggedIn,
  loggedInUsername,
}) => {
  const [settings, setSettings] = useState({
    sort: "best",
    time: "all",
    type: "overview",
    mode: "frontpage",
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const mode = searchParams.has("q")
      ? "search"
      : path.username
      ? path.username === loggedInUsername
        ? "userLoggedIn"
        : "user"
      : path.subName
      ? "subreddit"
      : "frontpage";

    const settings = {
      sort: path.sort || searchParams.get("sort") || sorts[mode][0],
      time: searchParams.get("t") || "all",
      type: path.type || types[mode] ? types[mode][0] : null,
      mode,
      username: path.username,
      subreddit: path.subName,
      query: searchParams.get("q"),
    };

    console.info(path, settings);

    setSettings(settings);
  }, [location.search, path, loggedInUsername]);

  const goTo = ({
    type = settings.type,
    sort = settings.sort,
    time = settings.time,
    mode = settings.mode,
    subreddit = settings.subreddit,
    query = settings.query,
  }) => {
    let params = new URLSearchParams();

    if (query) params.append("q", query);

    let urlSort = "";
    if (sort && sort !== sorts[mode][0]) {
      if ((mode === "search" || mode === "user" || mode === "userLoggedIn") && sort !== sorts[mode][0])
        params.append("sort", sort);
      else urlSort = "/" + sort;
    }

    if (timedSorts.includes(sort) && time !== "all") params.append("t", time);

    const urlLocation =
      mode === "user" || mode === "userLoggedIn"
        ? `/user/${path.username}`
        : mode === "subreddit" || (mode === "search" && subreddit)
        ? `/r/${path.subName}`
        : "";

    const urlType = types[mode] && type !== types[mode][0] ? `/${type}` : "";

    const urlParams =
      params.toString().length > 0 ? `/?${params.toString()}` : "";

    return urlLocation + urlSort + urlType + urlParams;
  };

  return (
    <>
      {settings.type && types[settings.mode] ? (
        <Dropdown label={settings.type} key="type-menu">
          {types[settings.mode].map((type) => (
            <Button
              key={type}
              label={type}
              to={goTo({ type })}
              primary={settings.type === type}
            />
          ))}
        </Dropdown>
      ) : null}
      <Dropdown label={settings.sort} key="sort-menu">
        {sorts[settings.mode].map((sort) =>
          sort === "top" || sort === "controversial" ? (
            <Dropdown label={sort} key={sort + "-submenu"}>
              {times.map((time) => (
                <Button
                  key={time + sort + "0"}
                  label={time}
                  to={goTo({ sort, time })}
                  primary={settings.time === time}
                />
              ))}
            </Dropdown>
          ) : (
            <Button
              key={sort + "1"}
              label={sort}
              to={goTo({ sort })}
              primary={settings.sort === sort}
            />
          )
        )}
      </Dropdown>
      {timedSorts.includes(settings.sort) ? (
        <Dropdown label={settings.time} key="times-menu">
          {times.map((time) => (
            <Button
              key={time + settings.sort + "2"}
              label={time}
              to={goTo({ sort: settings.sort, time })}
              primary={settings.time === time}
            />
          ))}
        </Dropdown>
      ) : null}
    </>
  );
};

export default connect((state) => ({
  loggedInUsername: state.user?.name,
  loggedIn: !!state.user,
}))(Settings);
