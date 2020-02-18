import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Dropdown from "../components/dropdown";
import Button from "../components/button";

const sorts = {
  frontpage: ["best", "hot", "new", "rising", "controversial", "top"],
  subreddit: ["hot", "new", "rising", "controversial", "top"],
  multi: ["hot", "new", "rising", "controversial", "top"],
  search: ["relevance", "hot", "new", "comments", "top"],
  user: ["new", "hot", "top"],
  userLoggedIn: ["new", "hot", "top"],
};

const types = {
  // search: ["global", "subreddit"],
  frontpage: [],
  subreddit: [],
  multi: [],
  search: [],
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

const Settings = ({ match: { params: path } = {}, location, loggedIn }) => {
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
      : path.multi
      ? "multi"
      : path.username
      ? path.username === loggedIn
        ? "userLoggedIn"
        : "user"
      : path.subName
      ? "subreddit"
      : "frontpage";

    const settings = {
      sort: path.sort || searchParams.get("sort") || sorts[mode][0],
      time: searchParams.get("t") || "all",
      type: types[mode]?.includes(path.type)
        ? path.type
        : "frontpage"
        ? types[mode][0]
        : null,
      mode,
      username: path.username,
      subreddit: path.subName,
      query: searchParams.get("q"),
      multi: path.multi,
    };

    console.info(path, settings);

    setSettings(settings);
  }, [location.search, path, loggedIn]);

  return <SettingsDropdowns settings={settings} />;
};

const SettingsDropdowns = ({ settings }) => {
  const goTo = ({
    type = settings.type,
    sort = settings.sort,
    time = settings.time,
    mode = settings.mode,
    subreddit = settings.subreddit,
    username = settings.username,
    query = settings.query,
    multi = settings.multi,
  }) => {
    let params = new URLSearchParams();

    if (query) params.append("q", query);

    let urlSort = "";
    if (sort && sort !== sorts[mode][0]) {
      if (
        (mode === "search" || mode === "user" || mode === "userLoggedIn") &&
        sort !== sorts[mode][0]
      )
        // if (sort) {
        //   if (mode === "search" || mode === "user" || mode === "userLoggedIn")
        params.append("sort", sort);
      else urlSort = "/" + sort;
    }

    if (timedSorts.includes(sort) && time !== "all") params.append("t", time);

    const urlLocation =
      mode === "multi"
        ? `/user/${username}/m/${multi}`
        : mode === "user" || mode === "userLoggedIn"
        ? `/user/${username}`
        : mode === "subreddit" || (mode === "search" && subreddit)
        ? `/r/${subreddit}`
        : "";

    const urlMode = mode === "search" ? "/search" : "";

    const urlType = types[mode] && type !== types[mode][0] ? `/${type}` : "";
    // const urlType = types[mode] ? `/${type}` : "";

    const urlParams =
      params.toString().length > 0 ? `/?${params.toString()}` : "";

    return urlLocation + urlMode + urlSort + urlType + urlParams;
  };
  return (
    <>
      {settings.type && types[settings.mode] ? (
        <Dropdown
          label={settings.type || types[settings.mode][0]}
          key="type-menu"
        >
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
                  to={goTo({ sort, time, type: settings.type })}
                  primary={settings.time === time}
                />
              ))}
            </Dropdown>
          ) : (
            <Button
              key={sort + "1"}
              label={sort}
              to={goTo({ sort, type: settings.type })}
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
              to={goTo({ sort: settings.sort, time, type: settings.type })}
              primary={settings.time === time}
            />
          ))}
        </Dropdown>
      ) : null}
    </>
  );
};

export default connect((state) => ({
  loggedIn: state?.user?.name,
}))(Settings);
